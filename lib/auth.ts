import { cookies } from "next/headers";
import { adminAuth } from "./firebase/admin";
import { NextRequest } from "next/server";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "__Host-fb_session";

export type Role = "buyer" | "vendor" | "admin";

export async function getUserFromSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const role = (decoded as any).role as Role | undefined;
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      role: role || "buyer"
    };
  } catch {
    return null;
  }
}

export async function requireRole(request: NextRequest, roles: Role[]) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return { ok: false as const, reason: "NO_COOKIE" };

  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    const role = (decoded as any).role as Role | undefined;
    if (!role || !roles.includes(role)) {
      return { ok: false as const, reason: "FORBIDDEN" };
    }
    return { ok: true as const, uid: decoded.uid, role };
  } catch {
    return { ok: false as const, reason: "INVALID_SESSION" };
  }
}
