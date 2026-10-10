import { NextResponse } from "next/server";
import { flushPendingPayoutQueue } from "@/lib/payoutEngine";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const result = await flushPendingPayoutQueue();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API /api/payouts/flush] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to flush payout queue" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await flushPendingPayoutQueue();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API /api/payouts/flush] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to flush payout queue" }, { status: 500 });
  }
}
