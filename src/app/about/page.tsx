"use client";
import { About1 } from "@/components/about1";
import { useState, useEffect } from "react";
import { getAboutUs } from "@/lib/strapi";
import { STRAPI_URL, getStrapiImageUrl } from "@/lib/utils";

// Fallback data
const fallbackContent = {
  hero: {
    title: "Love in Action",
    description: "Love in Action is a nonprofit founded in 2019 by eight dedicated individuals committed to supporting underprivileged children in Boreda, Ethiopia. We provide holistic support through financial assistance, tutoring, and spiritual guidance."
  },
  image: "../images/about.jpg",
  missionContent: [
    {
      title: "OUR MISSION",
      content: "To express the love of Christ by providing holistic support—financial assistance, tutoring, and spiritual guidance—that empowers children in Boreda to stay in school, excel academically, and build brighter futures."
    },
    {
      title: "OUR VISION", 
      content: "To see an empowered community where children have reached their full potential, equipped with education, faith, and opportunity to transform their families and communities."
    },
    {
      title: "OUR VALUES",
      content: "Commitment, Excellence, Holistic Approach, Integrity, Love. We believe in transformational love that bridges the gap between poverty and possibility through Christ-centered service."
    }
  ],
  timeline: {
    title: "Our Journey",
    currentPhase: 3,
    phases: [
      {
        id: 0,
        date: "2019",
        title: "Foundation",
        description: "Eight dedicated individuals come together to establish Love in Action, driven by a vision to support underprivileged children in Boreda, Ethiopia."
      },
      {
        id: 1,
        date: "2020-2021",
        title: "First Children Sponsored",
        description: "We began our mission by sponsoring our first children in Boreda, providing financial assistance for education and basic needs during challenging times."
      },
      {
        id: 2,
        date: "2022-2023",
        title: "Program Expansion",
        description: "Launched comprehensive tutoring programs and expanded community outreach, deepening our holistic approach to child development and spiritual guidance."
      },
      {
        id: 3,
        date: "2024-Present",
        title: "Growing Impact",
        description: "Continuing to grow our impact through sustainable programs, building lasting relationships with families, and empowering children to break cycles of poverty."
      }
    ]
  },
  joinTeam: {
    title: "Join Our Mission",
    description: "Partner with us in transforming lives through education and love. Whether through sponsorship, volunteering, or prayer, you can help us build brighter futures for children in Boreda, Ethiopia."
  }
};

export default function About() {
  const [content, setContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const aboutData = await getAboutUs();
        
        if (aboutData) {
          const cmsContent = {
            hero: {
              title: aboutData.heroTitle || fallbackContent.hero.title,
              description: aboutData.heroDescription || fallbackContent.hero.description
            },
            image: aboutData.heroImage?.url 
              ? getStrapiImageUrl(aboutData.heroImage.url)
              : fallbackContent.image,
            missionContent: [
              {
                title: aboutData.missionTitle || "OUR MISSION",
                content: aboutData.missionDescription || fallbackContent.missionContent[0].content
              },
              {
                title: aboutData.visionTitle || "OUR VISION", 
                content: aboutData.visionDescription || fallbackContent.missionContent[1].content
              },
              {
                title: aboutData.valuesTitle || "OUR VALUES",
                content: aboutData.valuesDescription || fallbackContent.missionContent[2].content
              }
            ],
            timeline: {
              title: aboutData.timelineTitle || "Our Journey",
              currentPhase: aboutData.timelineItems?.length > 0 
                ? (aboutData.currentPhase > 0 && aboutData.currentPhase <= aboutData.timelineItems.length 
                   ? aboutData.currentPhase 
                   : aboutData.timelineItems.length) 
                : fallbackContent.timeline.currentPhase,
              phases: aboutData.timelineItems?.length > 0 
                ? aboutData.timelineItems.slice(0, 4).map((item: {startYear: string, endYear?: string, title: string, description: string}, index: number) => ({
                    id: index,
                    date: item.endYear ? `${item.startYear}-${item.endYear}` : item.startYear || `Phase ${index + 1}`,
                    title: item.title || `Timeline Item ${index + 1}`,
                    description: item.description || "No description available"
                  }))
                : fallbackContent.timeline.phases
            },
            joinTeam: {
              title: aboutData.joinMissionTitle || "Join Our Mission",
              description: aboutData.joinMissionDescription || fallbackContent.joinTeam.description
            }
          };
          
          setContent(cmsContent);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading about page...</p>
        </div>
      </div>
    );
  }

  return <About1 content={content} />;
}
