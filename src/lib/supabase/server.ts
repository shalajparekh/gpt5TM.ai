import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function createSupabaseServer() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name: string) {
        const bag = await cookieStore;
        return bag.get(name)?.value;
      },
      async set(name: string, value: string, options: CookieOptions) {
        const bag = await cookieStore;
        bag.set({ name, value, ...options });
      },
      async remove(name: string, options: CookieOptions) {
        const bag = await cookieStore;
        bag.set({ name, value: "", ...options });
      },
    },
  });
}
