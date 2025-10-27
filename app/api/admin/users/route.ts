import { NextResponse } from "next/server";
import { requireRole } from "@/lib/authz";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  await requireRole(["ADMIN"]);
  await dbConnect();
  const users = await User.find().select("email role firebaseUid createdAt");
  return NextResponse.json({ users });
}
