import { NextResponse } from "next/server";
import twilio from "twilio";
import { connectToDatabase } from "@/utils/db";
import { BookingModel } from "@/models/Booking";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, userWhatsapp, businessWhatsapp } = body || {};
    if (!bookingId || !businessWhatsapp) {
      return NextResponse.json({ error: "Missing bookingId/businessWhatsapp" }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM; // e.g., 'whatsapp:+14155238886'
    if (!accountSid || !authToken || !from) {
      return NextResponse.json({ error: "Twilio not configured" }, { status: 500 });
    }

    await connectToDatabase();
    const booking = await BookingModel.findById(bookingId);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const client = twilio(accountSid, authToken);
    const businessBody = `New booking confirmed:\nName: ${booking.name}\nPhone: ${booking.phone || "-"}\nEmail: ${booking.email || "-"}\nStart: ${booking.startTime.toLocaleString()}\nEnd: ${booking.endTime.toLocaleString()}\nNotes: ${booking.notes || "-"}`;
    const userBody = `Hi ${booking.name}, your booking is confirmed!\nStart: ${booking.startTime.toLocaleString()}\nEnd: ${booking.endTime.toLocaleString()}\n— TechMaadi`;

    const toBusiness = businessWhatsapp.startsWith("whatsapp:") ? businessWhatsapp : `whatsapp:${businessWhatsapp}`;
    await client.messages.create({ from, to: toBusiness, body: businessBody });

    if (userWhatsapp) {
      const toUser = userWhatsapp.startsWith("whatsapp:") ? userWhatsapp : `whatsapp:${userWhatsapp}`;
      await client.messages.create({ from, to: toUser, body: userBody });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


