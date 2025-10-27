import { headers } from "next/headers";
import { adminAuth } from "@/lib/firebaseAdmin";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export type Role = "ADMIN" | "BUYER" | "VENDOR";

async function getBearerToken() {
  const h = await headers();
  const a = h.get("authorization") || h.get("Authorization");
  if (!a?.startsWith("Bearer ")) return null;
  return a.slice("Bearer ".length);
}

export async function requireAuth() {
  const token = await getBearerToken();
  if (!token) {
    throw new Response(JSON.stringify({ error: "Missing Authorization: Bearer <ID_TOKEN>" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let decoded: any;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch (e: any) {
    console.error("[verifyIdToken] failed:", e?.message || e);
    throw new Response(JSON.stringify({ error: "Invalid Firebase ID token", detail: e?.message || String(e) }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (decoded?.aud && decoded.aud !== process.env.FIREBASE_PROJECT_ID) {
    throw new Response(
      JSON.stringify({ error: "Project mismatch", detail: `token.aud=${decoded.aud} vs env=${process.env.FIREBASE_PROJECT_ID}` }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  await dbConnect();
  try {
    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email!,
        name: decoded.name ?? "",
        role: "BUYER",
      });
    }
    return { decoded, user };
  } catch (e: any) {
    console.error("[requireAuth] Mongo error:", e?.message || e);
    throw new Response(JSON.stringify({ error: "Database error", detail: e?.message || String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function requireRole(roles: Role[]) {
  const { user } = await requireAuth();
  if (!roles.includes(user.role as Role)) {
    throw new Response(JSON.stringify({ error: "Forbidden", role: user.role }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}
