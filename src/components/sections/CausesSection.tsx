'use client';

import { useEffect, useState } from 'react';
import { CausesGallery } from '../CausesGallery';
import { CausesGalleryItem } from '../CausesGallery';
import { getStrapiImageUrl } from '@/lib/utils';


interface CausesSectionProps {
  sectionTitle?: string;
  sectionHeader?: string;
  sectionDescription?: string;
  causes: Array<{
    id: number;
    title: string;
    description: string;
    image?: {
      url: string;
      alternativeText?: string;
    };
    link?: {
      url: string;
      label: string;
      type: string;
      isExternal?: boolean;
      opensInPopup?: boolean;
    };
  }>;
}

export default function CausesSection({ 
  sectionTitle, 
  sectionHeader, 
  sectionDescription, 
  causes: rawCauses 
}: CausesSectionProps) {
  const [causes, setCauses] = useState<CausesGalleryItem[]>([]);

  useEffect(() => {
    // Transform the causes data
    const transformedCauses = rawCauses.map((cause) => {
      return {
        id: cause.id,
        title: cause.title,
        description: cause.description,
        image: cause.image?.url 
          ? getStrapiImageUrl(cause.image.url)
          : '/images/causes/default.webp',
        donationLink: cause.link ? {
          url: cause.link.url,
          label: cause.link.label,
          type: cause.link.type,
          external: cause.link.isExternal || cause.link.url?.includes('http') || false,
          opensInPopup: cause.link.opensInPopup || (cause.link.type === 'donation' && cause.link.url?.includes('zeffy')) || false
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
