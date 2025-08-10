"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

type Service = {
  key: string;
  title: string;
  brief: string;
  details: string;
  bullets?: string[];
};

const serviceList: Service[] = [
  {
    key: "web",
    title: "Websites & Apps",
    brief: "Custom, fast, AI‑ready websites and progressive web apps that load in milliseconds and convert visitors into leads.",
    details:
      "Mobile‑first builds with hosting, SSL, analytics, schema markup, and AI chatbot integration. We design for SEO, performance and clear calls‑to‑action to maximise enquiries.",
    bullets: ["Mobile‑first + lighthouse 90+", "AI chat & form automations"],
  },
  {
    key: "ecom",
    title: "E‑commerce",
    brief: "Shopify/WooCommerce stores optimised for UPI and one‑click checkout.",
    details:
      "Razorpay/Stripe/Paytm payments, coupon systems, inventory sync, shipping integrations and order tracking. We set up product pages that upsell and recover carts.",
    bullets: ["UPI/Wallet/EMI support", "Abandoned cart recovery"],
  },
  {
    key: "whatsapp",
    title: "WhatsApp Commerce",
    brief: "WhatsApp Store and Cart with payment links, catalog sync and automated follow‑ups.",
    details:
      "Turn WhatsApp into a sales channel: add to cart, collect payments, send order updates and abandoned cart nudges. Seamless sync with Shopify/WooCommerce.",
    bullets: ["1‑tap payment links", "Broadcasts & order updates"],
  },
  {
    key: "ppc",
    title: "PPC & SEO",
    brief: "ROI‑first campaigns and search optimisation tuned for local discovery.",
    details:
      "Google & Meta ads with keyword/creative testing, on‑page + technical SEO, local SEO, and weekly action‑oriented reporting so you know what’s driving ROI.",
    bullets: ["Keyword + creative testing", "Local SEO & map pack"],
  },
  {
    key: "email",
    title: "Email Automation",
    brief: "Lifecycle flows that bring customers back automatically.",
    details:
      "Welcome series, cart recovery, re‑engagement and post‑purchase flows with segmentation and deliverability best practices to lift repeat purchases.",
    bullets: ["Segmented broadcasts", "Deliverability best practices"],
  },
  {
    key: "brand",
    title: "Branding & Design",
    brief: "Consistent identity across web, social and ads.",
    details:
      "Logos, brand kits, templates and sales collateral. We build template systems so your team can ship creatives faster without breaking brand.",
    bullets: ["Reusable design system", "Sales collateral"],
  },
  {
    key: "video",
    title: "Video Scripts",
    brief: "High‑conversion reels and shorts using hook‑first storytelling.",
    details:
      "AI‑assisted scripts and storyboards for Instagram, YouTube and ads. We focus on clear CTAs, social‑proof and retention in the first three seconds.",
    bullets: ["Hook‑first scripting", "IG/YouTube formats"],
  },
  {
    key: "addons",
    title: "Add‑ons",
    brief: "Boosters that round out your stack.",
    details:
      "WhatsApp notifications, Instagram Shop setup, product photoshoots, coupon engines and abandoned‑cart emails to close the loop.",
    bullets: ["Instagram Shop setup", "Coupon engines"],
  },
  {
    key: "support",
    title: "Care Plans",
    brief: "Monthly support, security and growth experiments.",
    details:
      "Ongoing updates, performance checks, SEO tweaks, A/B tests and priority support so your site keeps getting better month after month.",
    bullets: ["Priority support", "A/B tests & SEO tweaks"],
  },
];

export default function ServicesSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <section id="services" className="w-full py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Services Offered</h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">Nine productized services. Click a card to learn more.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((s) => {
            const isOpen = expanded === s.key;
            return (
              <motion.article
                key={s.key}
                layout
                onClick={() => setExpanded(isOpen ? null : s.key)}
                className="group relative overflow-hidden cursor-pointer rounded-3xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 p-8 shadow-2xl hover:shadow-[0_35px_80px_rgba(0,0,0,0.35)] transition-shadow min-h-[420px] flex flex-col"
                whileHover={{ y: -4 }}
              >
                {/* decorative glow */}
                <div className="pointer-events-none absolute -z-10 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden>
                  <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-indigo-400/20 blur-2xl" />
                </div>
                <motion.h3 layout className="text-3xl font-bold tracking-tight">
                  {s.title}
                </motion.h3>
                <motion.p layout className="mt-4 text-base md:text-lg font-medium text-zinc-700 dark:text-zinc-300">
                  {s.brief}
                </motion.p>
                {s.bullets && (
                  <ul className="mt-4 space-y-1 text-base text-zinc-600 dark:text-zinc-300 list-disc pl-5">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-5 text-base text-zinc-700 dark:text-zinc-200 leading-relaxed">{s.details}</p>
                      <div className="mt-4 flex gap-3">
                        <Link href="/pricing" className="inline-flex items-center rounded-full px-5 py-2.5 bg-blue-600 text-white text-base">
                          Pricing
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isOpen && (
                  <div className="mt-auto pt-6 flex gap-3">
                    <Link href="/pricing" className="inline-flex items-center rounded-full px-5 py-2.5 border text-blue-700 border-blue-300 dark:text-blue-300 dark:border-blue-500/60 text-base bg-white/60 dark:bg-zinc-950/40">
                      Pricing
                    </Link>
                    <button className="inline-flex items-center rounded-full px-5 py-2.5 bg-blue-600 text-white text-base">
                      Know More
                    </button>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


