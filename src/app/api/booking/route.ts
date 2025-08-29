import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type Slot = { start: string; end: string; available: boolean };

function normalizeYmd(value: string | null): string | null {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length === 3) {
    const [a, b, c] = parts;
    if (a.length === 2 && c.length === 4) {
      return `${c}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`;
    }
  }
  return value;
}

function buildDateInIST(dateYmd: string, hour: number, minute = 0): Date {
  // Construct RFC3339 with +05:30 offset so Date parses correctly to UTC instant
  const iso = `${dateYmd}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+05:30`;
  return new Date(iso);
}

function generateDaySlotsIST(dateYmd: string, durationMinutes: number): Slot[] {
  // 9 hourly slots starting 10:00 through 18:00 IST (inclusive start times)
  const slots: Slot[] = [];
  for (let h = 10; h < 19; h++) {
    const start = buildDateInIST(dateYmd, h, 0);
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    slots.push({ start: start.toISOString(), end: end.toISOString(), available: true });
  }
  return slots;
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function formatISTYmd(date: Date): string {
  // en-CA locale returns YYYY-MM-DD
  return date.toLocaleString("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getIndiaHolidayName(ymd: string): string | null {
  // Minimal fixed-date public holidays
  const [, m, d] = ymd.split("-");
  const md = `${m}-${d}`;
  switch (md) {
    case "01-26":
      return "Republic Day";
    case "08-15":
      return "Independence Day";
    case "10-02":
      return "Gandhi Jayanti";
    default:
      return null;
  }
}

function isSundayIST(ymd: string): boolean {
  // Use midday IST to avoid timezone wrap
  const dt = new Date(`${ymd}T12:00:00+05:30`);
  // 0 = Sunday
  return dt.getUTCDay() === 0;
}

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN || "";
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "https://developers.google.com/oauthplayground";
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

async function listBusyForDay(calendarId: string, dateYmd: string) {
  const auth = getOAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  const timeMin = buildDateInIST(dateYmd, 0, 0).toISOString();
  const timeMax = buildDateInIST(dateYmd, 23, 59).toISOString();

  const res = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = (res.data.items || []).map((e) => ({
    start: new Date(e.start?.dateTime || e.start?.date || timeMin),
    end: new Date(e.end?.dateTime || e.end?.date || timeMax),
    id: e.id,
    summary: e.summary,
  }));
  return events;
}

function computeAvailability(slots: Slot[], busy: { start: Date; end: Date }[]): Slot[] {
  return slots.map((slot) => {
    const s = new Date(slot.start);
    const e = new Date(slot.end);
    const conflict = busy.some((b) => overlaps(s, e, b.start, b.end));
    return { ...slot, available: !conflict };
  });
}

function createMailTransport() {
  const host = process.env.ZOHO_SMTP_HOST || "smtp.zoho.in";
  const port = Number(process.env.ZOHO_SMTP_PORT || 465);
  const secure = String(process.env.ZOHO_SMTP_SECURE || "true").toLowerCase() === "true";
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  try {
    const anyErr = err as { message?: string };
    if (anyErr && typeof anyErr.message === 'string' && anyErr.message) return anyErr.message;
  } catch {}
  return fallback;
}

function getGoogleErrorInfo(err: unknown): { status: number; message: string } {
  // Attempt to extract Google API error shape
  const fallback = { status: 500, message: 'Google Calendar error' };
  try {
    const anyErr = err as {
      code?: number;
      errors?: Array<{ message?: string }>;
      response?: { status?: number; data?: { error?: { message?: string } } };
      message?: string;
    };
    const status = anyErr?.response?.status || anyErr?.code || 500;
    const message = anyErr?.errors?.[0]?.message || anyErr?.response?.data?.error?.message || anyErr?.message || fallback.message;
    return { status, message };
  } catch {
    return fallback;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawDay = searchParams.get("day");
    const ymd = normalizeYmd(rawDay);
    if (!ymd) return NextResponse.json({ error: "Missing day" }, { status: 400 });
    const duration = Number(process.env.BOOKING_SLOT_DURATION_MIN || 45);
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

    const holidayName = getIndiaHolidayName(ymd);
    const sunday = isSundayIST(ymd);
    if (holidayName || sunday) {
      return NextResponse.json({ slots: [], closedReason: holidayName || "Sunday" });
    }

    const baseSlots = generateDaySlotsIST(ymd, duration);
    let busy: { start: Date; end: Date }[] = [];
    try {
      busy = await listBusyForDay(calendarId, ymd);
    } catch {
      // Fallback to showing all slots as available if Calendar API is misconfigured
      busy = [];
    }
    const slots = computeAvailability(baseSlots, busy);

    return NextResponse.json({ slots });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, notes, source, startISO, durationMinutes } = (body || {}) as {
      name?: string;
      email?: string;
      phone?: string;
      notes?: string;
      source?: string;
      startISO?: string;
      durationMinutes?: number;
    };
    if (!name || !email || !phone || !startISO) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const duration = Number(durationMinutes || process.env.BOOKING_SLOT_DURATION_MIN || 45);
    const start = new Date(startISO);
    const end = new Date(start.getTime() + duration * 60_000);
    const ymdIst = formatISTYmd(start);
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

    // Verify availability just-in-time
    const busy = await listBusyForDay(calendarId, ymdIst);
    const conflict = busy.some((b) => overlaps(start, end, b.start, b.end));
    if (conflict) {
      return NextResponse.json({ error: "Selected slot is no longer available" }, { status: 409 });
    }

    let calendar;
    try {
      const auth = getOAuthClient();
      calendar = google.calendar({ version: "v3", auth });
    } catch {
      return NextResponse.json({ error: "Google Calendar auth failed. Check GOOGLE_* env vars." }, { status: 500 });
    }
    const summary = `Discovery call with ${name}`;
    const descriptionLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      source ? `Source: ${source}` : undefined,
      notes ? `Notes: ${notes}` : undefined,
    ].filter(Boolean);

    let insert;
    try {
      insert = await calendar.events.insert({
        calendarId,
        requestBody: {
          summary,
          description: descriptionLines.join("\n"),
          start: { dateTime: start.toISOString(), timeZone: "Asia/Kolkata" },
          end: { dateTime: end.toISOString(), timeZone: "Asia/Kolkata" },
          attendees: [{ email }],
          reminders: { useDefault: true },
        },
      });
    } catch (err: unknown) {
      const { status, message } = getGoogleErrorInfo(err);
      return NextResponse.json({ error: message }, { status });
    }

    const event = insert.data;

    // Send confirmation email and report status
    let emailSent = false;
    let emailError: string | undefined;
    const transporter = createMailTransport();
    const from = process.env.MAIL_FROM || process.env.ZOHO_SMTP_USER || "";
    const whenIST = new Date(startISO).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    if (transporter && from) {
      try {
        const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
        const supportEmail = process.env.SUPPORT_EMAIL || process.env.MAIL_FROM || process.env.ZOHO_SMTP_USER || "";
        const supportPhone = process.env.SUPPORT_PHONE || process.env.NEXT_PUBLIC_SUPPORT_PHONE || "";
        const serviceName = "Discovery Call";
        const userSubject = `🌐 Welcome to Nesh Tech – Booking Confirmed (${whenIST} IST)`;
        const userText = `🌐 Welcome to Nesh Tech – Your Digital Partner for Growth!\n\n👋 Hello ${name},\n\nWe’re so excited to have you onboard with Nesh Tech! 🎉\nYour booking has been confirmed ✅ and we’re ready to kickstart your journey towards online growth.\n\n💼 What We Do for You:\n\n✨ Website & App Creation – Sleek, modern, mobile-ready\n⚡ Hosting & Domain Setup – Reliable and fast, hassle-free\n📢 Social Media Automation – Post, schedule & grow followers 📱\n📧 Email Marketing – Reach customers with smart campaigns\n🤖 AI-Powered Tools – Chatbots, automation & more\n\n📅 Your Booking:\n\n🗓️ Service: ${serviceName}\n📍 Date: ${whenIST} IST\n✅ Status: Confirmed\n\n🚀 What’s Next?\n\nWe’ll reach out shortly to get started.\nMeanwhile, you can explore how Nesh Tech can help you grow:\n\n👉 Visit Our Website: ${siteUrl || "(link)"}\n👉 Call Us: ${supportPhone || "(phone)"}\n👉 Email Us: ${supportEmail || "(email)"}\n\n💖 At Nesh Tech, we believe in growing businesses the smart way – with automation, design, and a touch of creativity.\n\nThank you for trusting us – let’s build something amazing together! 🌟\n\nWarm regards,\nTeam Nesh Tech\n🚀 Empowering Local Businesses Online`;
        const userHtml = `<div style=\"font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;line-height:1.6\">\n  <h1 style=\"margin:0 0 4px\">🌐 Welcome to Nesh Tech – Your Digital Partner for Growth!</h1>\n  <p>👋 Hello <strong>${name}</strong>,</p>\n  <p>We’re so excited to have you onboard with Nesh Tech! 🎉<br/>Your booking has been <strong>confirmed</strong> ✅ and we’re ready to kickstart your journey towards online growth.</p>\n  <p style=\"margin:14px 0 6px\"><strong>💼 What We Do for You:</strong></p>\n  <ul style=\"margin:0 0 14px 20px;padding:0\">\n    <li>✨ Website & App Creation – Sleek, modern, mobile‑ready</li>\n    <li>⚡ Hosting & Domain Setup – Reliable and fast, hassle‑free</li>\n    <li>📢 Social Media Automation – Post, schedule & grow followers 📱</li>\n    <li>📧 Email Marketing – Reach customers with smart campaigns</li>\n    <li>🤖 AI‑Powered Tools – Chatbots, automation & more</li>\n  </ul>\n  <table role=\"presentation\" style=\"margin:10px 0 14px;padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa\">\n    <tr><td>🗓️ <strong>Service:</strong> ${serviceName}</td></tr>\n    <tr><td>📍 <strong>Date:</strong> ${whenIST} IST</td></tr>\n    <tr><td>✅ <strong>Status:</strong> Confirmed</td></tr>\n  </table>\n  <p style=\"margin:14px 0 6px\"><strong>🚀 What’s Next?</strong></p>\n  <p>We’ll reach out shortly to get started. Meanwhile, you can explore how Nesh Tech can help you grow:</p>\n  <ul style=\"margin:0 0 14px 20px;padding:0\">\n    <li>👉 <a href=\"${siteUrl || '#'}\" target=\"_blank\" rel=\"noopener noreferrer\">🌐 Visit Our Website</a></li>\n    ${supportPhone ? `<li>👉 <a href=\\\"tel:${supportPhone}\\\">📞 Call Us</a></li>` : ''}\n    ${supportEmail ? `<li>👉 <a href=\\\"mailto:${supportEmail}\\\">💌 Email Us</a></li>` : ''}\n  </ul>\n  <p>💖 At Nesh Tech, we believe in growing businesses the smart way – with automation, design, and a touch of creativity.</p>\n  <p>Thank you for trusting us – let’s build something amazing together! 🌟</p>\n  <p style=\"margin-top:16px\">Warm regards,<br/><strong>Team Nesh Tech</strong><br/>🚀 Empowering Local Businesses Online</p>\n</div>`;
        await transporter.sendMail({ from, to: email, subject: userSubject, text: userText, html: userHtml });
        const notifyTo = process.env.BOOKING_NOTIFY_TO || process.env.ZOHO_SMTP_USER;
        if (notifyTo) {
          const subject = `New booking: ${whenIST} IST - ${name}`;
          const plain = `New booking confirmed.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nWhen: ${whenIST} IST\nDuration: ${duration} minutes\nSource: ${source || "-"}\nNotes: ${notes || "-"}\n\nServices (teaser): Websites & Apps; E‑commerce; WhatsApp Commerce; PPC & SEO; Email Automation.`;
          const html = `<div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;line-height:1.6">
  <h2 style="margin:0 0 8px">New booking confirmed</h2>
  <table role="presentation" style="margin:8px 0 16px;padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa">
    <tr><td><strong>Name:</strong> ${name}</td></tr>
    <tr><td><strong>Email:</strong> ${email}</td></tr>
    <tr><td><strong>Phone:</strong> ${phone}</td></tr>
    <tr><td><strong>When:</strong> ${whenIST} IST</td></tr>
    <tr><td><strong>Duration:</strong> ${duration} minutes</td></tr>
    <tr><td><strong>Source:</strong> ${source || "-"}</td></tr>
    <tr><td><strong>Notes:</strong> ${notes || "-"}</td></tr>
  </table>
  <p style="margin:0 0 8px"><strong>Services (teaser)</strong></p>
  <ul style="margin:0 0 16px 20px;padding:0">
    <li>Websites & Apps</li>
    <li>E‑commerce</li>
    <li>WhatsApp Commerce</li>
    <li>PPC & SEO</li>
    <li>Email Automation</li>
  </ul>
</div>`;
          await transporter.sendMail({ from, to: notifyTo, subject, text: plain, html });
        }
        emailSent = true;
      } catch (err: unknown) {
        emailError = getErrorMessage(err, "SMTP send failed");
      }
    } else {
      emailError = "SMTP not configured (check ZOHO_SMTP_* and MAIL_FROM env vars)";
    }

    return NextResponse.json({ id: event.id, htmlLink: event.htmlLink, emailSent, emailError });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

