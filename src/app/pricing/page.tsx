"use client";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// const plans = [...] // reserved for future use

export default function PricingPage() {
  const { items, total, remove } = useCart();
  return (
    <div className="min-h-screen w-full py-16 bg-gradient-to-b from-violet-50 to-white dark:from-zinc-950 dark:to-black">
      <div className="mx-auto max-w-[86.4rem] px-4">
        <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight">Find your fit — from launch to scale!</h1>
        <p className="mt-3 text-center text-zinc-600 dark:text-zinc-300">
          Select from best plans, ensuring a perfect match. Everything you need to launch, sell, and scale!
        </p>


        {/* Toggle placeholder */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-full bg-violet-100 p-1">
            <button className="rounded-full px-6 py-2 bg-violet-600 text-white text-sm font-medium">Yearly (save 10%)</button>
            <button className="rounded-full px-6 py-2 text-sm">Monthly</button>
          </div>
        </div>

        {/* Scrollable plans */}
        <ScrollablePlans />

        {/* Square info cards (placeholders) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-3xl border border-black/10 bg-gradient-to-b from-violet-100 to-white p-6 shadow-xl transition-all duration-200 hover:shadow-2xl">
            <div className="aspect-[2/1] flex flex-col">
              <h3 className="text-2xl font-bold">Project Upkeeping</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                <li>* Monthly 1 - Minor Website Change</li>
                <li>* SSL and Domain upkeeping</li>
		            <li>* Website Uptime Gurantee</li>
                <li>* Web Assets refresh and API upkeeping</li>
                <li>* WhatsApp/Phone Support (Mon-Fri)</li>
              </ul>
              <div className="mt-auto" />
            </div>
          </article>
          <article className="rounded-3xl border border-black/10 bg-gradient-to-b from-violet-100 to-white p-6 shadow-xl transition-all duration-200 hover:shadow-2xl">
            <div className="aspect-[2/1] flex flex-col">
              <h3 className="text-2xl font-bold">Customer Journey</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                <li>Google search → Mobile site browsing → Service selection → WhatsApp/online booking → Instant confirmation & payment → Appointment reminders → Post-service engagement & offers</li>
                <br/>
                <li><strong>What customers get:</strong></li>
                <li>effortless discovery, fast booking, clear confirmations, and personalised follow-ups that keep them coming back.</li>
              </ul>
              <div className="mt-auto" />
            </div>
          </article>
          <article className="rounded-3xl border border-black/10 bg-gradient-to-b from-violet-100 to-white p-6 shadow-xl transition-all duration-200 hover:shadow-2xl">
            <div className="aspect-[2/1] flex flex-col">
              <h3 className="text-2xl font-bold">Owner’s Business Ease</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li>Update services & prices in Google Sheets or WhatsApp → Auto-sync to your website in real time → Unified booking calendar with no double-books → Automated appointment reminders & payments & actionable insights</li>
                <br/>
                <li><strong>What owners get:</strong></li>
                <li>fewer manual updates, fewer no-shows, faster cashflow, and clear daily intelligence to grow profitably.</li>
              </ul>
              <div className="mt-auto" />
            </div>
          </article>
        </div>

        {/* Cart summary */}
        <div id="cart" className="mt-12 rounded-2xl border border-black/10 p-6 bg-white">
          <h2 className="text-xl font-semibold">Cart</h2>
          {items.length === 0 ? (
            <p className="mt-2 text-zinc-600">Your cart is empty.</p>
          ) : (
            <>
              <ul className="mt-2 space-y-2">
                {items.map((it) => (
                  <li key={it.key} className="flex items-center justify-between gap-3">
                    <span className="flex-1">
                      {it.title} × {it.qty}
                    </span>
                    <span className="mr-2">₹{(it.price * it.qty).toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => remove(it.key)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-lg font-semibold">Total</div>
                <div className="text-lg font-semibold">₹{total.toLocaleString('en-IN')}</div>
              </div>
              <Link href="/checkout" className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-transform duration-200 hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M7 4h-2l-1 2H2v2h2l3.6 7.59c.17.36.53.59.92.59H19v-2H9.42l-.28-.59L18 11c.38-.01.73-.25.88-.61L21 5H7V4zm16 15a2 2 0 11-4 0 2 2 0 014 0zm-10 0a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span className="font-semibold">Go to checkout</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function ScrollablePlans() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { add } = useCart();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!expanded) return;
      const w = wrapperRef.current;
      if (w && e.target instanceof Node && !w.contains(e.target)) {
        setExpanded(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [expanded]);

  function scrollByCards(direction: 1 | -1) {
    const el = containerRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = firstCard ? firstCard.offsetWidth : el.clientWidth / 3;
    el.scrollBy({ left: direction * (cardWidth + 24), behavior: "smooth" });
  }

  const plans: Array<{
    key: string;
    badge: string;
    title: string;
    price?: string;
    desc: string;
    features: string[];
    details: string[];
    highlight?: boolean;
  }> = [
    {
      key: "starter",
      badge: "Nesh Pro",
      title: "Starter",
      price: "₹20K/setup + 12K/yearly",
      desc: "Perfect for new business launching essentials.",
      features: ["3D - Static Website - 4/5 Pages", "1 - Year Website Hosting", "Custom Domain Name & Unlimited SSL", "5 / 5GB - Custom Email Addresses / Web View", "SEO optimized + Mobile First Platform", "Google/FaceBook - Based Auth login", "GoogleCalendar - Booking Engine (C, U, D, S)", "Booking - 2-way Email confirmations"],

details: ["Record All Bookings - Google Sheets",
        "Contact Us Page - 2 way Email confirmations",
        "WhatsApp Business routing (Web -> WABA)",
      ],
    },
    {
      key: "pro",
      badge: "Nesh Pro +",
      title: "Pro",
      price: "₹30K/setup + 36K/yearly",
      desc: "Enhance and update an existing site.",
      features: ["3D - Dynamic CMS Website - 4/5 Pages", "Business updatable - Daily Pricing Changes", "Business updatable - Daily Offers", "Business updatable - Gallery ", "1 - Year Website Hosting", "Domain Name & Unlimited SSL", "5 / 5GB - Custom Email Addresses, Web View", "SEO optimized + Mobile First Platform", "Google Business integration + Maps", "Google/FaceBook - Based Auth login"],
      details: ["Calendar - Booking Engine (C, U, D, S)",
        "Booking - 2-way Email confirmations",
        "Record All Bookings - Google Sheets",
        "Contact Us Page - 2 way Email confirmations",
        "WhatsApp Business Account Setup",
        "WhatsApp - AI Customer Support Bot",
        "WhatsApp - AI Appointment Scheduler, Reminders",
        "WhatsApp - AI FAQ/Services integration",
        "WhatsApp - Cart/Store Setup/Razorpay",
        "AI Chatbot Integration - Customer Support",
        "AI Chatbot Integration - Business FAQs",
        "AI Chatbot Integration - Product/Services KB",
        "Facebook Business and Instagram Setup",
        "Auto-Generate and Post Instagram Reels - 2mo",
      ],
    },
    {
      key: "proplus",
      badge: "Nesh Pro XL",
      title: "Pro Plus",
      price: "₹50K/setup + 48K/yearly",
      desc: "Build or scale fast with strategy.",
      features: ["3D - Dynamic CMS Website - 4/5 Pages", "Business updatable - Daily Pricing Changes", "Business updatable - Daily Offers", "Business updatable - Gallery ", "1 - Year Website Hosting", "Domain Name & Unlimited SSL", "5 / 5GB - Custom Email Addresses, Web View", "SEO optimized + Mobile First Platform", "Google Business integration + Maps", "Google/FaceBook - Based Auth login"],
      details: ["Calendar - Booking Engine (C, U, D, S)",
        "Booking - 2-way Email confirmations",
        "Record All Bookings - Google Sheets",
        "Contact Us Page - 2 way Email confirmations",
        "WhatsApp Business Account Setup",
        "WhatsApp - AI Customer Support Bot",
        "WhatsApp - AI Appointment Scheduler, Reminders",
        "WhatsApp - AI FAQ/Services integration",
        "WhatsApp - Cart/Store Setup/Razorpay",
        "AI Chatbot Integration - Customer Support",
        "AI Chatbot Integration - Business FAQs",
        "AI Chatbot Integration - Product/Services KB",
        "Facebook Business and Instagram Setup",
        "Auto-Generate and Post Instagram Reels",
        "Auto-comment on Instagram posts",
        "Automated Instagram & Facebook Posting",
        "Auto-Publish YouTube Videos to Facebook",
        "Conversational AI - Call Agent Automation (Local Languages)",
        "Conversational AI - Restaurant Call Handling & Table Booking System",
        "Conversational AI - Automate Call Scheduling with Voice AI Receptionist",
      ],
      highlight: true,
    },
    {
      key: "custom",
      badge: "Nesh AI Chat Auto",
      title: "Custom",
      price: "₹10K setup + 12K yearly ",
      desc: "WhatsApp Business Automation.",
      features: ["WhatsApp - AI Customer Support Bot", "WhatsApp - AI Appointment Scheduler, Reminders", "WhatsApp - AI FAQ/Services integration", "WhatsApp - Store + Cart Setup/notifications ", "WhatsApp - Payment Link + PDF receipts", "WhatsApp - User Chat History retention", "WhatsApp - Feedback Recorder Bot", "WhatsApp Keyword Detection Bot","WhatsApp Bot - Ticket creation/reporting"],        
      details: ["WhatsApp - Dietitian AI Chatbot",
        "WhatsApp - Payment reminder Bot"
      ],
    
    },
    {
      key: "elite",
      badge: "Nesh E-Comm Auto",
      title: "Elite",
      price: "₹Custom Pricing",
      desc: "Multi‑location growth + automation.",
      features: ["Shopify/WooCommerce Store setup", "UPI/Wallet/EMI support", "Abandoned cart recovery emails", "Razorpay/Stripe/Paytm payments", "Hyper-Personalized Email Outreach", "AI Smart Email Responder ", "Personalized AI Tech Newsletter", "YouTube Transcripts into Newsletter"],
      details: ["Email - Cold Outreach Automation"],
    },
  ];

  return (
    <div className="mt-10" ref={wrapperRef}>
      <div className="flex items-center gap-3 md:gap-4">
        <button
          aria-label="Scroll left"
          onClick={() => scrollByCards(-1)}
          className="h-[60px] w-[60px] rounded-full bg-white border border-black/10 shadow-md hover:shadow-lg transition flex items-center justify-center"
        >
          <span className="text-3xl">‹</span>
        </button>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-20 bg-gradient-to-r from-white to-transparent hidden sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-20 bg-gradient-to-l from-white to-transparent hidden sm:block" />
          <div
            ref={containerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory px-3 md:px-1 py-1 noScrollbar scroll-px-3"
          >
            {plans.map((p) => {
              const isExpanded = expanded === p.key;
              function parsePriceToNumber(text?: string): number {
                if (!text) return 0;
                const match = text.match(/(\d+)(\s*[kK])?/);
                if (!match) return 0;
                const base = Number(match[1] || 0);
                const hasK = Boolean(match[2]);
                return hasK ? base * 1000 : base;
              }
              function handleQuickCheckout() {
                const priceNumber = parsePriceToNumber(p.price);
                add({ key: p.key, title: p.badge || p.title, price: priceNumber, qty: 1 });
                // Scroll to cart section on the same page
                const cartEl = document.getElementById("cart");
                if (cartEl) {
                  cartEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }
              return (
                <article
                  key={p.key}
                  data-card
                  className={`snap-center relative rounded-3xl border border-black/10 bg-gradient-to-b from-violet-100 to-white p-6 shadow-xl flex-shrink-0 transition-all duration-200 min-h-[420px] ${
                    isExpanded ? "scale-[1.03] shadow-2xl z-20" : "hover:shadow-2xl hover:-translate-y-1"
                  } min-w-[92%] sm:min-w-[60%] md:min-w-[48%] lg:min-w-[32%] xl:min-w-[30%]`}
                >
                  <div className="flex flex-col h-full">
                    <div className="text-2xl font-extrabold inline-flex items-center justify-center w-fit px-4 h-12 rounded-full bg-violet-100 text-violet-700">
                      {p.badge}
                    </div>
                    {p.price && (
                      <div className="mt-3 text-2xl font-extrabold">{p.price}</div>
                    )}
                    <p className="mt-2 text-sm text-zinc-600">{p.desc}</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {p.features.map((f) => (
                        <li key={f}>✓ {f}</li>
                      ))}
                    </ul>

                    {isExpanded && (
                      <ul className="mt-4 space-y-2 text-sm">
                        {p.details.map((d) => (
                          <li key={d}>✓ {d}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto pt-4 flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickCheckout();
                        }}
                        aria-label="Add package and checkout"
                        className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-transform duration-200 hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                          <path d="M7 4h-2l-1 2H2v2h2l3.6 7.59c.17.36.53.59.92.59H19v-2H9.42l-.28-.59L18 11c.38-.01.73-.25.88-.61L21 5H7V4zm16 15a2 2 0 11-4 0 2 2 0 014 0zm-10 0a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded((cur) => (cur === p.key ? null : p.key));
                        }}
                        className="flex-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 py-3 font-medium"
                      >
                        {isExpanded ? "Hide Details" : "Expand Features"}
                      </button>
                      <Link
                        href="/#calendar"
                        aria-label="Book via calendar"
                        className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-transform duration-200 hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 01.97-.26c1.06.27 2.2.41 3.37.41a1 1 0 011 1V21a1 1 0 01-1 1C10.3 22 2 13.7 2 3a1 1 0 011-1h3.67a1 1 0 011 1c0 1.17.14 2.31.41 3.37a1 1 0 01-.26.97l-2.2 2.2z"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <button
          aria-label="Scroll right"
          onClick={() => scrollByCards(1)}
          className="h-[60px] w-[60px] rounded-full bg-white border border-black/10 shadow-md hover:shadow-lg transition flex items-center justify-center"
        >
          <span className="text-3xl">›</span>
        </button>
      </div>
      <style jsx>{`
        .noScrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .noScrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  );
}

