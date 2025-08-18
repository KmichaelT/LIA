import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CausesSection from "@/components/sections/CausesSection";
import EventsSection from "@/components/sections/EventsSection";
import { Gallery4 } from "@/components/gallery4";
import { getHomePage } from "@/lib/strapi";

export default async function Home() {
  const homePageData = await getHomePage();
  
  // If no homepage data, show nothing (no fallbacks)
  if (!homePageData) {
    return null;
  }
  
  return (
    <>
      {/* Hero Section - always render if data exists */}
      <HeroSection 
        title={homePageData.heroTitle}
        description={homePageData.heroDescription}
        backgroundImage={homePageData.heroBackgroundImage}
        primaryButton={homePageData.donateNowButton}
        secondaryButton={homePageData.watchVideoButton}
        stats={homePageData.heroStats}
      />
      
      {/* Services Section - only render if services exist */}
      {homePageData.services && homePageData.services.length > 0 && (
        <ServicesSection 
          sectionTitle={homePageData.servicesTitle}
          sectionHeader={homePageData.servicesHeader}
          sectionDescription={homePageData.servicesDescription}
          services={homePageData.services}
        />
      )}
      
      {/* Events Section - only render if events exist */}
      {homePageData.events && homePageData.events.length > 0 && (
        <EventsSection 
          sectionTitle={homePageData.eventsTitle}
          sectionHeader={homePageData.eventsHeader}
          sectionDescription={homePageData.eventsDescription}
          events={homePageData.events}
        />
      )}
      
      {/* Causes Section - only render if causes exist */}
      {homePageData.causes && homePageData.causes.length > 0 && (
        <CausesSection 
          sectionTitle={homePageData.causesTitle}
          sectionHeader={homePageData.causesHeader}
          sectionDescription={homePageData.causesDescription}
          causes={homePageData.causes}
        />
      )}
 
    </>
  );
}