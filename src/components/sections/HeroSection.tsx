"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, PlayIcon, MoveRight } from "lucide-react";
import { AspectRatio } from "@/components/aspect-ratio";
import { Button } from "@/components/button";
import { useState, useEffect } from "react";
import {Banner5} from "@/components/banner";
import { getHomePage, getImpactStats, getCTALinks } from "@/lib/strapi";
import { HomePage, StatData, LinkData } from "@/types/strapi";
import { STRAPI_URL } from "@/lib/utils";

interface HeroSectionProps {
  title?: string;
  description?: string;
}

export default function HeroSection({ title, description }: HeroSectionProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [heroData, setHeroData] = useState<HomePage | null>(null);
  const [stats, setStats] = useState<StatData[]>([]);
  const [ctaLinks, setCTALinks] = useState<LinkData[]>([]);

  // Fallback data
  const fallbackStats = [
    { id: 1, label: "Children Sponsored", value: 120, unit: "+", icon: "Users", category: "impact", description: "" },
    { id: 2, label: "Years On Mission", value: 4, unit: "+", icon: "Calendar", category: "impact", description: "" }
  ];

  const fallbackCTALinks = [
    { id: 1, label: "Donate Now", url: "https://www.zeffy.com/en-US/donation-form-v2/d7a24fa2-5425-4e72-b337-120c4f0b8c64", type: "cta", style: "primary", isExternal: true },
    { id: 2, label: "Watch Demo", url: "#video", type: "cta", style: "secondary", isExternal: false }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [homePageData, statsData] = await Promise.all([
          getHomePage(),
          getImpactStats()
        ]);
        
        if (homePageData) {
          setHeroData(homePageData);
          
          // Use homepage stats if available, otherwise fetch from stats API
          if (homePageData.heroStats && homePageData.heroStats.length > 0) {
            setStats(homePageData.heroStats.map((stat: {id: number, label: string, value: number, unit: string, icon: string, category: string, description?: string}) => ({
              id: stat.id,
              label: stat.label,
              value: stat.value,
              unit: stat.unit,
              icon: stat.icon,
              category: stat.category,
              description: stat.description || ""
            })));
          } else if (statsData && statsData.length > 0) {
            setStats(statsData.map((stat: {id: number, label: string, value: string | number, unit: string, icon: string, category: string, description?: string}) => ({
              id: stat.id,
              label: stat.label,
              value: typeof stat.value === 'string' ? (parseInt(stat.value) || 0) : stat.value,
              unit: stat.unit,
              icon: stat.icon,
              category: stat.category,
              description: stat.description || ""
            })));
          } else {
            setStats(fallbackStats);
          }
          
          // Use homepage buttons if available
          const buttons = [];
          if (homePageData.heroPrimaryButton) {
            buttons.push({
              id: homePageData.heroPrimaryButton.id,
              label: homePageData.heroPrimaryButton.label,
              url: homePageData.heroPrimaryButton.url,
              type: homePageData.heroPrimaryButton.type,
              style: homePageData.heroPrimaryButton.style,
              isExternal: homePageData.heroPrimaryButton.isExternal
            });
          }
          if (homePageData.heroSecondaryButton) {
            buttons.push({
              id: homePageData.heroSecondaryButton.id,
              label: homePageData.heroSecondaryButton.label,
              url: homePageData.heroSecondaryButton.url,
              type: homePageData.heroSecondaryButton.type,
              style: homePageData.heroSecondaryButton.style,
              isExternal: homePageData.heroSecondaryButton.isExternal
            });
          }
          
          if (buttons.length > 0) {
            setCTALinks(buttons);
          } else {
            setCTALinks(fallbackCTALinks);
          }
        } else {
          setStats(statsData?.length > 0 ? statsData.map((stat: {id: number, label: string, value: string | number, unit: string, icon: string, category: string, description?: string}) => ({
            id: stat.id,
            label: stat.label,
            value: typeof stat.value === 'string' ? (parseInt(stat.value) || 0) : stat.value,
            unit: stat.unit,
            icon: stat.icon,
            category: stat.category,
            description: stat.description || ""
          })) : fallbackStats);
          setCTALinks(fallbackCTALinks);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setStats(fallbackStats);
        setCTALinks(fallbackCTALinks);
      }
    }
    
    fetchData();
  }, []);

  const heroTitle = heroData?.heroTitle || title || "Changing lives one child at a time!";
  const heroDescription = heroData?.heroDescription || description || "Join us in supporting underprivileged children in Boreda, Ethiopia by providing education, financial support, and spiritual guidance.";
  const heroImageUrl = heroData?.heroBackgroundImage?.url 
    ? `${STRAPI_URL}${heroData.heroBackgroundImage.url}`
    : "/images/hero/hero-img.png";
  
  const donateLink = ctaLinks.find(link => link.label.toLowerCase().includes('donate')) || fallbackCTALinks[0];
  const watchLink = ctaLinks.find(link => link.label.toLowerCase().includes('watch')) || fallbackCTALinks[1];

  return (
    <>
    <Banner5 
      title="Don't Miss Out!"
      description="Join us for the 2nd Annual Christian Sports Tournament"
      buttonText="Buy Tickets"
      buttonUrl="https://www.zeffy.com/en-US/ticketing/2025-lia-5k-run"
    />
      <section className="bg-cover bg-center py-12 md:py-28">  
          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-8">
            <div className="mx-auto flex max-w-[43.75rem] flex-col gap-2 lg:mx-0">
              <div className="flex flex-col gap-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  {heroTitle}
                </h1>
              </div>
              <p className="text-muted-foreground text-base mb-4 max-w-xl">
                {heroDescription}
              </p>

              <div>
                <div className="w-fit lg:mx-0">
                  <div className="flex flex-wrap gap-4">
                    <Link href={donateLink.url} target={donateLink.isExternal ? "_blank" : "_self"}>
                      <Button className="group flex h-fit w-fit items-center gap-2 rounded-full px-8 py-3 bg-primary text-white">
                        <p className="text-sm/5 font-medium text-white">
                          {donateLink.label}
                        </p>
                        <div className="relative h-6 w-7 overflow-hidden">
                          <div className="absolute left-0 top-0 flex -translate-x-1/2 items-center transition-all duration-500 group-hover:translate-x-0">
                            <MoveRight className="!h-6 !w-6 fill-white px-1" />
                            <MoveRight className="!h-6 !w-6 fill-white px-1" />
                          </div>
                        </div>
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      onClick={() => setIsVideoOpen(true)}
                      className="flex w-fit items-center gap-3 hover:bg-transparent"
                    >
                      <div className="relative h-7 w-7 rounded-full p-[3px] before:absolute before:top-0 before:left-0 before:block before:h-full before:w-full before:animate-[spin_5s_ease-in-out_infinite] before:rounded-full before:bg-gradient-to-r before:from-primary before:to-transparent before:content-['']">
                        <div className="relative z-20 flex h-full w-full rounded-full bg-white">
                          <PlayIcon className="m-auto !h-3 !w-3 fill-primary stroke-primary" />
                        </div>
                      </div>
                      <p className="text-sm/5 font-medium text-primary">
                        {watchLink.label}
                      </p>
                    </Button>
                  </div>
                </div>
                <div
                  className="my-4 h-[1px] w-full bg-black"
                  style={{
                    background:
                      "linear-gradient(270deg, rgba(234, 232, 225, .2) 0%, rgba(17, 16, 17, .2) 50%, rgba(17, 16, 17, 0) 100%)",
                  }}
                />
                <div className="mt-4 flex items-center gap-16">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={stat.id || index}>
                      <h3 className="text-4xl font-bold mb-1">
                        {stat.value}{stat.unit}
                      </h3>
                      <p className="text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[31.25rem]">
              <div className="relative mx-auto w-full max-w-full lg:mx-0">
                <div className="w-full overflow-hidden rounded-3xl">
                  <AspectRatio ratio={1}>
                    <Image
                      src={heroImageUrl}
                      alt="Hero Image"
                      width={600}
                      height={800}
                      className="mx-auto rounded-xl shadow-lg"
                    />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
      </section>

      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white"
              onClick={() => setIsVideoOpen(false)}
            >
              Close
            </button>
            <div className="aspect-video rounded-lg overflow-hidden">
              <video
                width="100%"
                height="100%"
                controls
                autoPlay
                src="/video/lia_video.mp4"
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
