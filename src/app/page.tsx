import Hero from "@/components/Hero";
import CalendarSection from "@/components/CalendarSection";
import USPCarousel from "@/components/USPCarousel";
import Testimonials from "@/components/Testimonials";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
  return (
    <div className="min-h-screen" suppressHydrationWarning>
      <Hero />
      <div className="h-8 md:h-12" />
      <ClientOnly>
        <CalendarSection />
        <ServicesSection />
        <USPCarousel />
        <Testimonials />
        <ContactSection />
      </ClientOnly>
    </div>
  );
}
