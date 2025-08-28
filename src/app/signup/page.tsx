"use client";

import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  async function handleGoogle() {
    if (!supabase) return alert("Supabase not configured");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg" style={{ fontFamily: 'var(--font-geist-sans)' }}>
        <h1 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">Create Account</h1>
        <button
          onClick={handleGoogle}
          className="w-full inline-flex items-center justify-center rounded-full px-4 py-2 text-white text-sm font-semibold transition-transform duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}


