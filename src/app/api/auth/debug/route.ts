import { NextResponse } from "next/server";

export async function GET() {
  const payload = {
    hasGOOGLE_CLIENT_ID: Boolean(process.env.GOOGLE_CLIENT_ID),
    hasGOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    hasNEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
    runtime: process.env.NODE_ENV || null,
  };
  return NextResponse.json(payload);
}


