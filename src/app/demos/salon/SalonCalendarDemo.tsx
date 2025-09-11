"use client";
import { useEffect, useMemo, useState } from "react";

type Slot = { start: string; end: string; available: boolean };

function formatDateYmd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildDateInIST(dateYmd: string, hour: number, minute = 0): Date {
  const iso = `${dateYmd}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+05:30`;
  return new Date(iso);
}

function isSundayIST(ymd: string): boolean {
  const dt = new Date(`${ymd}T12:00:00+05:30`);
  return dt.getUTCDay() === 0;
}

function generateDaySlotsIST(dateYmd: string, durationMinutes: number): Slot[] {
  const slots: Slot[] = [];
  for (let h = 10; h < 19; h++) {
    const start = buildDateInIST(dateYmd, h, 0);
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    slots.push({ start: start.toISOString(), end: end.toISOString(), available: true });
  }
  return slots;
}

function seedFromString(s: string): number {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
  return x || 1;
}

function markUnavailableDeterministic(slots: Slot[], seedStr: string): Slot[] {
  const seed = seedFromString(seedStr);
  // Mark 2 slots as unavailable in a deterministic way based on the date string
  const a = seed % slots.length;
  const b = (seed >> 3) % slots.length;
  return slots.map((s, idx) => ({ ...s, available: idx !== a && idx !== b }));
}

export default function SalonCalendarDemo() {
  const [day, setDay] = useState<string>(() => formatDateYmd(new Date()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [closedReason, setClosedReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingBusy, setBookingBusy] = useState(false);
  const duration = 45;

  const todayMin = useMemo(() => formatDateYmd(new Date()), []);
  const canBook = Boolean(selectedStart && name && email && phone);

  useEffect(() => {
    setLoading(true);
    // Dummy generation: 9 hourly slots; closed on Sundays.
    const ymd = day;
    const sunday = isSundayIST(ymd);
    if (sunday) {
      setClosedReason("Sunday");
      setSlots([]);
      setLoading(false);
      return;
    }
    const base = generateDaySlotsIST(ymd, duration);
    const marked = markUnavailableDeterministic(base, ymd);
    setSlots(marked);
    setClosedReason(null);
    setLoading(false);
  }, [day]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [success]);

  async function book() {
    if (!canBook) return;
    try {
      setBookingBusy(true);
      setBookingError(null);
      // Dummy confirmation — no backend calls
      await new Promise((r) => setTimeout(r, 500));
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Booking failed";
      setBookingError(msg);
    } finally {
      setBookingBusy(false);
    }
  }

  function resetForm() {
    setSelectedStart(null);
    setName("");
    setEmail("");
    setPhone("");
    setSource("");
    setQuery("");
    setSuccess(false);
    setBookingError(null);
  }

  const displayedSlots = useMemo(() => slots.slice(0, 9), [slots]);

  return (
    <section id="calendar" className="relative w-full py-24" suppressHydrationWarning>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black" />
        <div className="absolute -top-16 -left-16 h-[320px] w-[320px] rounded-full bg-rose-200/25 dark:bg-rose-900/20 blur-3xl" />
        <div className="absolute -top-16 -right-16 h-[320px] w-[320px] rounded-full bg-pink-200/25 dark:bg-pink-900/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-[320px] w-[320px] rounded-full bg-fuchsia-200/25 dark:bg-fuchsia-900/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-[320px] w-[320px] rounded-full bg-purple-200/25 dark:bg-purple-900/20 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-[28px] overflow-hidden border border-black/20 dark:border-white/20 bg-white dark:bg-zinc-900 shadow-[0_40px_120px_rgba(0,0,0,0.35),0_20px_60px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,0,0,0.18)]">
          <div className="grid md:grid-cols-2 text-black dark:text-zinc-100">
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-black/20 dark:border-white/20 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Book a salon visit</h3>
              <p className="text-sm mb-6">45-minute appointment. India time (Mon–Sat).</p>
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-medium">Choose a date</label>
                <span className="text-xs">IST</span>
              </div>
              <input
                type="date"
                value={day}
                min={todayMin}
                onChange={(e) => setDay(e.target.value)}
                className="w-full rounded-2xl border border-black/30 px-4 py-3 bg-white text-black placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              <div className="mt-10 min-h-40">
                {loading ? (
                  <div className="text-sm">Loading slots…</div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium">Choose a time</label>
                      <span className="text-xs">45 min • IST</span>
                    </div>
                    {closedReason ? (
                      <div className="text-sm">Closed: {closedReason}.</div>
                    ) : displayedSlots.length === 0 ? (
                      <div className="text-sm">No slots available this day.</div>
                    ) : (
                      <div role="radiogroup" className="grid grid-cols-3 gap-2">
                        {displayedSlots.map((s) => {
                          const isSelected = selectedStart === s.start;
                          const isAvailable = s.available;
                          const time = new Date(s.start).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
                          return (
                            <button
                              key={s.start}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              disabled={!isAvailable}
                              onClick={() => isAvailable && setSelectedStart(s.start)}
                              className={`rounded-xl border px-3 py-3 text-sm transition shadow-sm ${
                                isAvailable
                                  ? `text-black border-rose-300 hover:bg-rose-50 ${isSelected ? "border-rose-600 bg-rose-300 text-black shadow-md" : ""}`
                                  : "text-zinc-400 border-zinc-300 bg-zinc-100 cursor-not-allowed"
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Your details</h3>
              <div className="space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-black/30 px-4 py-3 bg-white text-black placeholder:text-zinc-600" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (required)" className="w-full rounded-2xl border border-black/30 px-4 py-3 bg-white text-black placeholder:text-zinc-600" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone / WhatsApp (required) e.g. +91…" className="w-full rounded-2xl border border-black/30 px-4 py-3 bg-white text-black placeholder:text-zinc-600" />
                <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="How did you hear about us?" className="w-full rounded-2xl border border-black/30 px-4 py-3 bg-white text-black placeholder:text-zinc-600" />
                <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter your query" className="w-full rounded-2xl border border-black/30 px-4 py-3 bg-white text-black placeholder:text-zinc-600 min-h-28" />
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={book}
                    disabled={!canBook || bookingBusy}
                    className={`${canBook ? "bg-gradient-to-r from-rose-600 to-pink-600 shadow-md hover:shadow-[0_10px_30px_rgba(244,63,94,0.45)] hover:scale-105 active:scale-95" : "bg-gradient-to-r from-zinc-400 to-zinc-500 cursor-not-allowed"} inline-flex items-center justify-center rounded-full px-5 py-2.5 text-white text-sm font-semibold transition-transform duration-200`}
                  >
                    {bookingBusy ? "Booking…" : "Confirm booking"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-white text-sm font-semibold transition-transform duration-200 bg-gradient-to-r from-rose-600 to-pink-600 shadow-md hover:shadow-[0_10px_30px_rgba(244,63,94,0.45)] hover:scale-105 active:scale-95"
                  >
                    Reset
                  </button>
                </div>
                {bookingError && <p className="text-rose-600 text-sm">{bookingError}</p>}
                {success && (
                  <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
                    <div className="max-w-sm w-full rounded-2xl border border-green-600/40 bg-green-50 text-green-800 shadow-lg px-4 py-3 text-sm text-center">
                      <p className="font-semibold">Hooray! Booking noted.</p>
                      <p className="mt-1">This is a demo — no email sent.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


