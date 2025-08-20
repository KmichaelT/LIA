"use client";
import { About1 } from "@/components/about1";
import { useState, useEffect } from "react";
import { getAboutUs } from "@/lib/strapi";
import { STRAPI_URL, getStrapiImageUrl } from "@/lib/utils";
import { Teams } from "@/components/Teams";
import TimelineSection from "@/components/TimelineSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TeamMembershipForm from "@/components/TeamMembershipForm";
import Link from "next/link";

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
    description: "Follow our journey from founding to present day impact in supporting children in Boreda, Ethiopia.",
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
  },
  teamMember: null as {header: string; description: string; image: string} | null // No default team member, will only show if CMS data is available
};

export default function About() {
  const [content, setContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const aboutData = await getAboutUs();
        
        // Debug logging for production issue
        console.log('About data received:', {
          hasTeamMembers: !!aboutData?.teamMembers,
          teamMembersType: typeof aboutData?.teamMembers,
          teamMembersValue: aboutData?.teamMembers
        });
        
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
              description: aboutData.timelineDescription || fallbackContent.timeline.description,
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
            },
            // Show team member section if we have header or description, even without image
            teamMember: (aboutData.teamMembersHeader || aboutData.teamMembersDescription || aboutData.teamMembers) ? {
              header: aboutData.teamMembersHeader || "Our Team",
              description: aboutData.teamMembersDescription || "Meet the dedicated individuals behind our mission to support children in Boreda, Ethiopia.",
              image: aboutData.teamMembers?.url ? getStrapiImageUrl(aboutData.teamMembers.url) : "/images/team.jpg"
            } : null
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

  // Create a modified content object without timeline and joinTeam for About1
  const aboutContentWithoutExtras = {
    hero: content.hero,
    image: content.image,
    missionContent: content.missionContent
  };

  return (
    <>
      <About1 content={aboutContentWithoutExtras} />
      
      <TimelineSection
        title={content.timeline.title}
        description={content.timeline.description}
        phases={content.timeline.phases}
        currentPhase={content.timeline.currentPhase}
      />
      
      {content.teamMember && (
        <Teams 
          teamMember={content.teamMember}
          sectionTitle="Our Team"
          sectionDescription="Meet the dedicated individuals behind our mission to support children in Boreda, Ethiopia."
        />
      )}
      
      {/* Join Mission Section */}
      <section className="bg-background py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold lg:text-4xl mb-2.5">
                {content.joinTeam.title}
              </h2>
            </div>
            <div>
              <p className="text-muted-foreground text-lg">
                {content.joinTeam.description}
              </p>
              <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row">
                <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">Join the team</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto">
                    <TeamMembershipForm 
                      onSuccess={() => {
                        setTimeout(() => setIsTeamDialogOpen(false), 2000);
                      }}
                      onClose={() => setIsTeamDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <Link href="/sponsor-a-child">
                  <Button variant="outline" className="w-full sm:w-auto">
                    become a sponsor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
      </section>
    </>
  );
}
