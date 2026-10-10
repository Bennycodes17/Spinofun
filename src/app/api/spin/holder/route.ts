import { NextRequest, NextResponse } from "next/server";
import { normalizeAddress, loadDatabase, getDailyPoolStats } from "@/lib/db";
import { executePrivyServerPayout } from "@/lib/payoutEngine";
import { getSegmentsForTier, determineWeightedOutcome } from "@/lib/spinEngine";
import { SPINO_CONFIG } from "@/config/spino";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const cleanAddress = normalizeAddress(address);
    const db = loadDatabase();
    const wallet = db.wallets[cleanAddress];

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found. Please connect your wallet first." },
        { status: 404 }
      );
    }

    // 1. Safety Rail: Daily Global Payout Cap
    const pool = getDailyPoolStats();
    if (pool.isCapReached) {
      return NextResponse.json(
        {
          error: "Today's rewards are fully claimed — check back tomorrow",
          code: "DAILY_CAP_REACHED",
        },
        { status: 429 }
      );
    }

    // 2. Minimum Balance Check ($1.00 USD)
    if (wallet.last_balance_usd < SPINO_CONFIG.HOLD_USD_THRESHOLD) {
      return NextResponse.json(
        {
          error: `Insufficient balance. You must hold at least $${SPINO_CONFIG.HOLD_USD_THRESHOLD}.00 of $SPIN to spin.`,
          code: "BELOW_THRESHOLD",
        },
        { status: 403 }
      );
    }

    // 3. Continuous 30-Minute Holding Duration Check
    if (!wallet.first_seen_above_threshold) {
      return NextResponse.json(
        {
          error: "Holding duration timer has not started.",
          code: "HOLD_NOT_STARTED",
        },
        { status: 403 }
      );
    }

    const firstSeen = new Date(wallet.first_seen_above_threshold).getTime();
    const holdingMs = Date.now() - firstSeen;
    const requiredHoldingMs = SPINO_CONFIG.HOLD_DURATION_MINUTES * 60 * 1000;

    if (holdingMs < requiredHoldingMs) {
      const remainingSeconds = Math.ceil((requiredHoldingMs - holdingMs) / 1000);
      const remainingMins = Math.floor(remainingSeconds / 60);
      const remainingSecs = remainingSeconds % 60;
      return NextResponse.json(
        {
          error: `Holding duration requirement not met. Eligible in ${remainingMins}m ${remainingSecs}s.`,
          code: "HOLD_INCOMPLETE",
          remainingSeconds,
        },
        { status: 403 }
      );
    }

    // 4. Spin-Lock Rule Check (Tier 1 & 2 must advance to next tier; Tier 3 gets 24h cooldown)
    if (wallet.holder_last_spin_tier === 1 && wallet.last_balance_usd < SPINO_CONFIG.TIERS.TIER_2.minUsd) {
      return NextResponse.json(
        {
          error: "Tier 1 spin claimed. Advance to Tier 2 ($50+) to unlock your next spin!",
          code: "TIER_ADVANCE_REQUIRED",
          requiredTier: 2,
          requiredMinUsd: SPINO_CONFIG.TIERS.TIER_2.minUsd,
        },
        { status: 403 }
      );
    }

    if (wallet.holder_last_spin_tier === 2 && wallet.last_balance_usd < SPINO_CONFIG.TIERS.TIER_3.minUsd) {
      return NextResponse.json(
        {
          error: "Tier 2 spin claimed. Advance to Tier 3 ($500+) to unlock your next spin!",
          code: "TIER_ADVANCE_REQUIRED",
          requiredTier: 3,
          requiredMinUsd: SPINO_CONFIG.TIERS.TIER_3.minUsd,
        },
        { status: 403 }
      );
    }

    // Tier 3 24h Cooldown
    if (wallet.last_balance_usd >= SPINO_CONFIG.TIERS.TIER_3.minUsd && wallet.holder_last_spin_at) {
      const cooldownMs = SPINO_CONFIG.TIER3_COOLDOWN_HOURS * 3600 * 1000;
      const lastSpinMs = new Date(wallet.holder_last_spin_at).getTime();
      const elapsed = Date.now() - lastSpinMs;
      if (elapsed < cooldownMs) {
        const cooldownRemaining = Math.ceil((cooldownMs - elapsed) / 1000);
        return NextResponse.json(
          {
            error: `Tier 3 cooldown active. Next spin available in ${Math.floor(cooldownRemaining / 3600)}h ${Math.floor((cooldownRemaining % 3600) / 60)}m.`,
            code: "COOLDOWN_ACTIVE",
            cooldownRemaining,
          },
          { status: 429 }
        );
      }
    }

    // 5. Determine Tier from balance
    let tier: 1 | 2 | 3 = 1;
    if (wallet.last_balance_usd >= SPINO_CONFIG.TIERS.TIER_3.minUsd) {
      tier = 3;
    } else if (wallet.last_balance_usd >= SPINO_CONFIG.TIERS.TIER_2.minUsd) {
      tier = 2;
    }

    // 6. Server-Side Authoritative Outcome Selection FIRST
    const segments = getSegmentsForTier(tier);
    const outcome = determineWeightedOutcome(segments);

    // 7. Trigger AUTOMATIC Payout Immediately via Privy Server Wallet on Robinhood Chain
    const payoutResult = await executePrivyServerPayout({
      wallet_address: cleanAddress,
      spin_type: "holder",
      amount_won_usd: outcome.amountWonUsd,
      segment_label: outcome.label,
      segment_index: outcome.segmentIndex,
      holding_tier: tier,
      balance_usd_at_spin: wallet.last_balance_usd,
    });

    return NextResponse.json({
      success: true,
      payoutId: payoutResult.claim.id,
      outcome: {
        segmentIndex: outcome.segmentIndex,
        label: outcome.label,
        amountWonUsd: outcome.amountWonUsd,
        targetAngle: outcome.targetAngle,
        totalSegments: outcome.totalSegments,
      },
      holdingTier: tier,
      status: payoutResult.status,
      payoutTxHash: payoutResult.txHash,
      ethAmount: payoutResult.ethAmount,
      ethPriceUsd: payoutResult.ethPriceUsd,
      explorerUrl: payoutResult.explorerUrl,
      message: payoutResult.message,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process spin" }, { status: 500 });
  }
}
