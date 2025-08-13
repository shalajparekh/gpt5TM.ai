import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

async function appendUserToSheet(params: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider: string;
  providerAccountId?: string | null;
}) {
  const clientEmail = (process.env.GOOGLE_SHEETS_USERS_CLIENT_EMAIL || process.env.GOOGLE_SHEETS_CLIENT_EMAIL)?.trim();
  const b64 = process.env.GOOGLE_SHEETS_USERS_PRIVATE_KEY_BASE64 || process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64;
  const rawKey = b64 ? Buffer.from(b64, "base64").toString("utf-8") : (process.env.GOOGLE_SHEETS_USERS_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY);
  const privateKey = rawKey?.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;
  const spreadsheetId = (process.env.GOOGLE_SHEETS_USERS_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID)?.trim();
  const sheetName = (process.env.GOOGLE_SHEETS_USERS_SHEET_NAME || process.env.GOOGLE_SHEETS_SHEET_NAME || "techmaadi").trim();
  if (!clientEmail || !privateKey || !spreadsheetId) return;

  const { google } = await import("googleapis");
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

  const values = [[
    new Date().toISOString(),
    params.provider,
    params.providerAccountId || "",
    params.name || "",
    params.email || "",
    params.image || "",
  ]];
  await sheets.spreadsheets.values.append({ spreadsheetId, range: `${title}!A1`, valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values } });
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/", // we invoke signIn() from navbar; fallback to home
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const p = profile as { name?: string | null; email?: string | null; picture?: string | null };
        token.name = p.name ?? token.name;
        token.email = p.email ?? token.email;
        const t = token as { picture?: string | null };
        t.picture = p.picture ?? t.picture;
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as { name?: string | null; email?: string | null; picture?: string | null };
      if (!session.user) session.user = {} as typeof session.user;
      session.user.name = t.name ?? session.user.name;
      session.user.email = t.email ?? session.user.email;
      session.user.image = t.picture ?? (session.user.image as string | undefined);
      return session;
    },
  },
  events: {
    async signIn(message) {
      const { user, account } = message as { user?: { name?: string | null; email?: string | null; image?: string | null }; account?: { provider?: string; providerAccountId?: string | null } };
      try {
        await appendUserToSheet({
          name: user?.name || undefined,
          email: user?.email || undefined,
          image: user?.image || undefined,
          provider: account?.provider || "google",
          providerAccountId: account?.providerAccountId,
        });
      } catch (err) {
        console.error("Sheet append (auth) failed:", err);
      }
    },
  },
};


