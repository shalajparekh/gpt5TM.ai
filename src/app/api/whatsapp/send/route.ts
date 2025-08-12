import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const { to, body } = await req.json();
    if (!to || !body) return NextResponse.json({ error: "Missing to/body" }, { status: 400 });

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM; // e.g., 'whatsapp:+14155238886'

    if (!accountSid || !authToken || !from) {
      return NextResponse.json({ error: "Twilio env vars not set" }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);
    const msg = await client.messages.create({ from, to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`, body });
    return NextResponse.json({ sid: msg.sid });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


