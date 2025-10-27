import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { requireRole } from "@/lib/auth";
import { z } from "zod";

const Body = z.object({
  uid: z.string().optional(),       // optional; if omitted, set role for current caller
  role: z.enum(["buyer", "vendor", "admin"])
});

export async function POST(req: NextRequest) {
  const caller = await requireRole(req, ["admin", "buyer", "vendor"]);
  if (!caller.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const targetUid = parsed.data.uid ?? caller.uid;

  // Merge current claims to preserve others (if any)
  const userRecord = await adminAuth.getUser(targetUid);
  const currentClaims = userRecord.customClaims || {};
  await adminAuth.setCustomUserClaims(targetUid, { ...currentClaims, role: parsed.data.role });

  // Force token refresh on client (client should sign-in again or refresh idToken)
  return NextResponse.json({ ok: true, uid: targetUid, role: parsed.data.role });
}
