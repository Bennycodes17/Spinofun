import { NextResponse } from "next/server";
import { getDailyPoolStats, getRecentPaidWins, loadDatabase } from "@/lib/db";
import { getLiveSpinPrice } from "@/lib/priceOracle";
import { flushPendingPayoutQueue } from "@/lib/payoutEngine";

let lastQueueFlush = 0;

export async function GET() {
  try {
    // If pending payouts exist, periodically trigger background flush (every 15s)
    const now = Date.now();
    if (now - lastQueueFlush > 15_000) {
      lastQueueFlush = now;
      const db = loadDatabase();
      const hasPending = db.claims.some((c) => c.status === "pending_retry");
      if (hasPending) {
        // Run asynchronously without blocking the stats response
        flushPendingPayoutQueue().catch((err) => console.warn("[Auto-Flush Error]:", err.message));
      }
    }

    const pool = getDailyPoolStats();
    const recentWins = getRecentPaidWins(10);
    const priceQuote = await getLiveSpinPrice();

    return NextResponse.json({
      totalPaidOutTodayUsd: pool.totalPaidToday,
      totalClaimedTodayUsd: pool.totalClaimedToday,
      dailyCapUsd: pool.dailyCap,
      isCapReached: pool.isCapReached,
      remainingInCapUsd: pool.remainingInCap,
      resetInSeconds: pool.resetInSeconds,
      recentPaidWins: recentWins,
      tokenPriceUsd: priceQuote.priceUsd,
      tokensForOneDollar: priceQuote.tokensForOneDollar,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 });
  }
}
