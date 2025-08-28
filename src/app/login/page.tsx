"use client";

import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {

  async function handleGoogle() {
    if (!supabase) return alert("Supabase not configured");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  }
  async function handleFacebook() {
    if (!supabase) return alert("Supabase not configured");
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: `${window.location.origin}/` },
    });
  }
  async function handleGithub() {
    if (!supabase) return alert("Supabase not configured");
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-xl" style={{ fontFamily: 'var(--font-geist-sans)' }}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">Welcome back</h1>
          <p className="text-sm opacity-80 mt-1">Choose a provider to continue</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleGoogle}
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-3 text-white text-base font-semibold transition-transform duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-[1.02] active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12 c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.534,6.053,29.033,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.534,6.053,29.033,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.205l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.955 l-6.563,5.056C9.48,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.237-2.231,4.166-4.094,5.591c0.001-0.001,0.002-0.001,0.003-0.002 l6.19,5.238C36.271,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            Continue with Google
          </button>
          <button
            onClick={handleFacebook}
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-3 text-white text-base font-semibold transition-transform duration-200 bg-[#1877F2] hover:brightness-110 hover:scale-[1.02] active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0h-21.35C.595 0 0 .594 0 1.326v21.348C0 23.406.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.764v2.313h3.587l-.467 3.622h-3.12V24h6.117C23.406 24 24 23.406 24 22.674V1.326C24 .594 23.406 0 22.675 0z"/></svg>
            Continue with Facebook
          </button>
          <button
            onClick={handleGithub}
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-3 text-white text-base font-semibold transition-transform duration-200 bg-black hover:brightness-110 hover:scale-[1.02] active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.87 3.15 9 7.51 10.45.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.06-3.05.66-3.69-1.3-3.69-1.3-.5-1.28-1.22-1.62-1.22-1.62-.99-.68.08-.67.08-.67 1.1.08 1.67 1.12 1.67 1.12.98 1.68 2.56 1.19 3.18.9.1-.71.38-1.19.69-1.46-2.43-.28-4.98-1.22-4.98-5.42 0-1.2.43-2.18 1.12-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.29 3.02 1.12a10.5 10.5 0 0 1 5.5 0c2.1-1.41 3.02-1.12 3.02-1.12.6 1.52.22 2.64.11 2.92.69.77 1.11 1.75 1.11 2.95 0 4.21-2.56 5.13-4.99 5.41.39.33.74.98.74 1.98 0 1.43-.01 2.58-.01 2.93 0 .29.2.64.76.53 4.35-1.45 7.5-5.58 7.5-10.45C23.1 5.33 18.27.5 12 .5z"/></svg>
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
