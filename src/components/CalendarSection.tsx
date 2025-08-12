"use client";
import { useEffect, useMemo, useState } from "react";

type Slot = { start: string; end: string; available: boolean };

export default function CalendarSection() {
  const [day, setDay] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const duration = 45; // fixed as per requirement
  function normalizeYmd(value: string): string {
    const parts = value.split("-");
    if (parts.length === 3) {
      const [a, b, c] = parts;
      // If input is DD-MM-YYYY, convert to YYYY-MM-DD
      if (a.length === 2 && c.length === 4) {
        return `${c}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`;
      }
    }
    return value; // assume already YYYY-MM-DD
  }

  const selectedDate = useMemo(() => {
    const iso = normalizeYmd(day);
    const [y, m, d] = iso.split("-").map((n) => Number(n));
    return new Date(Number(y), (Number(m) || 1) - 1, Number(d) || 1, 0, 0, 0, 0);
  }, [day]);
  const isSunday = selectedDate.getDay() === 0;
  const canBook = Boolean(selectedStart && name && email && phone);
  const [dateTouched, setDateTouched] = useState(false);

  useEffect(() => {
    setLoading(true);
    const dayForApi = normalizeYmd(day);
    fetch(`/api/booking?day=${dayForApi}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []))
      .finally(() => setLoading(false));
  }, [day]);

  const grouped = useMemo(() => slots.filter((s) => s.available), [slots]);

  async function book() {
    if (!selectedStart || !name || !email || !phone) return;
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, notes: query, source, startISO: selectedStart, durationMinutes: duration }),
    });
    const data = await res.json();
    if (data?.id) {
      setSuccessId(data.id);
      // Trigger WhatsApp notifications (business + optional user)
      const businessNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_TO;
      const userNumber = phone || undefined;
      if (businessNumber) {
        fetch("/api/booking/whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: data.id, userWhatsapp: userNumber, businessWhatsapp: businessNumber }),
        });
      }
    }
  }

  return (
    <section id="calendar" className="w-full py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-[28px] overflow-hidden border border-black/20 dark:border-white/20 bg-white dark:bg-zinc-900 shadow-[0_40px_120px_rgba(0,0,0,0.35),0_20px_60px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,0,0,0.18)]">
          <div className="grid md:grid-cols-2 text-black dark:text-zinc-100">
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-black/20 dark:border-white/20 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-black dark:text-zinc-100">Book a call</h3>
              <p className="text-sm mb-6 text-black dark:text-zinc-200">45-minute discovery call. India time (Mon–Sat).</p>
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-medium text-black dark:text-zinc-100">Choose a date</label>
                <span className="text-xs text-black dark:text-zinc-300">IST</span>
              </div>
              <input
                type="date"
                value={day}
                onChange={(e) => { setDay(e.target.value); setDateTouched(true); }}
                className={`w-full rounded-2xl border border-black/30 dark:border-white/30 px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 placeholder:text-zinc-600 dark:placeholder:text-zinc-400 focus:outline-none transition-shadow ${dateTouched ? "border-black ring-2 ring-black/30 bg-blue-50 dark:bg-blue-900/30" : "focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"}`}
              />
              <div className="mt-10 min-h-40">
                {loading ? (
                  <div className="text-sm text-black dark:text-zinc-200">Loading slots…</div>
                ) : isSunday ? (
                  <div className="text-sm text-black dark:text-zinc-200">Closed on Sundays.</div>
                ) : grouped.length === 0 ? (
                  <div className="text-sm text-black dark:text-zinc-200">No slots available this day.</div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-black dark:text-zinc-100">Choose a time</label>
                      <span className="text-xs text-black dark:text-zinc-100">45 min • IST</span>
                    </div>
                    <div role="radiogroup" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {grouped.slice(0, 8).map((s) => {
                        const isSelected = selectedStart === s.start;
                        const time = new Date(s.start).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
                        return (
                          <button
                            key={s.start}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setSelectedStart(s.start)}
                            className={`rounded-xl border px-3 py-2 text-sm transition shadow-sm text-black border-blue-300 hover:bg-blue-50 ${isSelected ? "border-blue-600 bg-blue-300 text-black shadow-md" : ""}`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-zinc-100">Your details</h3>
              <div className="space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-black/30 dark:border-white/30 px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 placeholder:text-zinc-600 dark:placeholder:text-zinc-400" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (required)" className="w-full rounded-2xl border border-black/30 dark:border-white/30 px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 placeholder:text-zinc-600 dark:placeholder:text-zinc-400" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone / WhatsApp (required) e.g. +91…" className="w-full rounded-2xl border border-black/30 dark:border-white/30 px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 placeholder:text-zinc-600 dark:placeholder:text-zinc-400" />
                <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="How did you hear about us?" className="w-full rounded-2xl border border-black/30 dark:border-white/30 px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 placeholder:text-zinc-600 dark:placeholder:text-zinc-400" />
                <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter your query" className="w-full rounded-2xl border border-black/30 dark:border-white/30 px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 placeholder:text-zinc-600 dark:placeholder:text-zinc-400 min-h-28" />
                <button
                  onClick={book}
                  disabled={!canBook}
                className={`${canBook
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95"
                    : "bg-gradient-to-r from-zinc-400 to-zinc-500 cursor-not-allowed"} inline-flex items-center justify-center rounded-full px-5 py-2.5 text-white text-sm font-semibold transition-transform duration-200`}
                >
                  Confirm booking
                </button>
                {successId && (
                  <p className="text-green-600">Booked! We’ve sent you a WhatsApp confirmation.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


