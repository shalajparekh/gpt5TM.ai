"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const heroCards = [
  { title: "Better Cashflow", desc: "Streamlined accounting systems for faster decisions." },
  { title: "Audit Readiness", desc: "Compliance-first approach for hassle-free audits." },
  { title: "Tax Optimisation", desc: "Plan, track and optimise direct & indirect taxes." },
  { title: "Growth Finance", desc: "Project finance support and investor-grade reporting." },
];

const heroImages = [
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",
];

function useFader<T>(items: T[], intervalMs = 2800) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs]);
  return items[index];
}

export default function LawCADemoClient() {
  const activeCard = useFader(heroCards);
  const activeImage = useFader(heroImages);

  const mapUrl = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const center = "15.4909,73.8278"; // Panaji, Goa
    if (key) {
      const params = new URLSearchParams({
        center,
        zoom: "13",
        size: "1200x640",
        scale: "2",
        maptype: "roadmap",
        markers: `color:red|${center}`,
        key,
      });
      return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
    }
    const params = new URLSearchParams({ center, zoom: "13", size: "1200x640", markers: `${center},red` });
    return `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`;
  }, []);

  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [slots] = useState<string[]>(["03:30 pm", "04:15 pm", "05:00 pm", "05:45 pm", "06:30 pm", "07:15 pm", "08:00 pm", "08:45 pm"]);
  const [selectedSlot, setSelectedSlot] = useState<string>("10:00");

  const testimonials = useMemo(
    () => [
      {
        img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1200&q=80",
        text: "Excellent support with proactive tax planning and audit insights.",
        company: "Acme Pvt Ltd",
        name: "Riya Mehta",
        title: "CFO",
        city: "Goa",
      },
      {
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
        text: "Their team streamlined our compliance and improved cashflow visibility.",
        company: "Seabreeze Resorts",
        name: "Ananya Rao",
        title: "Finance Head",
        city: "Panaji",
      },
      {
        img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80",
        text: "Insightful guidance on international taxation for our export business.",
        company: "Konkan Exports",
        name: "Arjun Sharma",
        title: "Director",
        city: "Vasco",
      },
      {
        img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=1200&q=80",
        text: "Smooth statutory and internal audits. Highly recommended.",
        company: "Lotus Wellness",
        name: "Neha Kulkarni",
        title: "Owner",
        city: "Mapusa",
      },
      {
        img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
        text: "Timely due date reminders and responsive consulting whenever needed.",
        company: "BlueBay Charters",
        name: "Rohit Naik",
        title: "Founder",
        city: "Candolim",
      },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-white text-zinc-900" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      <section className="w-full border-b border-black/10 bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 text-transparent bg-clip-text">Alway & Associates Chartered Accountants</h1>
            <p className="mt-4 text-lg md:text-2xl font-bold text-zinc-800">Your Goa CA Partner for Tax, Audit & Growth</p>
            <div className="mt-6 relative h-40">
              <div key={activeCard.title} className="absolute inset-0 rounded-3xl p-6 bg-white shadow-xl border border-black/10 animate-fade">
                <div className="text-2xl font-semibold">{activeCard.title}</div>
                <p className="mt-2 text-zinc-600">{activeCard.desc}</p>
                <div className="absolute -bottom-3 -right-3 h-20 w-20 rounded-2xl bg-sky-100" />
              </div>
              <style jsx>{`
                .animate-fade { animation: fadeloop 2.8s linear both; }
                @keyframes fadeloop { 0%{opacity:0; transform:translateY(8px)} 10%{opacity:1; transform:none} 80%{opacity:1} 100%{opacity:0; transform:translateY(-6px)} }
              `}</style>
            </div>
          </div>
          <div className="relative h-80 md:h-[440px] rounded-3xl overflow-hidden shadow-xl">
            <Image src={activeImage} alt="Happy clients" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <article className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl hover:shadow-2xl transition-all">
            <div className="relative h-64">
              <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80" alt="CA Minal Alway" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold">CA Minal Alway</h3>
              <p className="mt-2 text-sm text-zinc-700">Specialist in Direct/Indirect Tax, Statutory Audit, Internal Audit, International Tax, Bank Audits, Project Finance, Accounting. Ex–Big Four and mid-size CA firm experience.</p>
              <a href="#" className="mt-4 inline-flex rounded-full px-4 py-2 bg-sky-600 text-white shadow hover:shadow-lg">LinkedIn</a>
            </div>
          </article>
          <article className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl hover:shadow-2xl transition-all">
            <div className="relative h-64">
              <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80" alt="CA Laxman Alway" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold">CA Laxman Alway</h3>
              <p className="mt-2 text-sm text-zinc-700">Proprietor, specialist in Company Taxation.</p>
              <a href="#" className="mt-4 inline-flex rounded-full px-4 py-2 bg-sky-600 text-white shadow hover:shadow-lg">LinkedIn</a>
            </div>
          </article>
        </div>
      </section>

      <section className="w-full py-16 bg-zinc-50" id="book">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-[28px] border border-black/10 p-6 md:p-10 bg-white/80 backdrop-blur shadow-2xl transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left: booking options */}
              <div>
                <h3 className="text-3xl font-extrabold tracking-tight">Book a call</h3>
                <p className="mt-2 text-sm text-zinc-600">45-minute discovery call. India time (Mon–Sat).</p>

                {/* Date field */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Choose a date</label>
                    <span className="text-xs text-zinc-500">IST</span>
                  </div>
                  <div className="mt-2 relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-full border border-black/10 px-4 py-3 text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                </div>

                {/* Time slots */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Choose a time</label>
                    <span className="text-xs text-zinc-500">45 min • IST</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSlot(s)}
                        className={`rounded-2xl px-4 py-2.5 text-sm border transition ${
                          selectedSlot === s
                            ? "bg-sky-50 text-sky-700 border-sky-200 shadow"
                            : "border-black/10 hover:bg-zinc-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: details form */}
              <form className="grid grid-cols-1 gap-4">
                <h3 className="text-3xl font-extrabold tracking-tight">Your details</h3>
                <input type="text" className="mt-2 w-full rounded-full border border-black/10 px-5 py-3.5 text-[15px] shadow-sm" placeholder="Your name" />
                <input type="email" required className="w-full rounded-full border border-black/10 px-5 py-3.5 text-[15px] shadow-sm" placeholder="Email (required)" />
                <input type="tel" required className="w-full rounded-full border border-black/10 px-5 py-3.5 text-[15px] shadow-sm" placeholder="Phone / WhatsApp (required) e.g. +91…" />
                <input type="text" className="w-full rounded-full border border-black/10 px-5 py-3.5 text-[15px] shadow-sm" placeholder="How did you hear about us?" />
                <textarea className="w-full rounded-3xl border border-black/10 px-5 py-3.5 text-[15px] shadow-sm h-40" placeholder="Enter your query" />
                <div className="flex items-center gap-3">
                  <button type="button" className="inline-flex items-center rounded-full px-6 py-3 bg-zinc-800 text-white shadow hover:shadow-lg">Confirm booking</button>
                  <span className="text-xs text-zinc-500">Selected: {date} at {selectedSlot} IST</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="text-2xl md:text-3xl font-semibold">Tax, Blogs & News</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Tax Due Date Reminders", "Blogs", "News"].map((colTitle) => (
              <div key={colTitle} className="rounded-3xl border border-black/10 bg-white shadow overflow-hidden">
                <div className="px-4 py-3 font-medium">{colTitle}</div>
                <div className="h-72 overflow-hidden">
                  <div className="animate-scroll space-y-3 p-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <article key={i} className="rounded-xl border border-black/10 p-3">
                        <div className="text-sm font-medium">{colTitle} item {i + 1}</div>
                        <p className="mt-1 text-xs text-zinc-600">Brief description goes here. Auto-scrolling content sample.</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <style jsx>{`
            .animate-scroll { animation: scrollUp 18s linear infinite; }
            @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
          `}</style>
        </div>
      </section>

      <section className="w-full py-16 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="text-2xl md:text-3xl font-semibold">What clients say</h3>
          <div className="relative mt-6">
            <div className="flex items-stretch gap-6 overflow-x-auto no-scrollbar snap-x" id="testimonials">
              {testimonials.map((t, i) => (
                <article key={i} className="snap-start min-w-[90%] md:min-w-[48%] lg:min-w-[32%] rounded-3xl overflow-hidden border border-black/10 bg-white shadow-lg">
                  <div className="relative h-64">
                    <Image src={t.img} alt={`${t.name} photo`} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="text-base text-zinc-700">“{t.text}”</div>
                    <div className="mt-4 text-sm font-medium">{t.company} · {t.name}, {t.title} · {t.city}</div>
                  </div>
                </article>
              ))}
            </div>
            {/* Transparent side scroll buttons */}
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => {
                const el = document.getElementById("testimonials");
                if (el) el.scrollBy({ left: -400, behavior: "smooth" });
              }}
              className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/20 hover:bg-black/30 text-white grid place-items-center"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => {
                const el = document.getElementById("testimonials");
                if (el) el.scrollBy({ left: 400, behavior: "smooth" });
              }}
              className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/20 hover:bg-black/30 text-white grid place-items-center"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="text-2xl md:text-3xl font-semibold">Our Office</h3>
          <div className="mt-6 rounded-3xl overflow-hidden border border-black/10 shadow">
            <div className="relative h-72">
              <Image src={mapUrl} alt="Panaji Goa map" fill className="object-cover" unoptimized />
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="font-semibold">Alway & Associates Chartered Accountants</div>
          <nav className="text-sm flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className="hover:underline">Home</Link>
            <a href="#services" className="hover:underline">Services</a>
            <a href="#" className="hover:underline">Blogs</a>
            <a href="#" className="hover:underline">Testimonials</a>
            <a href="#book" className="hover:underline">Contact</a>
          </nav>
          <div className="flex gap-4 justify-start md:justify-end text-zinc-600">
            <a href="#" aria-label="LinkedIn" className="hover:text-zinc-900">in</a>
            <a href="#" aria-label="WhatsApp" className="hover:text-zinc-900">wa</a>
            <a href="mailto:info@example.com" aria-label="Email" className="hover:text-zinc-900">@</a>
          </div>
        </div>
        <div className="text-center text-xs text-zinc-500 py-4">© {new Date().getFullYear()} Alway & Associates. All rights reserved.</div>
      </footer>

      {/* Dummy WhatsApp button (no integration) */}
      <button
        type="button"
        aria-label="Chat on WhatsApp"
        className="group fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-transform duration-200 hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="22"
          height="22"
          aria-hidden="true"
          className="drop-shadow-sm transition-transform group-hover:scale-110"
          fill="currentColor"
        >
          <path d="M19.11 17.13c-.26-.13-1.53-.75-1.77-.84-.24-.09-.42-.13-.6.13-.18.26-.69.84-.84 1.02-.15.18-.31.2-.57.07-.26-.13-1.08-.4-2.06-1.28-.76-.68-1.28-1.52-1.43-1.78-.15-.26-.02-.4.11-.53.11-.11.26-.29.4-.44.13-.15.18-.26.27-.44.09-.18.04-.33-.02-.46-.06-.13-.6-1.44-.82-1.98-.22-.54-.44-.46-.6-.47-.15-.01-.33-.01-.51-.01s-.47.07-.72.33c-.25.26-.95.93-.95 2.27 0 1.34.97 2.62 1.11 2.8.13.18 1.91 2.91 4.62 4.08.65.28 1.16.45 1.56.58.65.21 1.24.18 1.71.11.52-.08 1.53-.63 1.75-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.18-.5-.31z" />
          <path d="M26.8 5.2A12.86 12.86 0 0 0 16 1.33 12.86 12.86 0 0 0 5.2 5.2 12.86 12.86 0 0 0 1.33 16c0 2.27.6 4.49 1.74 6.45L1 31l8.74-2.02A12.86 12.86 0 0 0 16 30.67 12.86 12.86 0 0 0 26.8 26.8 12.86 12.86 0 0 0 30.67 16 12.86 12.86 0 0 0 26.8 5.2zm-1.64 19.83A10.78 10.78 0 0 1 16 26.78c-1.88 0-3.72-.49-5.34-1.42l-.38-.22-5.18 1.2 1.11-5.07-.25-.41A10.78 10.78 0 0 1 5.22 7.8 10.78 10.78 0 0 1 16 5.22c5.74 0 10.44 4.67 10.44 10.4 0 2.79-1.09 5.41-3.28 7.41z" />
        </svg>
        <span className="font-semibold">WhatsApp Us</span>
      </button>
    </main>
  );
}


