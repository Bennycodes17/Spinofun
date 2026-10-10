import { NextRequest, NextResponse } from "next/server";
import { retryPendingClaim } from "@/lib/payoutEngine";
import { SPINO_CONFIG } from "@/config/spino";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claimId, secret } = body;

    // Optional admin check if secret provided, or allow retrying an existing claimId directly
    if (secret && secret !== SPINO_CONFIG.ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!claimId) {
      return NextResponse.json({ error: "claimId is required" }, { status: 400 });
    }

    const result = await retryPendingClaim(claimId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        claim: result.claim,
        message: `Payout successfully processed! Tx: ${result.claim.payout_tx_hash}`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          claim: result.claim,
          error: result.error || "Retry failed",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retry payout" }, { status: 500 });
  }
}
