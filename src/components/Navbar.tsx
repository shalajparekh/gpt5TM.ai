"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [demosOpen, setDemosOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40 border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
        <Link href="/" className="tracking-tight" style={{ fontFamily: 'var(--font-geist-sans)' }}>
          <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-lg md:text-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="drop-shadow-sm">
              <path d="M12 3.25v1.5M7.5 4.5l-1-1M16.5 4.5l1-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M4 4h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7.5L9 20.5V15H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9.5" cy="9.5" r="1.25" fill="currentColor"/>
              <circle cx="14.5" cy="9.5" r="1.25" fill="currentColor"/>
            </svg>
            TechMaadi.ai
          </span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-geist-sans)' }}>
          <motion.div whileHover={{ y: -2 }}>
            <Link href="#services" className="hover:opacity-80 font-semibold">Services</Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }}>
            <Link href="#testimonials" className="hover:opacity-80 font-semibold">Testimonials</Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }}>
            <Link href="/pricing" className="hover:opacity-80 font-semibold">Pricing</Link>
          </motion.div>
          <div className="relative group">
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/#demos" className="hover:opacity-80 font-semibold">App Demos</Link>
            </motion.div>
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition">
              <ul className="p-3 text-sm">
                <li>
                  <Link href="/demos/salon" className="block rounded-xl px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">Salons, Spa, Wellness Center Demo</Link>
                </li>
                <li>
                  <Link href="/demos/cafe" className="block rounded-xl px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">Cafés / Cloud Kitchens Demo</Link>
                </li>
                <li>
                  <Link href="/demos/fashion" className="block rounded-xl px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">Fashion Boutiques Demo</Link>
                </li>
              </ul>
            </div>
          </div>
          <motion.div whileHover={{ y: -2 }}>
            <Link href="#contact" className="hover:opacity-80 font-semibold">Contact</Link>
          </motion.div>
        </nav>
        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-black/10"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-white text-sm font-semibold transition-transform duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Get proposal
          </Link>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-black/60 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            <Link href="#services" className="block py-2 font-semibold" onClick={close}>Services</Link>
            <Link href="#testimonials" className="block py-2 font-semibold" onClick={close}>Testimonials</Link>
            <Link href="/pricing" className="block py-2 font-semibold" onClick={close}>Pricing</Link>

            {/* App Demos collapsible */}
            <button
              className="w-full text-left py-2 font-semibold inline-flex items-center justify-between"
              onClick={() => setDemosOpen((v) => !v)}
              aria-expanded={demosOpen}
            >
              <span>App Demos</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${demosOpen ? 'rotate-180' : ''} transition-transform`}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            {demosOpen && (
              <div className="pl-3 space-y-2">
                <Link href="/demos/salon" className="block py-2" onClick={close}>Salons, Spa, Wellness Center Demo</Link>
                <Link href="/demos/cafe" className="block py-2" onClick={close}>Cafés / Cloud Kitchens Demo</Link>
                <Link href="/demos/fashion" className="block py-2" onClick={close}>Fashion Boutiques Demo</Link>
              </div>
            )}

            <Link href="#contact" className="block py-2 font-semibold" onClick={close}>Contact</Link>
            <div className="pt-2">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-white text-sm font-semibold transition-transform duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95"
                onClick={close}
              >
                Get proposal
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


