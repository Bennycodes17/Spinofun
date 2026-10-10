import { NextRequest, NextResponse } from "next/server";
import { loadDatabase, getDailyPoolStats } from "@/lib/db";
import { SPINO_CONFIG } from "@/config/spino";

function checkAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const adminSecret = req.headers.get("x-admin-secret");
  const expectedSecret = SPINO_CONFIG.ADMIN_PASSCODE;

  if (adminSecret === expectedSecret) return true;
  if (authHeader && authHeader.replace(/^Bearer\s+/i, "") === expectedSecret) return true;

  return false;
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin authentication required." }, { status: 401 });
  }

  const db = loadDatabase();
  const pool = getDailyPoolStats();

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get("status");

  let claims = [...db.claims];
  if (statusFilter && ["paid", "failed"].includes(statusFilter)) {
    claims = claims.filter((c) => c.status === statusFilter);
  }

  return NextResponse.json({
    pool,
    totalClaimsCount: db.claims.length,
    paidClaimsCount: db.claims.filter((c) => c.status === "paid").length,
    failedClaimsCount: db.claims.filter((c) => c.status === "failed").length,
    claims,
  });
}
