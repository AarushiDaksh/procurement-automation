import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

// GET: list vendor's quotes (demo)
export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["vendor", "admin"]);
  if (!auth.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({
    items: [
      { id: "q1", rfqId: "rfq-101", price: 12000, status: "submitted" },
      { id: "q2", rfqId: "rfq-108", price: 9800, status: "draft" }
    ]
  });
}
