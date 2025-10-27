"use client";

import { FormEvent, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken
} from "firebase/auth";

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "vendor">("buyer");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const nextPath = searchParams?.next || "/";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUserEmail(u?.email ?? null));
    return () => unsub();
  }, []);

  async function startSession() {
    const idToken = await getIdToken(auth.currentUser!, true);
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });
  }

  async function setCustomRole() {
    // Server sets custom claims; client calls admin endpoint (protected by current admin or initial bootstrap logic).
    await fetch("/api/admin/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }) // set role for current user
    });
  }

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await startSession();           // create session cookie now that user exists
    await setCustomRole();          // set chosen role on server (buyer/vendor)
    window.location.href = nextPath;
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    await startSession();           // create/refresh session cookie
    window.location.href = nextPath;
  }

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut(auth);
    window.location.reload();
  }

  return (
    <main className="p-8 max-w-md">
      <h1 className="text-2xl font-semibold">Login / Register</h1>
      <form className="mt-4 grid gap-3" onSubmit={onLogin}>
        <input
          className="border p-2"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="border p-2"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
        />
        <div className="flex items-center gap-2">
          <label className="text-sm">Role on register:</label>
          <select className="border p-1" value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="buyer">buyer</option>
            <option value="vendor">vendor</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="border px-3 py-2" onClick={onLogin}>Login</button>
          <button className="border px-3 py-2" onClick={onRegister}>Register</button>
        </div>
      </form>

      <div className="mt-6">
        <p>Current: {userEmail ?? "not signed in"}</p>
        <button className="mt-2 border px-3 py-2" onClick={onLogout}>Logout</button>
      </div>
    </main>
  );
}
