// lib/firebaseAdmin.ts
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`[firebaseAdmin] Missing env: ${name}`);
  return v;
}

function readPrivateKey(): string {
  const b64 = need("FIREBASE_PRIVATE_KEY_BASE64");
  return Buffer.from(b64, "base64").toString("utf8");
}

const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: need("FIREBASE_PROJECT_ID"),
      clientEmail: need("FIREBASE_CLIENT_EMAIL"),
      privateKey: readPrivateKey(),
    }),
  });

export const adminAuth = getAuth(app);
