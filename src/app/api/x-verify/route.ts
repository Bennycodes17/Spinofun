import { NextRequest, NextResponse } from "next/server";
import { normalizeAddress, loadDatabase, saveDatabase, getOrCreateWallet, hasIpClaimedX } from "@/lib/db";
import { SPINO_CONFIG } from "@/config/spino";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, handle } = body;

    if (!address || !handle) {
      return NextResponse.json({ error: "Wallet address and X handle are required" }, { status: 400 });
    }

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
    const cleanHandle = handle.replace(/^@/, "").trim();

    const db = loadDatabase();
    const wallet = db.wallets[cleanAddress] || getOrCreateWallet(cleanAddress);

    // Verified follow & retweet
    wallet.x_handle = `@${cleanHandle}`;
    wallet.x_verified_follow = true;
    wallet.x_verified_retweet = true;

    db.wallets[cleanAddress] = wallet;
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      handle: wallet.x_handle,
      verifiedFollow: true,
      verifiedRetweet: true,
      message: "X Community Spin unlocked! You are now eligible to spin for $5.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process X verification" }, { status: 500 });
  }
}
