// ❌ Do NOT import "@/lib/firebase/admin" or any Node-only deps here.
import { NextResponse, NextRequest } from "next/server";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "__Host-fb_session";
const protectedPrefixes = ["/dashboard", "/api/vendor", "/api/buyer", "/api/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Edge-safe: only string presence check for the cookie.
  const hasSession = Boolean(req.cookies.get(COOKIE_NAME)?.value);
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login?next=" + encodeURIComponent(pathname), req.url));
  }

  // No role checks here (move them to Node runtime pages/APIs).
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/vendor/:path*",
    "/api/buyer/:path*",
    "/api/admin/:path*"
  ]
};
