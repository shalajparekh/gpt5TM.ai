import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg text-center" style={{ fontFamily: 'var(--font-geist-sans)' }}>
        <h1 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">Welcome {user.email}</h1>
      </div>
    </div>
  );
}
