import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full">
      <div className="mx-auto max-w-[90%] px-4">
        <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl md:shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: promo panel with diagonal edge */}
            <div className="relative lg:col-span-7 bg-[#0a5bd3] text-white p-10 md:p-14 min-h-[520px] md:min-h-[640px] flex flex-col justify-center">
              <div
                className="hidden lg:block absolute inset-y-0 right-[-120px] w-[240px] bg-[#0a5bd3]"
                style={{ clipPath: "polygon(0 0, 100% 30%, 100% 70%, 0 100%)" }}
                aria-hidden
              />
              <p className="text-xs md:text-sm tracking-[0.25em] opacity-90">BANGALORE‑BUILT • AI‑POWERED • SMALL BUSINESS READY</p>
              <h1 className="mt-4 text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight">
                <span className="block leading-tight">Launch fast.</span>
                <span className="block mt-2 md:mt-3 leading-tight">Sell more.</span>
                <span className="block mt-2 md:mt-3 leading-tight">Automate growth.</span>
              </h1>
              <p className="mt-6 max-w-xl text-white/90 font-medium text-base md:text-lg leading-snug">
                End‑to‑end websites & apps, e‑commerce, and WhatsApp commerce — one partner, clear pricing, rapid turnaround.
              </p>
              <div className="mt-8">
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-full bg-white text-[#0a5bd3] px-6 py-3 font-semibold hover:opacity-90"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Right: visual panel */}
            <div className="relative lg:col-span-5 min-h-[520px] md:min-h-[640px]">
              <video
                src="/techmaadi.mp4"
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0a5bd3]/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

