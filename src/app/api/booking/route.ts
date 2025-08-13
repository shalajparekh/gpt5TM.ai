import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dayParam = searchParams.get("day"); // ISO date (YYYY-MM-DD)
    const tz = searchParams.get("tz") || "Asia/Kolkata";
    // Fixed requirements: exactly 8 slots of 45 mins each
    const durationMinutes = 45;

    if (!dayParam) {
      return NextResponse.json({ error: "Missing day" }, { status: 400 });
    }

    // Robust YYYY-MM-DD parser (avoid timezone surprises)
    function parseYmd(value: string) {
      const [y, m, d] = value.split("-").map((n) => Number(n));
      const dt = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
      return dt;
    }

    const day = parseYmd(dayParam);
    if (Number.isNaN(day.getTime())) {
      return NextResponse.json({ error: "Invalid day" }, { status: 400 });
    }

    // Convert using local string hack since we avoid heavy tz libs
    function makeLocalHour(date: Date, hour: number) {
      const d = new Date(date);
      d.setHours(hour, 0, 0, 0);
      return d;
    }

    // Closed on Sundays
    if (day.getDay() === 0) {
      return NextResponse.json({ day: dayParam, tz, durationMinutes, slots: [] });
    }

    const firstSlotStart = makeLocalHour(day, 10); // 10:00
    const slotsToBuild = 8; // 8 slots of 45 mins → last ends at 16:00
    const addMinutesLocal = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60000);

    // For now, always show all slots as free (no DB overlap checks)
    const slots: Array<{ start: string; end: string; available: boolean }> = [];
    for (let i = 0; i < slotsToBuild; i++) {
      const start = addMinutesLocal(firstSlotStart, i * durationMinutes);
      const end = addMinutesLocal(start, durationMinutes);
      slots.push({ start: start.toISOString(), end: end.toISOString(), available: true });
    }

    return NextResponse.json({ day: dayParam, tz, durationMinutes, slots });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, notes, startISO, durationMinutes = 30, source } = body || {};
    if (!name || !startISO) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const start = new Date(startISO);
    if (Number.isNaN(start.getTime())) {
      return NextResponse.json({ error: "Invalid startISO" }, { status: 400 });
    }
    const end = new Date(start.getTime() + (Number(durationMinutes) || 30) * 60000);

    // Sheets-only capture
    const createdId: string = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    // Append to Google Sheets with detailed errors
    try {
      const clientEmail = (process.env.GOOGLE_SHEETS_BOOKINGS_CLIENT_EMAIL || process.env.GOOGLE_SHEETS_CLIENT_EMAIL)?.trim();
      const b64 = process.env.GOOGLE_SHEETS_BOOKINGS_PRIVATE_KEY_BASE64 || process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64;
      const rawKey = b64 ? Buffer.from(b64, "base64").toString("utf-8") : (process.env.GOOGLE_SHEETS_BOOKINGS_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY);
      const privateKey = rawKey?.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;
      const spreadsheetId = (process.env.GOOGLE_SHEETS_BOOKINGS_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID)?.trim();
      const sheetName = (process.env.GOOGLE_SHEETS_BOOKINGS_SHEET_NAME || process.env.GOOGLE_SHEETS_SHEET_NAME || "Bookings").trim();
      if (!clientEmail || !privateKey || !spreadsheetId) {
        return NextResponse.json({ error: "SHEETS_CONFIG_MISSING" }, { status: 500 });
      }
      if (!privateKey.includes("BEGIN PRIVATE KEY") || !privateKey.includes("END PRIVATE KEY")) {
        return NextResponse.json({ error: "SHEETS_PRIVATE_KEY_INVALID" }, { status: 500 });
      }

      const { google } = await import("googleapis");
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const sheets = google.sheets({ version: "v4", auth });

      // Ensure target sheet exists; create if missing
      const meta = await sheets.spreadsheets.get({ spreadsheetId });
      const sheetsList = meta.data.sheets || [];
      const wanted = sheetName.toLowerCase();
      let actualTitle = sheetsList.find(s => (s.properties?.title || "").toLowerCase() === wanted)?.properties?.title;
      if (!actualTitle) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{ addSheet: { properties: { title: sheetName } } }],
          },
        });
        actualTitle = sheetName;
      }
      const quotedTitle = `'${(actualTitle || sheetName).replace(/'/g, "''")}'`;
      const values = [[
        new Date().toISOString(),
        name || "",
        email || "",
        phone || "",
        source || "",
        notes || "",
        start.toISOString(),
        end.toISOString(),
        "confirmed",
      ]];
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${quotedTitle}!A1`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values },
      });
    } catch (err: unknown) {
      const e = err as { message?: string; errors?: Array<{ message?: string }>; response?: { data?: { error?: { message?: string } } } };
      const googleMsg = e?.errors?.[0]?.message || e?.response?.data?.error?.message;
      const message = e?.message || googleMsg || "Failed to append to Google Sheets";
      console.error("Sheets append error:", e);
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: createdId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


