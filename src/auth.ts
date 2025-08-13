// Note: avoid strict typing here to support multiple NextAuth versions
import Google from "next-auth/providers/google";

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

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/", // we invoke signIn() from navbar; fallback to home
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const typedProfile = profile as { name?: string; email?: string; picture?: string };
        token.name = typedProfile.name;
        token.email = typedProfile.email;
        token.picture = typedProfile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: token.name as string | undefined,
        email: token.email as string | undefined,
        image: token.picture as string | undefined,
      } as typeof session.user;
      return session;
    },
  },
  events: {
    async signIn(message) {
      const { user, account } = message;
      try {
        await appendUserToSheet({
          name: user?.name,
          email: user?.email,
          image: user?.image,
          provider: account?.provider || "google",
          providerAccountId: account?.providerAccountId,
        });
      } catch (err) {
        console.error("Sheet append (auth) failed:", err);
      }
    },
  },
};


