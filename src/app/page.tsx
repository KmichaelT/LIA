import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CausesSection from "@/components/sections/CausesSection";
import BlogSection from "@/components/sections/EventsSection";
import DonateSection from "@/components/sections/DonateSection";
import {BibleVerse} from "@/components/bibleVerse";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      <ServicesSection />
      <CausesSection />
      <BlogSection />
      <BibleVerse/>

      <NewsletterSection />
    </>
  );
}
