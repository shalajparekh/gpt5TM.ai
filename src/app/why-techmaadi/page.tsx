import USPCarousel from "@/components/USPCarousel";

export default function WhyTechMaadiPage() {
  return (
    <div className="min-h-screen">
      <section className="w-full pt-16 pb-8">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Why TechMaadi</h1>
          <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
            Bangalore‑built. AI‑powered. SMB‑ready. A single partner to launch fast, sell more, and automate growth across web, e‑commerce, WhatsApp, and performance marketing.
          </p>
        </div>
      </section>
      <USPCarousel />
      <section className="w-full py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-semibold">How we work</h2>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>Discovery and goals alignment (30–45 mins)</li>
            <li>Package recommendation with transparent pricing</li>
            <li>Rapid launch using AI‑accelerated templates</li>
            <li>Weekly reporting and ROI‑focused optimizations</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

