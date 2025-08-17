'use client';

import { useEffect, useState } from 'react';
import { CausesGallery } from '../CausesGallery';
import { CauseData } from '@/types/strapi';
import { getStrapiImageUrl } from '@/lib/utils';


interface CausesSectionProps {
  sectionTitle?: string;
  sectionHeader?: string;
  sectionDescription?: string;
  causes: Array<{
    id: number;
    title: string;
    description: string;
    goalAmount: number;
    raisedAmount: number;
    category: string;
    causeStatus?: string;
    featured?: boolean;
    createdAt: string;
    image?: {
      url: string;
      alternativeText?: string;
    };
    link?: {
      url: string;
      label: string;
      type: string;
    };
  }>;
}

export default function CausesSection({ 
  sectionTitle, 
  sectionHeader, 
  sectionDescription, 
  causes: rawCauses 
}: CausesSectionProps) {
  const [causes, setCauses] = useState<CauseData[]>([]);

  useEffect(() => {
    // Transform the causes data
    const transformedCauses = rawCauses.map((cause) => {
      const progress = Math.min(Math.round((cause.raisedAmount / cause.goalAmount) * 100), 100);
      return {
        id: cause.id,
        title: cause.title,
        description: cause.description,
        image: cause.image?.url 
          ? getStrapiImageUrl(cause.image.url)
          : '/images/causes/default.webp',
        href: `/causes/${cause.title.toLowerCase().replace(/\s+/g, '-')}`,
        progress,
        amountRaised: cause.raisedAmount,
        raisedAmount: cause.raisedAmount,
        goalAmount: cause.goalAmount,
        category: cause.category,
        causeStatus: cause.causeStatus || 'active',
        featured: cause.featured || true,
        createdAt: new Date(cause.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        goal: cause.description,
        donationLink: cause.link ? {
          url: cause.link.url,
          label: cause.link.label,
          type: cause.link.type,
          isPopup: true // Default to popup for Zeffy links
        } : undefined
      };
    });
    setCauses(transformedCauses);
  }, [rawCauses]);

  // If no causes, don't render section
  if (!causes || causes.length === 0) {
    return null;
  }

  return (
    <> 
      <section className="py-2 bg-slate-50 relative overflow-hidden">
        <CausesGallery 
          sectionTitle={sectionTitle}
          title={sectionHeader}
          description={sectionDescription}
          items={causes}
        />
      </section>
    </>
  );
}
