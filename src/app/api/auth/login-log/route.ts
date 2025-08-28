import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, loginAt } = body as { name?: string | null; email?: string | null; loginAt?: string };
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

    const when = loginAt || new Date().toISOString();

    // Append to Google Sheets
    const clientEmail = process.env.GOOGLE_SHEETS_USERS_CLIENT_EMAIL?.trim();
    const b64 = process.env.GOOGLE_SHEETS_USERS_PRIVATE_KEY_BASE64 || process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64;
    const rawKey = b64 ? Buffer.from(b64, "base64").toString("utf-8") : (process.env.GOOGLE_SHEETS_USERS_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY);
    const privateKey = rawKey?.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;
    const spreadsheetId = (process.env.GOOGLE_SHEETS_USERS_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID)?.trim();
    const sheetName = (process.env.GOOGLE_SHEETS_USERS_SHEET_NAME || process.env.GOOGLE_SHEETS_SHEET_NAME || "techmaadi").trim();

    if (clientEmail && privateKey && spreadsheetId) {
      const auth = new google.auth.JWT({ email: clientEmail, key: privateKey, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
      const sheets = google.sheets({ version: "v4", auth });
      const meta = await sheets.spreadsheets.get({ spreadsheetId });
      const wanted = sheetName.toLowerCase();
      const found = (meta.data.sheets || []).find(s => (s.properties?.title || "").toLowerCase() === wanted)?.properties?.title;
      let title = found || sheetName;
      if (!found) {
        await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] } });
      }
      title = `'${title.replace(/'/g, "''")}'`;
      const values = [[when, name || "", email, "LOGIN"]];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `${title}!A1`, valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values } });
    }

    // Insert into Supabase table
    const admin = createSupabaseAdmin();
    // Try new schema first (event_type/occurred_at), fall back to legacy login_at
    const { error: insertErr } = await admin.from("user_logins").insert({ email, name, event_type: "login", occurred_at: when });
    if (insertErr) {
      await admin.from("user_logins").insert({ email, name, login_at: when });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("login-log error", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}


