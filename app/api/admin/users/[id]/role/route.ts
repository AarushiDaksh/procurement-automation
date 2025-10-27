import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/authz";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const body = (await req.json()) as { role: "ADMIN" | "BUYER" | "VENDOR" };

  if (!["ADMIN", "BUYER", "VENDOR"].includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findByIdAndUpdate(params.id, { role: body.role }, { new: true });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ ok: true, user: { id: user._id, email: user.email, role: user.role } });
}
