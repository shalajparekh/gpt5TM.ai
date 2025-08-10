type Service = {
  title: string;
  description: string;
  bullets: string[];
};

const services: Service[] = [
  {
    title: "Websites & Apps",
    description:
      "Custom, mobile-first sites and apps with hosting, SSL, and conversion-focused UX.",
    bullets: [
      "AI chatbot integration for lead capture and support",
      "Fast load, SEO-ready, analytics built-in",
      "Hosting and performance monitoring included",
    ],
  },
  {
    title: "E-commerce Enablement",
    description:
      "Shopify/WooCommerce setup, migration, and optimization with UPI-ready checkout.",
    bullets: [
      "Payments: Razorpay, Stripe, Paytm",
      "Social commerce, inventory sync, coupons",
      "Order tracking and store automation",
    ],
  },
  {
    title: "WhatsApp API Integration",
    description:
      "WhatsApp Store and Cart with 1-click checkout and automated follow-ups.",
    bullets: [
      "Payments via Razorpay/Stripe/Paytm inside WhatsApp",
      "Shopify/WooCommerce sync",
      "Abandoned cart nudges and Instagram Shop links",
    ],
  },
  {
    title: "PPC, SEO & Performance Marketing",
    description:
      "ROI-driven ads on Google and Meta with full-funnel analytics and reporting.",
    bullets: [
      "Keyword and creative testing",
      "On-page, technical, and local SEO",
      "Clear dashboards and actionables",
    ],
  },
  {
    title: "Email Marketing & Automation",
    description:
      "Automated flows that convert first-time buyers into repeat customers.",
    bullets: [
      "Welcome, cart recovery, re-engagement, post-purchase",
      "Segmented newsletters and drip sequences",
      "Deliverability best practices",
    ],
  },
  {
    title: "Branding & Design",
    description:
      "Logos, brand kits, templates, and sales collateral for a consistent identity.",
    bullets: ["Web, social, and ad creatives", "Template systems for speed"],
  },
  {
    title: "Video Scripts & Storyboarding",
    description:
      "High-conversion reels, shorts, and ads using storytelling + AI.",
    bullets: [
      "Outputs for Instagram, Facebook, YouTube",
      "Hook-first formats and clear CTAs",
    ],
  },
  {
    title: "Add-Ons",
    description:
      "WhatsApp notifications, Instagram Shop setup, product shoots, and more.",
    bullets: [
      "Coupon engines and abandoned-cart emails",
      "Product photoshoots and video editing",
    ],
  },
];

export default function ServicesGrid() {
  return (
    <section className="w-full py-20" id="services">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Services</h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300 text-base md:text-lg">
          Build, sell, and automate with productized packages tailored for Indian SMBs.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {service.description}
              </p>
              <ul className="mt-4 space-y-1 text-sm list-disc pl-5">
                {service.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

