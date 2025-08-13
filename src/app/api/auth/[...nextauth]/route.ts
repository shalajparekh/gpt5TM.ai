import NextAuth from "next-auth";
import { authConfig } from "@/auth";

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


