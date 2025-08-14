'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import { Gallery4 } from '../gallery4';
import { getFeaturedCauses } from '@/lib/strapi';
import { CauseData } from '@/types/strapi';
import { getStrapiImageUrl } from '@/lib/utils';

// Map cause titles to existing image files
function getCauseFallbackImage(title: string): string {
  const imageMap: { [key: string]: string } = {
    'Electricity and Water Installation': '/images/causes/electricityInstallation.webp',
    'Education and Mentorship': '/images/causes/education.webp',
    'Feeding Program': '/images/causes/feeding.webp',
    'Building a Children and Youth Center': '/images/causes/youth_center.webp',
    'Cloth Donation Program': '/images/causes/cloth_donation.webp'
  };
  
  return imageMap[title] || '/images/causes/default.webp';
}

// Define the CauseCardProps interface
interface CauseCardProps {
  image: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  progress: number;
}

interface CausesSectionProps {
  sectionData?: {
    sectionTitle?: string;
    sectionHeader?: string;
    sectionDescription?: string;
    layoutType?: string;
    maxItems?: number;
  };
}

export default function CausesSection({ sectionData }: CausesSectionProps = {}) {
  const [causes, setCauses] = useState<CauseData[]>([]);

  // Fallback data
  const fallbackCauses = useMemo(() => [
    {
      id: 1,
      title: "Electricity and Water Installation",
      description: "Enhances quality of life by improving access to clean water, lighting, and technology, which support health and education.",
      image: "/images/causes/electricityInstallation.webp",
      href: "/causes/electricity-water",
      progress: 65,
      amountRaised: 65000,
      raisedAmount: 65000,
      goalAmount: 100000,
      category: "Infrastructure",
      causeStatus: "active" as const,
      featured: true,
      createdAt: "Dec 18, 2024",
      goal: "Install electric and water lines to provide essential infrastructure for schools and households."
    },
    {
      id: 2,
      title: "Education and Mentorship",
      description: "Equips children with the tools and guidance they need to achieve their dreams and break the cycle of poverty.",
      image: "/images/causes/education.webp",
      href: "/causes/education-mentorship",
      progress: 80,
      amountRaised: 80000,
      raisedAmount: 80000,
      goalAmount: 100000,
      category: "Education",
      causeStatus: "active" as const,
      featured: true,
      createdAt: "Dec 18, 2024",
      goal: "Offer tutoring, mentoring programs, and school supplies to enhance academic and personal success."
    },
    {
      id: 3,
      title: "Feeding Program",
      description: "Ensures children remain healthy, energized, and focused on their education.",
      image: "/images/causes/feeding.webp",
      href: "/causes/feeding-program",
      progress: 75,
      amountRaised: 75000,
      raisedAmount: 75000,
      goalAmount: 100000,
      category: "Nutrition",
      causeStatus: "active" as const,
      featured: true,
      createdAt: "Dec 18, 2024",
      goal: "Provide nutritious meals to combat malnutrition and support children's physical and mental growth."
    },
    {
      id: 4,
      title: "Building a Children and Youth Center",
      description: "Empowers youth by offering opportunities for learning, mentorship, and recreation.",
      image: "/images/causes/youth_center.webp",
      href: "/causes/youth-center",
      progress: 40,
      amountRaised: 40000,
      raisedAmount: 40000,
      goalAmount: 100000,
      category: "Infrastructure",
      causeStatus: "active" as const,
      featured: true,
      createdAt: "Dec 18, 2024",
      goal: "Establish a safe and enriching space equipped with a library, classrooms, and sports facilities to foster education and talents."
    },
    {
      id: 5,
      title: "Cloth Donation Program",
      description: "By donating clothing to children in Ethiopia, we create a lasting impact by improving their well-being, boosting self-confidence, and fostering opportunities for a brighter future.",
      image: "/images/causes/cloth_donation.webp",
      href: "/causes/clothing-donation",
      progress: 55,
      amountRaised: 55000,
      raisedAmount: 55000,
      goalAmount: 100000,
      category: "Other",
      causeStatus: "active" as const,
      featured: true,
      createdAt: "Dec 20, 2024",
      goal: "To provide children in Southern Ethiopia with essential clothing, ensuring comfort, dignity, and improved quality of life while supporting their educational and social development."
    }
  ], []);

  useEffect(() => {
    async function fetchCauses() {
      try {
        const limit = sectionData?.maxItems || 5;
        const causesData = await getFeaturedCauses();
        if (causesData && causesData.length > 0) {
          const transformedCauses = causesData.map((cause: {id: number, title: string, description: string, raisedAmount: number, goalAmount: number, image?: {url: string}, category: string, createdAt: string}) => {
            const progress = Math.min(Math.round((cause.raisedAmount / cause.goalAmount) * 100), 100);
            return {
              id: cause.id,
              title: cause.title,
              description: cause.description,
              image: cause.image?.url 
                ? getStrapiImageUrl(cause.image.url)
                : getCauseFallbackImage(cause.title),
              href: `/causes/${cause.title.toLowerCase().replace(/\s+/g, '-')}`,
              progress,
              amountRaised: cause.raisedAmount,
              goalAmount: cause.goalAmount,
              category: cause.category,
              createdAt: new Date(cause.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              goal: cause.description
            };
          });
          setCauses(transformedCauses.slice(0, limit));
        } else {
          setCauses(fallbackCauses.slice(0, limit));
        }
      } catch (error) {
        console.error('Error fetching causes:', error);
        const limit = sectionData?.maxItems || 5;
        setCauses(fallbackCauses.slice(0, limit));
      }
    }

    fetchCauses();
  }, [sectionData?.maxItems, fallbackCauses]);

  return (
    <> 
      <section className="py-2 bg-slate-50 relative overflow-hidden">
        <Gallery4 
          title={sectionData?.sectionHeader || "Small gifts can have a big influence."}
          description={sectionData?.sectionDescription || "Even modest contributions can lead to substantial and meaningful societal change."}
          items={causes}
        />
      </section>
    </>

  );
}
