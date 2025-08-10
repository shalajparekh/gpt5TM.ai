export default function CTASection() {
  return (
    <section className="relative w-full py-20" id="contact">
      <div className="absolute inset-0 -z-10 bg-radial" />
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold">Book a 20‑min discovery call</h3>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          Get a tailored plan for your business with timelines, pricing, and expected ROI.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-emerald-600 text-white hover:opacity-90 transition"
          >
            Get a proposal
          </a>
          <a
            href="/why-techmaadi"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-white/5 transition"
          >
            Why TechMaadi →
          </a>
        </div>
      </div>
    </section>
  );
}

