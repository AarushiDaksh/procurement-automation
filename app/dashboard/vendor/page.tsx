import { getUserFromSession } from "@/lib/auth";

export default async function VendorDashboard() {
  const user = await getUserFromSession();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Vendor Dashboard</h1>
      <p className="mt-2">Welcome {user?.email} (role: {user?.role})</p>
      <ul className="mt-4 list-disc pl-6">
        <li>Browse open RFP/RFQ</li>
        <li>Submit quotations</li>
        <li>Manage contracts</li>
      </ul>
    </main>
  );
}
