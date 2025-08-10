"use client";
import { useCart } from "@/contexts/CartContext";

const plans = [
  { key: "web", title: "Websites & Apps", price: 29999 },
  { key: "ecom", title: "E-commerce", price: 39999 },
  { key: "whatsapp", title: "WhatsApp Commerce", price: 19999 },
  { key: "ppc", title: "PPC & SEO", price: 14999 },
  { key: "email", title: "Email Automation", price: 9999 },
  { key: "brand", title: "Branding & Design", price: 14999 },
  { key: "video", title: "Video Scripts", price: 7999 },
  { key: "addons", title: "Add-ons", price: 4999 },
  { key: "support", title: "Care Plans", price: 7999 },
];

export default function PricingPage() {
  const { add, items, total } = useCart();
  return (
    <div className="min-h-screen w-full py-16 bg-gradient-to-b from-violet-50 to-white dark:from-zinc-950 dark:to-black">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight">Choose your right plan!</h1>
        <p className="mt-3 text-center text-zinc-600 dark:text-zinc-300">
          Select from best plans, ensuring a perfect match. Need more or less? Customize your subscription for a seamless fit!
        </p>

        {/* Toggle placeholder */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-full bg-violet-100 p-1">
            <button className="rounded-full px-6 py-2 bg-violet-600 text-white text-sm font-medium">Monthly</button>
            <button className="rounded-full px-6 py-2 text-sm">Quarterly (save 10%)</button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Pro */}
          <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-xl flex flex-col">
            <div className="text-xs font-semibold inline-flex items-center justify-center w-12 h-6 rounded-full bg-violet-100 text-violet-700">Pro</div>
            <p className="mt-3 text-sm text-zinc-600">Ideal for those who’ve already got their website up and running and are seeking assistance to enhance and update it further.</p>
            <div className="mt-6 text-4xl font-extrabold">₹25,000<span className="text-sm font-medium">/month</span></div>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ 3–5 day turnaround</li>
              <li>✓ Native Development</li>
              <li>✓ Task delivered one‑by‑one</li>
              <li>✓ Dedicated dashboard</li>
              <li>✓ Updates via Dashboard & Slack</li>
            </ul>
            <button className="mt-auto rounded-xl bg-zinc-100 hover:bg-zinc-200 py-3 font-medium" onClick={() => add({ key: 'pro', title: 'Pro', price: 25000, qty: 1 })}>Get started</button>
          </article>

          {/* Pro Plus */}
          <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-xl flex flex-col">
            <div className="text-xs font-semibold inline-flex items-center justify-center w-16 h-6 rounded-full bg-indigo-100 text-indigo-700">Pro Plus</div>
            <p className="mt-3 text-sm text-zinc-600">Ideal if you want to build or scale your website fast, with the strategy calls included.</p>
            <div className="mt-6 text-4xl font-extrabold">₹38,000<span className="text-sm font-medium">/month</span></div>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ 1–3 day turnaround</li>
              <li>✓ Monthly strategy call</li>
              <li>✓ Commercial license</li>
              <li>✓ Native Development</li>
              <li>✓ Tasks delivered one‑by‑one</li>
              <li>✓ Dedicated dashboard</li>
              <li>✓ Updates via Dashboard & Slack</li>
            </ul>
            <button className="mt-auto rounded-xl bg-zinc-100 hover:bg-zinc-200 py-3 font-medium" onClick={() => add({ key: 'proplus', title: 'Pro Plus', price: 38000, qty: 1 })}>Get started</button>
          </article>

          {/* Custom */}
          <article className="rounded-3xl border border-black/10 bg-gradient-to-b from-violet-100 to-white p-6 shadow-xl flex flex-col">
            <div className="text-xs font-semibold inline-flex items-center justify-center w-14 h-6 rounded-full bg-white text-violet-700 border border-violet-300">Custom</div>
            <p className="mt-3 text-sm text-zinc-700">If these plans don’t fit, let’s create one that suits. Customize your subscription for a perfect fit, bigger or smaller!</p>
            <h3 className="mt-6 text-3xl font-extrabold">Let’s Talk!</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>✓ Everything in design & development</li>
              <li>✓ Strategy workshop</li>
              <li>✓ Priority support</li>
              <li>✓ Multiple tasks at once</li>
              <li>✓ Ongoing autonomous A/B testing</li>
              <li>✓ Advanced custom development</li>
            </ul>
            <a href="#contact" className="mt-auto inline-flex items-center justify-center rounded-xl bg-zinc-900 text-white py-3 font-medium hover:opacity-90">Book a Call</a>
          </article>
        </div>

        {/* Cart summary */}
        <div className="mt-12 rounded-2xl border border-black/10 p-6 bg-white">
          <h2 className="text-xl font-semibold">Cart</h2>
          {items.length === 0 ? (
            <p className="mt-2 text-zinc-600">Your cart is empty.</p>
          ) : (
            <>
              <ul className="mt-2 space-y-2">
                {items.map((it) => (
                  <li key={it.key} className="flex justify-between">
                    <span>
                      {it.title} × {it.qty}
                    </span>
                    <span>₹{(it.price * it.qty).toLocaleString('en-IN')}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-lg font-semibold">Total</div>
                <div className="text-lg font-semibold">₹{total.toLocaleString('en-IN')}</div>
              </div>
              <a href="/checkout" className="mt-4 inline-flex items-center rounded-full px-4 py-2 bg-black text-white">Go to checkout</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


