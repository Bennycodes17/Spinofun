import { NextRequest, NextResponse } from "next/server";
import { exportClaimsCsv } from "@/lib/db";
import { SPINO_CONFIG } from "@/config/spino";

export async function GET(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret") || new URL(req.url).searchParams.get("secret");
  const authHeader = req.headers.get("authorization");

  const isAuth =
    adminSecret === SPINO_CONFIG.ADMIN_PASSCODE ||
    (authHeader && authHeader.replace(/^Bearer\s+/i, "") === SPINO_CONFIG.ADMIN_PASSCODE);

  if (!isAuth) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const csv = exportClaimsCsv();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="spino-claims-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
