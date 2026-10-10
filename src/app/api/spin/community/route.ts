import { NextRequest, NextResponse } from "next/server";
import {
  normalizeAddress,
  loadDatabase,
  getDailyPoolStats,
  hasIpClaimedX,
  recordIpClaimX,
} from "@/lib/db";
import { executePrivyServerPayout } from "@/lib/payoutEngine";
import { getCommunitySegments, determineWeightedOutcome } from "@/lib/spinEngine";
import { SPINO_CONFIG } from "@/config/spino";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    // 1. IP-Based Claim Restriction
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    if (hasIpClaimedX(clientIp)) {
      return NextResponse.json(
        {
          error: "This device has already claimed the X reward",
          code: "IP_ALREADY_CLAIMED",
        },
        { status: 403 }
      );
    }

    const cleanAddress = normalizeAddress(address);
    const db = loadDatabase();
    const wallet = db.wallets[cleanAddress];

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found. Connect wallet first." }, { status: 404 });
    }

    // 2. Safety Rail: Daily Cap
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

    // 3. Social Verification (Follow + Retweet)
    if (!wallet.x_verified_follow || !wallet.x_verified_retweet) {
      return NextResponse.json(
        {
          error: "You must follow @SpinoFun and retweet our pinned announcement to unlock the X Community Spin.",
          code: "X_VERIFICATION_REQUIRED",
        },
        { status: 403 }
      );
    }

    // 4. Server-Side Authoritative Outcome Selection FIRST
    const segments = getCommunitySegments();
    const outcome = determineWeightedOutcome(segments);

    // 5. Trigger AUTOMATIC Payout Immediately via Privy Server Wallet on Robinhood Chain
    const payoutResult = await executePrivyServerPayout({
      wallet_address: cleanAddress,
      spin_type: "community",
      amount_won_usd: outcome.amountWonUsd,
      segment_label: outcome.label,
      segment_index: outcome.segmentIndex,
      holding_tier: null,
      balance_usd_at_spin: wallet.last_balance_usd,
    });

    // 6. Record IP in x_claims so this IP cannot claim again
    recordIpClaimX(clientIp, cleanAddress, wallet.x_handle || "");

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
      status: payoutResult.status,
      payoutTxHash: payoutResult.txHash,
      ethAmount: payoutResult.ethAmount,
      ethPriceUsd: payoutResult.ethPriceUsd,
      explorerUrl: payoutResult.explorerUrl,
      message: payoutResult.message,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process community spin" }, { status: 500 });
  }
}

