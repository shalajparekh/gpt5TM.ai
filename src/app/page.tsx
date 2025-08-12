import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import USPCarousel from "@/components/USPCarousel";
import CalendarSection from "@/components/CalendarSection";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="h-8 md:h-12" />
      <CalendarSection />
      <ServicesSection />
      <USPCarousel />
      <Testimonials />
      <ContactSection />
    </div>
  );
}
