"use client";
import { useRef } from "react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Rohan S.", role: "Cafe Owner, Indiranagar", company: "ATLASIAN", text: "TechMaadi launched our site in days. Online orders up 34%.", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&auto=format&fit=crop&w=900&h=900" },
  { name: "Priya K.", role: "Boutique, Koramangala", company: "ATLASIAN", text: "WhatsApp catalog + UPI payments made sales effortless.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&auto=format&fit=crop&w=900&h=900" },
  { name: "Arjun M.", role: "Fitness Studio, HSR", company: "ATLASIAN", text: "Ads + SEO brought steady leads. Clear weekly reports.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&auto=format&fit=crop&w=900&h=900" },
  { name: "Neha T.", role: "Bakery, Jayanagar", company: "ATLASIAN", text: "Cart recovery emails recovered 18% revenue.", img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&auto=format&fit=crop&w=900&h=900" },
  { name: "Vijay R.", role: "Electronics, Rajajinagar", company: "ATLASIAN", text: "Inventory sync across website and WhatsApp store is seamless.", img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&auto=format&fit=crop&w=900&h=900" },
  { name: "Ananya D.", role: "Salon, Whitefield", company: "ATLASIAN", text: "Booking automation saved us hours weekly.", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&auto=format&fit=crop&w=900&h=900" },
];

export default function Testimonials() {
  const scroller = useRef<HTMLDivElement | null>(null);
  const move = (dir: number) => {
    const el = scroller.current; if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="w-full py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-sm text-zinc-500">Testimonials</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight">Trusted by over 15k+<br/>Satisfied Clients</h2>
          </div>
          <div className="md:text-right">
            <p className="text-zinc-600 dark:text-zinc-300 max-w-md">TechMaadi.ai helps Indian businesses grow sales with AI‑powered websites, WhatsApp commerce and performance marketing.</p>
            <a href="#contact" className="mt-3 inline-flex items-center rounded-full px-5 py-2.5 bg-purple-600 text-white font-medium">Get Started Now</a>
          </div>
        </div>

        <div className="relative mt-8">
          <div ref={scroller} className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
            {testimonials.map((t, i) => (
              <motion.article
                key={i}
                className="relative snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[32%] aspect-[3/4] rounded-3xl overflow-hidden shadow-xl"
                whileHover={{ y: -4 }}
              >
                <img src={t.img} alt={t.name} className="absolute inset-0 h-full w-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-sm opacity-90">“{t.text}”</p>
                  <div className="mt-4 flex items-center justify-between text-xs opacity-90">
                    <span className="font-semibold">{t.company}</span>
                    <span>
                      <span className="font-medium">{t.name}</span>
                      <span className="opacity-80"> · {t.role}</span>
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <button onClick={() => move(-1)} className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow">‹</button>
          <button onClick={() => move(1)} className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow">›</button>
        </div>
      </div>
    </section>
  );
}


