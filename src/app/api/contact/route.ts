import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export const runtime = "nodejs";
// DB persist is optional; imported dynamically below if available

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

    // Send email via Zoho SMTP using Nodemailer
    const host = process.env.ZOHO_SMTP_HOST || "smtp.zoho.in";
    const port = Number(process.env.ZOHO_SMTP_PORT || 465);
    const secure = String(process.env.ZOHO_SMTP_SECURE || "true").toLowerCase() === "true";
    const user = process.env.ZOHO_SMTP_USER;
    const pass = process.env.ZOHO_SMTP_PASS;
    const from = process.env.MAIL_FROM || user || "";
    const to = process.env.MAIL_TO || user || "";
    if (!user || !pass || !to) {
      return NextResponse.json({ error: "Mail env vars missing" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    const subject = `New contact from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nAddress: ${address || "-"}\n\n${message}`;
    const html = `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height:1.6;">
        <h2>New contact submission</h2>
        <table style="border-collapse:collapse;">
          <tr><td style="padding:4px 8px;">Name</td><td style="padding:4px 8px;"><strong>${name}</strong></td></tr>
          <tr><td style="padding:4px 8px;">Email</td><td style="padding:4px 8px;">${email}</td></tr>
          <tr><td style="padding:4px 8px;">Phone</td><td style="padding:4px 8px;">${phone || "-"}</td></tr>
          <tr><td style="padding:4px 8px;">Address</td><td style="padding:4px 8px;">${address || "-"}</td></tr>
        </table>
        <p style="margin-top:12px; white-space:pre-wrap;">${message}</p>
      </div>`;

    await transporter.sendMail({ from, to, replyTo: email, subject, text, html });

    // Optionally still save to DB if configured
    try {
      const { connectToDatabase } = await import("@/utils/db");
      const { ContactModel } = await import("@/models/Contact");
      await connectToDatabase();
      const doc = await ContactModel.create({ name, email, address, phone, message });
      return NextResponse.json({ success: true, id: doc._id }, { status: 201 });
    } catch {
      // DB is optional; return success for mail sent
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


