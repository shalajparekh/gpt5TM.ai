"use client";
import { useState } from "react";
import Image from "next/image";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [service, setService] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    setDone(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries()) as Record<string, string>;
    payload["message"] = `Services interested: ${service || "-"}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to submit");
      setDone("Thanks! We will reach out soon.");
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to submit";
      setSubmitError(messageText);
    } finally {
      setLoading(false);
    }
  }

  // simple design does not require service selection

  return (
    <section id="contact" className="w-full py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Left info column */}
          <aside className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-8 md:p-10 h-full min-h-[360px] flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.35),0_20px_60px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,0,0,0.18)]">
            <div className="space-y-10 text-zinc-700 dark:text-zinc-300">
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-lg">✉️</div>
                  <h3 className="font-semibold text-xl tracking-tight">Email us</h3>
                </div>
                <p className="mt-2 text-base text-zinc-600">Our friendly team is here to help.</p>
                <a href="mailto:sales@neshtech.co.in" className="mt-1 block text-lg font-medium underline">hello@neshtech.co.in</a>
              </div>
              <div>
                <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-lg">📞</div>
                  <h3 className="font-semibold text-xl tracking-tight">Call us</h3>
                </div>
                
                <p className="mt-2 text-base text-zinc-600">Mon–Sat: 9am to 6pm. IST.</p>
                <p className="mt-2 text-base text-zinc-600"> <strong>+91 7760841075 </strong></p>
                
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-lg">📍</div>
                  <h3 className="font-semibold text-xl tracking-tight">Visit us</h3>
                </div>
                <p className="mt-2 text-base text-zinc-600"></p>
                <a href="tel:+917760841075" className="mt-1 block text-lg font-medium underline">Nesh Tech, B3-181, DLF Westend Heights DLF Newtown, Akshayanagar, Begur Hobli, Bangalore. 560068</a>
                {/* Small Google Map embed */}
                <div className="mt-6 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
                  <iframe
                    title="Akshayanagar, Bangalore"
                    src="https://www.google.com/maps?q=Akshayanagar%20Bangalore&output=embed"
                    width="100%"
                    height="160"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
            <div className="mt-10 flex gap-4 text-zinc-600">
              <a href="#" aria-label="Twitter" className="h-10 w-10 rounded-xl border border-black/10 flex items-center justify-center text-lg">𝕏</a>
              <a href="#" aria-label="LinkedIn" className="h-10 w-10 rounded-xl border border-black/10 flex items-center justify-center text-lg">in</a>
              <a href="#" aria-label="YouTube" className="h-10 w-10 rounded-xl border border-black/10 flex items-center justify-center text-lg">▶</a>
              <a href="#" aria-label="Instagram" className="h-10 w-10 rounded-xl border border-black/10 flex items-center justify-center text-lg">◎</a>
            </div>
          </aside>

          {/* Right form column */}
          <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 h-full min-h-[360px] shadow-[0_40px_120px_rgba(0,0,0,0.35),0_20px_60px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,0,0,0.18)]">
            {/* Left minimal form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contact Us</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Fill in the form, or, if you prefer, <a href="mailto:hello@neshtechinc.com" className="underline text-rose-500">send us an email</a>
              </p>

              <label className="block mt-12 text-zinc-400">Name</label>
              <input
                name="name"
                required
                className="w-full bg-transparent border-0 border-b border-zinc-300 focus:outline-none focus:ring-0 focus:border-black text-base h-11 py-2 leading-tight"
                style={{ fontFamily: 'Aptos, var(--font-geist-sans)' }}
              />

              <label className="block mt-10 text-zinc-400">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-transparent border-0 border-b border-zinc-300 focus:outline-none focus:ring-0 focus:border-black text-base h-11 py-2 leading-tight"
                style={{ fontFamily: 'Aptos, var(--font-geist-sans)' }}
              />

              <label className="block mt-10 text-zinc-400">Phone</label>
              <input
                name="phone"
                className="w-full bg-transparent border-0 border-b border-zinc-300 focus:outline-none focus:ring-0 focus:border-black text-base h-11 py-2 leading-tight"
                style={{ fontFamily: 'Aptos, var(--font-geist-sans)' }}
              />

              <label className="block mt-10 text-zinc-400">Address</label>
              <input
                name="address"
                className="w-full bg-transparent border-0 border-b border-zinc-300 focus:outline-none focus:ring-0 focus:border-black text-base h-11 py-2 leading-tight"
                style={{ fontFamily: 'Aptos, var(--font-geist-sans)' }}
              />

              <label className="block mt-10 text-zinc-400">Services interested</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-zinc-300 focus:outline-none focus:ring-0 focus:border-black text-base h-11 py-2 leading-tight"
                style={{ fontFamily: 'Aptos, var(--font-geist-sans)' }}
              >
                <option value="">Select a service</option>
                <option value="Websites & Apps">Websites & Apps</option>
                <option value="E‑commerce">E‑commerce</option>
                <option value="WhatsApp Commerce">WhatsApp Commerce</option>
                <option value="PPC & SEO">PPC & SEO</option>
                <option value="Email Automation">Email Automation</option>
                <option value="Branding & Design">Branding & Design</option>
                <option value="Video Scripts">Video Scripts</option>
                <option value="Add‑ons">Add‑ons</option>
                <option value="Care Plans">Care Plans</option>
              </select>

              {done && <p className="mt-6 text-green-600">{done}</p>}
              {submitError && <p className="mt-2 text-red-600">{submitError}</p>}
              <div className="mt-8 flex items-center justify-end">
                <button disabled={loading} className="text-zinc-700 hover:text-black inline-flex items-center gap-2">
                  {loading ? "sending…" : "send"} <span>→</span>
                </button>
              </div>
              {/* No hidden fields required */}
            </form>

            {/* Right image */}
            <div className="relative bg-zinc-100">
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


