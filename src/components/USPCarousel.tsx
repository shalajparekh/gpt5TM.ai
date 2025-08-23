"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type USP = { title: string; detail: string; icon: string; bullets?: string[] };

const items: USP[] = [
  {
    title: "Built for non‑tech owners",
    detail:
      "No SaaS maze. We deliver clear dashboards and done‑for‑you ops so owners can focus on sales, not tools.",
    icon: "🧠",
    bullets: ["Plain‑English dashboards", "Done‑for‑you setup & support"],
  },
  {
    title: "Fast turnaround with AI + templates",
    detail:
      "Pre‑tested templates + AI accelerate delivery. Launch in days, not months—without agency overhead.",
    icon: "⚡",
    bullets: ["Launch in days, not months", "Lower build + maintenance cost"],
  },
  {
    title: "Hyper‑local trust",
    detail:
      "Bangalore presence for face‑to‑face onboarding, faster support, and context on Indian SMB buyers.",
    icon: "💬",
    bullets: ["On‑ground onboarding", "Buyer insights for Indian SMBs"],
  },
  {
    title: "End‑to‑end, not siloed",
    detail:
      "One partner for web, e‑commerce, WhatsApp, SEO, and ads—less handoffs, fewer surprises, clearer ROI.",
    icon: "🎯",
    bullets: ["One owner, fewer handoffs", "Clear single‑source reporting"],
  },
  {
    title: "Productized packages",
    detail:
      "Transparent scope and pricing SMBs can plan for. Pick a package, add extras, go live.",
    icon: "📦",
    bullets: ["Transparent scope & pricing", "Add‑ons when you need them"],
  },
];

export default function USPCarousel({
  title = "Why Nesh Tech?",
  subtitle = "Bangalore‑built. AI‑powered. Small Business Ready.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;
    const step = 2;
    const nextIndex = (indexRef.current + (dir > 0 ? step : -step) + children.length) % children.length;
    indexRef.current = nextIndex;
    const target = children[nextIndex];
    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (paused) return;
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length === 0) return;
      const step = 2;
      const nextIndex = (indexRef.current + step) % children.length;
      indexRef.current = nextIndex;
      if (nextIndex === 0) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const target = children[nextIndex];
        el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
      }
    }, 4000);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section id="why" className="w-full py-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">{subtitle}</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollBy(-1)}
              className="h-10 w-10 rounded-full border border-black/10 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/10"
              aria-label="Previous"
            >
              ◀
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="h-10 w-10 rounded-full border border-black/10 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/10"
              aria-label="Next"
            >
              ▶
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {items.map((u, i) => (
            <motion.article
              key={i}
              className="snap-start shrink-0 w-[85%] sm:w-[48%] md:w-[48%] rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-7 md:p-9 shadow-xl min-h-[360px] md:min-h-[420px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-500 text-white flex items-center justify-center text-xl">
                <span aria-hidden>{u.icon}</span>
              </div>
              <h3 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{u.title}</h3>
              <p className="mt-3 text-base md:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">{u.detail}</p>
              {u.bullets && (
                <ul className="mt-3 space-y-1 text-sm md:text-base text-zinc-600 dark:text-zinc-300 list-disc pl-5">
                  {u.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}


