import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "__Host-fb_session";
const EXPIRES_DAYS = Number(process.env.FIREBASE_SESSION_EXPIRES_DAYS || "5");

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });

  const expiresIn = EXPIRES_DAYS * 24 * 60 * 60 * 1000;
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: expiresIn / 1000
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 401 });
  }
}
