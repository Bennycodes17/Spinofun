import { NextResponse } from "next/server";
import { getLiveSpinPrice } from "@/lib/priceOracle";

export async function GET() {
  try {
    const quote = await getLiveSpinPrice();
    return NextResponse.json(quote);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch price" }, { status: 500 });
  }
}
