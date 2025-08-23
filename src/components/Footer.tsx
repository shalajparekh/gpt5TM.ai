//

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-extrabold tracking-tight">Nesh Tech Inc.</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md">Bangalore‑built, AI‑powered solutions for Indian SMBs. Websites, e‑commerce, WhatsApp commerce and performance marketing.</p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">𝕏</a>
              <a href="#" aria-label="LinkedIn" className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">in</a>
              <a href="#" aria-label="Instagram" className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">◎</a>
              <a href="#" aria-label="YouTube" className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">▶</a>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#services" className="hover:underline">Services</a></li>
              <li><a href="#why" className="hover:underline">Why Nesh Tech</a></li>
              <li><a href="#testimonials" className="hover:underline">Testimonials</a></li>
              <li><a href="/pricing" className="hover:underline">Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Contact</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="mailto:sales@neshtech.co.in" className="hover:underline">sales@neshtech.co.in</a></li>
              <li><a href="mailto:sales@neshtech.co.in" className="hover:underline">hello@neshtech.co.in</a></li>
              <li><a href="mailto:sales@neshtech.co.in" className="hover:underline">support@neshtech.co.in</a></li>
              <li><a href="tel:+917760841075" className="hover:underline">+91 77608 41075</a></li>
              <li><span>Nesh Tech Inc, DLF New Town, Akshayanagar, Bangalore</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Nesh Tech Inc.. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


