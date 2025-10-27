import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Procurement Platform</h1>
      <p className="mt-2">Next.js + Firebase Auth (Session Cookies) + RBAC</p>
      <div className="mt-4 flex gap-3">
        <Link className="underline" href="/login">Login</Link>
        <Link className="underline" href="/dashboard/buyer">Buyer Dashboard</Link>
        <Link className="underline" href="/dashboard/vendor">Vendor Dashboard</Link>
      </div>
    </main>
  );
}
