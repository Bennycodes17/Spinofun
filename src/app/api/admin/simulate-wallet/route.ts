import { NextRequest, NextResponse } from "next/server";
import { normalizeAddress, loadDatabase, saveDatabase, getOrCreateWallet } from "@/lib/db";
import { getLiveSpinPrice } from "@/lib/priceOracle";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      address,
      balanceUsd,
      holdingMinutes,
      holdingHours,
      resetCooldowns,
      verifyX,
      previousSpinTier,
    } = body;

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const cleanAddress = normalizeAddress(address);
    const db = loadDatabase();
    const wallet = db.wallets[cleanAddress] || getOrCreateWallet(cleanAddress);

    const quote = await getLiveSpinPrice();
    const priceUsd = quote.priceUsd;

    if (typeof balanceUsd === "number") {
      wallet.last_balance_usd = balanceUsd;
      wallet.last_balance_tokens = Math.round(balanceUsd / priceUsd);
      if (balanceUsd < 1) {
        wallet.first_seen_above_threshold = null;
      }
    }

    const minutes = typeof holdingMinutes === "number" ? holdingMinutes : typeof holdingHours === "number" ? holdingHours * 60 : null;
    if (typeof minutes === "number") {
      if (minutes > 0) {
        const past = new Date(Date.now() - minutes * 60 * 1000).toISOString();
        wallet.first_seen_above_threshold = past;
      } else {
        wallet.first_seen_above_threshold = null;
      }
    }

    if (resetCooldowns) {
      wallet.holder_last_spin_at = null;
      wallet.holder_last_spin_tier = null;
      wallet.community_last_spin_at = null;
    }

    if (previousSpinTier) {
      wallet.holder_last_spin_tier = previousSpinTier;
      wallet.holder_last_spin_at = new Date().toISOString();
    }

    if (verifyX) {
      wallet.x_verified_follow = true;
      wallet.x_verified_retweet = true;
      wallet.x_handle = wallet.x_handle || "@SpinTester";
    }

    db.wallets[cleanAddress] = wallet;
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Wallet ${cleanAddress} updated with simulated test parameters`,
      wallet,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Simulation failed" }, { status: 500 });
  }
}
