import Image from "next/image";
import SalonCalendarDemo from "./SalonCalendarDemo";
export const metadata = {
  title: "Salon, Spa & Wellness Demo — Nesh Tech Inc.",
  description:
    "A static demo landing page for Salons, Spas and Wellness Centers inspired by leading Indian salon sites.",
};

// Maps config — use Google Static Maps if a key is available; otherwise fall back to OpenStreetMap static.
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
};

function getGoogleStaticMapUrl(city: string): string | null {
  if (!GOOGLE_MAPS_KEY) return null;
  const coords = CITY_COORDS[city];
  const center = coords ? `${coords.lat},${coords.lng}` : encodeURIComponent(city);
  // Use 640x320 with scale=2 to stay within free tier limits while rendering crisp images.
  const params = new URLSearchParams({
    center,
    zoom: "11",
    size: "640x320",
    scale: "2",
    maptype: "roadmap",
    markers: `color:red|${center}`,
    key: GOOGLE_MAPS_KEY,
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

function getOsmStaticMapUrl(city: string): string {
  const coords = CITY_COORDS[city];
  const center = coords ? `${coords.lat},${coords.lng}` : encodeURIComponent(city);
  const params = new URLSearchParams({ center, zoom: "11", size: "640x320", markers: `${center},red` });
  return `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`;
}

function getMapUrl(city: string): string {
  return getGoogleStaticMapUrl(city) || getOsmStaticMapUrl(city);
}

export default function SalonDemoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-50 to-white" />
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div>
              <p className="text-sm tracking-widest text-rose-500">
                Demo • Salons · Spas · Wellness
              </p>
              <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight">
                Welcome to Your Modern Salon Experience
              </h1>
              <p className="mt-4 text-zinc-700 md:text-lg">
                Classic beauty with a modern touch. Showcase services, sell products, run offers, collect
                appointments and franchise enquiries — all in one page.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#menu" className="rounded-full px-5 py-2.5 bg-black text-white">
                  View Salon Menu
                </a>
                <a href="#book" className="rounded-full px-5 py-2.5 border border-black/10">Book Appointment</a>
              </div>
            </div>
            <div className="relative h-[360px] md:h-[540px] rounded-3xl overflow-hidden shadow-xl">
              <video
                src="/Salon.mp4"
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shop / Collections */}
      <section className="w-full py-16 bg-zinc-50" id="shop">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Nails", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80" },
              { title: "Skincare", img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1200&q=60" },
              { title: "Haircare", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=60" },
            ].map((c) => (
              <article key={c.title} className="relative rounded-3xl overflow-hidden shadow-lg">
                <Image src={c.img} alt={c.title} width={1200} height={512} className="h-64 w-full object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-4 text-white text-xl font-semibold">{c.title}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar (Demo) */}
      <SalonCalendarDemo />

      {/* Indulge / About */}
      <section className="w-full py-16" id="about">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Indulge in the Extraordinary</h2>
            <p className="mt-3 text-zinc-700 md:text-lg">
              This demo mirrors the structure of leading Indian salon experiences — hero banner, shop
              highlights, services, gallery, testimonials and locations — adapted for fast, mobile‑first
              conversions. Inspired by patterns seen on salon sites like Juice Salons.
            </p>
            <a href="#book" className="mt-6 inline-flex rounded-full px-5 py-2.5 bg-rose-500 text-white">Book Now</a>
          </div>
          <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=80"
              alt="Spa indulgence"
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="w-full py-16 bg-zinc-50" id="menu">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="text-3xl font-bold tracking-tight">Your Palace of Beauty</h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Hair",
                desc: "Tailor‑made cuts and colours for every face.",
                img: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=900&q=70",
                icon: "💇‍♀️",
              },
              {
                title: "Cosmetology",
                desc: "Advanced skin treatments customised for you.",
                img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=900&q=70",
                icon: "✨",
              },
              {
                title: "Make‑Up",
                desc: "Step into the spotlight with studio‑grade looks.",
                img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=70",
                icon: "💄",
              },
              {
                title: "Nails",
                desc: "From classics to art — your nail goals, delivered.",
                img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=70",
                icon: "💅",
              },
            ].map((s) => (
              <article
                key={s.title}
                className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="relative h-32">
                  <Image src={s.img} alt={s.title} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <span className="text-rose-500" aria-hidden>
                      {s.icon}
                    </span>
                    {s.title}
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">{s.desc}</p>
                  <a
                    href="#book"
                    className="mt-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-rose-500 text-white shadow-sm group-hover:shadow-md group-hover:scale-[1.02] transition"
                  >
                    Book an Appointment
                    <span className="ml-2">→</span>
                  </a>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-rose-500/0 group-hover:ring-2 group-hover:ring-rose-500/30 transition" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="w-full py-16" id="gallery">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="text-3xl font-bold tracking-tight">Our Gallery</h3>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80", alt: "Spa towels and flowers" },
              { src: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=1200&q=80", alt: "Stylist blow drying hair" },
              { src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80", alt: "Nail art manicure" },
              { src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80", alt: "Professional makeup tools" },
              { src: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80", alt: "Salon interior with chair" },
              { src: "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=1200&q=80", alt: "Hair coloring palette" },
              { src: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80", alt: "Spa stones and candle" },
              { src: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1200&q=80", alt: "Skincare treatment" },
            ].map((item, i) => (
              <div key={i} className="relative h-40 md:h-52 rounded-xl overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="w-full py-16 bg-zinc-50" id="locations">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="text-3xl font-bold tracking-tight">Our Locations</h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-5">
            {["Mumbai", "Hyderabad", "Kolkata", "Pune"].map((city) => (
              <article key={city} className="group relative rounded-3xl overflow-hidden border border-black/10 bg-white shadow-lg hover:shadow-2xl transition-shadow w-[70%] mx-auto">
                <div className="relative aspect-square">
                  <Image src={getMapUrl(city)} alt={city} fill sizes="(min-width:768px) 50vw, 70vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between text-white">
                    <div className="font-medium">{city}</div>
                    <a href="#book" className="text-sm underline">Book Now</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="w-full py-16" id="book">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-3xl border border-black/10 p-8 md:p-12 text-center bg-white shadow-xl">
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to pamper yourself?</h3>
            <p className="mt-3 text-zinc-700 md:text-lg">Schedule your visit in under a minute.</p>
            <a href="#calendar" className="mt-6 inline-flex rounded-full px-6 py-3 bg-black text-white">Book Appointment</a>
          </div>
        </div>
      </section>
    </div>
  );
}


