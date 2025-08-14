import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CausesSection from "@/components/sections/CausesSection";
import BlogSection from "@/components/sections/EventsSection";
import DonateSection from "@/components/sections/DonateSection";
import {BibleVerse} from "@/components/bibleVerse";
import NewsletterSection from "@/components/sections/NewsletterSection";
import { getHomePage } from "@/lib/strapi";
import StatsSection from "@/components/sections/StatsSection";

// Component mapping for CMS sections
const sectionComponents = {
  'viewers.event-viewer': BlogSection,
  'viewers.cause-viewer': CausesSection, 
  'viewers.service-viewer': ServicesSection,
  'viewers.stats-viewer': StatsSection,
  'content.newsletter-section': NewsletterSection,
  'content.bible-verse': BibleVerse
};

export default async function Home() {
  const homePageData = await getHomePage();
  
  return (
    <>
      <HeroSection 
        title={homePageData?.heroTitle}
        description={homePageData?.heroDescription}
      />
      
      
      {/* Render CMS sections dynamically */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {homePageData?.sections?.map((section: any, index: number) => {
        const SectionComponent = sectionComponents[section.__component as keyof typeof sectionComponents];
        
        if (SectionComponent) {
          return (
            <SectionComponent 
              key={`${section.__component}-${index}`}
              sectionData={section}
            />
          );
        }
        
        return null;
      })}
      
      {/* Fallback sections if no CMS sections */}
      {(!homePageData?.sections || homePageData.sections.length === 0) && (
        <>
          <ServicesSection />
          <CausesSection />
          <BlogSection />
          <BibleVerse/>
        </>
      )}
    </>
  );
}
