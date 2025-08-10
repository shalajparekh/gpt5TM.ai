import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import { ContactModel } from "@/models/Contact";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const { name, email, address, phone, message } = (body as {
      name?: string;
      email?: string;
      address?: string;
      phone?: string;
      message?: string;
    }) || {};
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await connectToDatabase();
    const doc = await ContactModel.create({ name, email, address, phone, message });
    return NextResponse.json({ success: true, id: doc._id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


