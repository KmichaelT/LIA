import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CausesSection from "@/components/sections/CausesSection";
import BlogSection from "@/components/sections/EventsSection";
import DonateSection from "@/components/sections/DonateSection";
import {BibleVerse} from "@/components/bibleVerse";
import NewsletterSection from "@/components/sections/NewsletterSection";

async function getHomePageData() {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://best-desire-8443ae2768.strapiapp.com';
    const response = await fetch(`${STRAPI_URL}/api/home-page`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return null;
  }
}

export default async function Home() {
  const homePageData = await getHomePageData();
  
  return (
    <>
      <HeroSection 
        title={homePageData?.data?.HeroHeader}
        description={homePageData?.data?.HeroDescription}
      />
      <ServicesSection />
      <CausesSection />
      <BlogSection />
      <BibleVerse/>
    </>
  );
}
