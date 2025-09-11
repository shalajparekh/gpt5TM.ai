"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  { name: "Nehal", role: "Cafe Owner, Indiranagar", company: "4th Wave Coffee", text: "Nesh Tech launched our website in just a few days. Online orders are already up by 34%! Their support is outstanding, led personally by the owner. We highly recommend them to any business going online.", img: "/images/1.png" },
  { name: "Sharvil M.", role: "Boutique, Koramangala", company: "The Homegrown", text: "Setting up a WhatsApp catalog with UPI payments made our sales process seamless and hassle-free. Customers love the simplicity.WhatsApp catalog + UPI payments made sales effortless.", img: "/images/2.png" },
  { name: "Nirosha R.", role: "Fitness Studio, HSR", company: "Goldy's Gym", text: "Nesh Tech Ads and SEO campaigns delivered consistent leads, and the clear weekly reports kept us confident in the results.", img: "/images/3.png" },
  { name: "Ravindra R.", role: "Bakery, Jayanagar", company: "Saloni's Bakery", text: "Cart recovery emails helped us recover 18% of lost revenue. Nesh Tech made the entire process seamless and automated.", img: "/images/4.png" },
  { name: "Aashu P.", role: "Electronics, Rajajinagar", company: "Parekh Sales", text: "Inventory sync across our website and WhatsApp store is seamless, thanks to Nesh Tech. Managing stock is finally stress-free, and customers always see the right availability.", img: "/images/5.png" },
  { name: "Royal Gujarat.", role: "Salon, Whitefield", company: "Honey Combs", text: "Booking automation by Nesh Tech saved us hours every week. Their smart workflows keep our team focused on serving customers, not manual tasks.", img: "/images/6.png" },
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
            <h2 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight">Trusted by over 150+<br/>Satisfied Clients</h2>
          </div>
          <div className="md:text-right">
            <p className="text-zinc-600 dark:text-zinc-300 max-w-md">Nesh Tech helps Indian businesses grow sales with AI‑powered websites, WhatsApp commerce and SEO.</p>
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
                <Image src={t.img} alt={t.name} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 60vw, 85vw" className="object-cover" />
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


