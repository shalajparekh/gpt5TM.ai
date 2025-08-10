import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold">TechMaadi.ai</div>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm">
              We help small businesses launch faster, sell more, and automate growth with AI‑powered web, e‑commerce, and WhatsApp solutions.
            </p>
            <div className="mt-4 flex items-center gap-3 text-zinc-600">
              <a href="#" aria-label="X" className="h-9 w-9 rounded-xl border border-black/10 flex items-center justify-center">𝕏</a>
              <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-xl border border-black/10 flex items-center justify-center">◎</a>
              <a href="#" aria-label="LinkedIn" className="h-9 w-9 rounded-xl border border-black/10 flex items-center justify-center">in</a>
              <a href="#" aria-label="GitHub" className="h-9 w-9 rounded-xl border border-black/10 flex items-center justify-center">◎</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="#services">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="#services">Integrations</Link></li>
              <li><Link href="#why">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Tutorials</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><Link href="#contact">Contact</Link></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>
        </div>
        <hr className="my-6 border-black/10 dark:border-white/10" />
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 gap-3">
          <p>© {new Date().getFullYear()} TechMaadi.ai. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


