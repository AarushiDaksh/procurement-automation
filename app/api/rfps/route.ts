import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/authz";
// import Rfp from "@/models/Rfp";  // add your Rfp model when ready
// import { dbConnect } from "@/lib/db";

export async function POST(req: NextRequest) {
  await requireRole(["ADMIN", "BUYER"]);
  // const data = await req.json();
  // await dbConnect();
  // const rfp = await Rfp.create({ ...data, status: "PUBLISHED", publishedAt: new Date() });
  // return NextResponse.json({ rfp }, { status: 201 });

  // Temporary stub response so the route works immediately:
  return NextResponse.json(
    { ok: true, message: "RFP creation allowed for ADMIN/BUYER only." },
    { status: 201 }
  );
}
