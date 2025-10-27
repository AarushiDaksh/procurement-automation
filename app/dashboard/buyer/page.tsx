import { getUserFromSession } from "@/lib/auth";

export default async function BuyerDashboard() {
  const user = await getUserFromSession();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Buyer Dashboard</h1>
      <p className="mt-2">Welcome {user?.email} (role: {user?.role})</p>
      <ul className="mt-4 list-disc pl-6">
        <li>Create RFP/RFQ</li>
        <li>Review vendor quotes</li>
        <li>Track procurement workflow</li>
      </ul>
    </main>
  );
}
