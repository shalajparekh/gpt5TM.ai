"use client";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    // Minimal type to satisfy TS without pulling external types
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

  async function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startPayment() {
    setBusy(true);
    setError(null);
    try {
      if (total <= 0) throw new Error("Cart is empty");
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay");

      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order?.error || "Order create failed");

      const options: Record<string, unknown> = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "TechMaadi",
        description: "Service purchase",
        order_id: order.id,
        handler: function () {
          clear();
          alert("Payment successful! We will contact you soon.");
        },
        prefill: {},
        notes: {},
        theme: { color: "#10B981" },
      };
      const rzp = new window.Razorpay!(options);
      rzp.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    // no-op; could hydrate from server later
  }, []);

  return (
    <div className="min-h-screen w-full py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <div className="mt-6 rounded-2xl border border-black/10 dark:border-white/10 p-6">
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.key} className="flex justify-between">
                    <span>
                      {it.title} × {it.qty}
                    </span>
                    <span>₹{(it.price * it.qty).toLocaleString("en-IN")}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-lg font-semibold">Total</div>
                <div className="text-lg font-semibold">₹{total.toLocaleString("en-IN")}</div>
              </div>
              <button onClick={startPayment} disabled={busy} className="mt-4 inline-flex items-center rounded-full px-4 py-2 bg-emerald-600 text-white">
                {busy ? "Processing..." : "Pay with Razorpay"}
              </button>
              {error && <div className="mt-2 text-red-600">{error}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


