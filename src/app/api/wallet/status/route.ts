import { NextRequest, NextResponse } from "next/server";
import { updateWalletBalance, normalizeAddress, loadDatabase, hasIpClaimedX } from "@/lib/db";
import { getLiveSpinPrice } from "@/lib/priceOracle";
import { viemPublicClient } from "@/lib/viemClient";
import { SPINO_CONFIG } from "@/config/spino";

async function processWalletStatus(address: string, balanceTokensInput?: number, clientIp: string = "127.0.0.1") {
  const cleanAddress = normalizeAddress(address);
  const quote = await getLiveSpinPrice();
  const tokenPriceUsd = quote.priceUsd;

  let tokens = typeof balanceTokensInput === "number" ? balanceTokensInput : 0;
  const db = loadDatabase();
  const existing = db.wallets[cleanAddress];

  if (typeof balanceTokensInput !== "number" && existing) {
    tokens = existing.last_balance_tokens;
  }

  // On-Chain Token Balance verification on Robinhood Chain (ERC-20 balanceOf)
  if (cleanAddress.startsWith("0x") && cleanAddress.length === 42 && SPINO_CONFIG.TOKEN_CONTRACT.startsWith("0x")) {
    try {
      const rawBalance = await viemPublicClient.readContract({
        address: SPINO_CONFIG.TOKEN_CONTRACT,
        abi: [
          {
            name: "balanceOf",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "account", type: "address" }],
            outputs: [{ name: "", type: "uint256" }],
          },
        ],
        functionName: "balanceOf",
        args: [cleanAddress as `0x${string}`],
      });
      const onChainTokens = Number(rawBalance) / 10 ** SPINO_CONFIG.TOKEN_DECIMALS;
      if (!isNaN(onChainTokens) && onChainTokens >= 0) {
        tokens = onChainTokens;
      }
    } catch {
      // Gracefully retain existing balance if contract is unindexed or during network testing
    }
  }

  const result = updateWalletBalance(cleanAddress, tokens, tokenPriceUsd);
  const ipAlreadyClaimedX = hasIpClaimedX(clientIp);

  const isEligibleForCommunitySpin =
    result.wallet.x_verified_follow &&
    result.wallet.x_verified_retweet &&
    !ipAlreadyClaimedX;

  return {
    address: cleanAddress,
    balanceTokens: result.wallet.last_balance_tokens,
    balanceUsd: result.balanceUsd,
    tokenPriceUsd,
    tokensForOneDollar: quote.tokensForOneDollar,
    eligibilityStatus: result.eligibilityStatus,
    tier: result.tier,
    tierConfig: result.tier ? SPINO_CONFIG.TIERS[`TIER_${result.tier}`] : null,
    holdingMinutes: result.holdingMinutes,
    holdingRequiredMinutes: result.holdingRequiredMinutes,
    countdownSeconds: result.countdownSeconds,
    tierLocked: result.tierLocked,
    tierLockReason: result.tierLockReason,
    tier3CooldownSeconds: result.tier3CooldownSeconds,
    isFullyEligibleForHolderSpin: result.isFullyEligibleForHolderSpin,
    isEligibleForCommunitySpin,
    ipAlreadyClaimedX,
    xStatus: {
      handle: result.wallet.x_handle,
      verifiedFollow: result.wallet.x_verified_follow,
      verifiedRetweet: result.wallet.x_verified_retweet,
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const balanceParam = searchParams.get("balanceTokens");
    const balanceTokens = balanceParam !== null ? parseFloat(balanceParam) : undefined;

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    const data = await processWalletStatus(address, balanceTokens, clientIp);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to get wallet status" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, balanceTokens } = body;

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    const data = await processWalletStatus(address, balanceTokens, clientIp);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to get wallet status" }, { status: 500 });
  }
}
