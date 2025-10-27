import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { z } from "zod";

const CreateBody = z.object({
  title: z.string().min(3),
  description: z.string().min(3)
});

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["buyer", "admin"]);
  if (!auth.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({
    items: [
      { id: "rfp-1", title: "Office Chairs", status: "open" },
      { id: "rfp-2", title: "Laptops 50 units", status: "review" }
    ]
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["buyer", "admin"]);
  if (!auth.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = CreateBody.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Persist to DB here (Firestore / Mongo / Postgres). Returning demo data:
  return NextResponse.json({ id: "rfp-new", ...parsed.data, status: "open" }, { status: 201 });
}
