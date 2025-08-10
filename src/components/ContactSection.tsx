"use client";
import { useState } from "react";
import Image from "next/image";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDone(null);
    const form = new FormData(e.currentTarget);
    // merge service checkboxes into message to keep API schema simple
    const services = (form.getAll("services") as string[]).join(", ");
    const message = `${form.get("message") || ""}\n\nServices interested: ${services}`.trim();
    form.set("message", message);
    form.delete("services");
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to submit");
      setDone("Thanks! We will reach out soon.");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to submit";
      setError(messageText);
    } finally {
      setLoading(false);
    }
  }

  // simple design does not require service selection

  return (
    <section id="contact" className="w-full py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left info column */}
          <aside className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-8 md:p-10">
            <div className="space-y-10 text-zinc-700 dark:text-zinc-300">
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-lg">💬</div>
                  <h3 className="font-semibold text-xl tracking-tight">Chat to us</h3>
                </div>
                <p className="mt-2 text-base text-zinc-600">Our friendly team is here to help.</p>
                <a href="mailto:hello@techmaadi.ai" className="mt-1 block text-lg font-medium underline">hello@techmaadi.ai</a>
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-lg">📍</div>
                  <h3 className="font-semibold text-xl tracking-tight">Visit us</h3>
                </div>
                <p className="mt-2 text-base text-zinc-600">Come say hello at our office HQ.</p>
                <p className="mt-1 text-lg">Indiranagar, Bengaluru</p>
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-lg">📞</div>
                  <h3 className="font-semibold text-xl tracking-tight">Call us</h3>
                </div>
                <p className="mt-2 text-base text-zinc-600">Mon–Fri from 9am to 6pm.</p>
                <a href="tel:+919999999999" className="mt-1 block text-lg font-medium underline">+91 99999 99999</a>
              </div>
            </div>
            <div className="mt-10 flex gap-4 text-zinc-600">
              <a href="#" aria-label="Twitter" className="h-10 w-10 rounded-xl border border-black/10 flex items-center justify-center text-lg">𝕏</a>
              <a href="#" aria-label="LinkedIn" className="h-10 w-10 rounded-xl border border-black/10 flex items-center justify-center text-lg">in</a>
              <a href="#" aria-label="YouTube" className="h-10 w-10 rounded-xl border border-black/10 flex items-center justify-center text-lg">▶</a>
            </div>
          </aside>

          {/* Right form column */}
          <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900">
            {/* Left minimal form */}
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Fill in the form, or, if you prefer, <a href="mailto:hello@techmaadi.ai" className="underline text-rose-500">send us an email</a>
              </p>

              <label className="block mt-12 text-zinc-400">What’s your name</label>
              <input name="name" required className="w-full bg-transparent border-0 border-b border-zinc-300 focus:outline-none focus:ring-0 focus:border-black text-2xl py-3" />

              <label className="block mt-10 text-zinc-400">Your magical email</label>
              <input type="email" name="email" required className="w-full bg-transparent border-0 border-b border-zinc-300 focus:outline-none focus:ring-0 focus:border-black text-2xl py-3" />

              <label className="block mt-10 text-zinc-400">Tell us about your project</label>
              <textarea name="message" rows={4} required className="w-full bg-transparent border-0 border-b border-zinc-300 focus:outline-none focus:ring-0 focus:border-black text-2xl py-3" />

              <div className="mt-10 flex items-center justify-end">
                <button disabled={loading} className="text-zinc-700 hover:text-black inline-flex items-center gap-2">
                  {loading ? "sending…" : "send"} <span>→</span>
                </button>
              </div>
              {/* Hidden fields preserved for API */}
              <input type="hidden" name="phone" />
              <input type="hidden" name="address" />
            </form>

            {/* Right image */}
            <div className="relative min-h-[420px] bg-zinc-100">
              <Image
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&auto=format&fit=crop&w=1400&h=1200"
                alt="Contact visual"
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


