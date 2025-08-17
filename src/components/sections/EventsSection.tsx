'use client';

import { useEffect, useState } from 'react';
import { Gallery1 } from '../gallery1';
import { EventData } from '@/types/strapi';
import { getStrapiImageUrl } from '@/lib/utils';


interface EventsSectionProps {
  sectionTitle?: string;
  sectionHeader?: string;
  sectionDescription?: string;
  events: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    location?: string;
    registrationLink?: string;
    featured?: boolean;
    image?: {
      url: string;
      alternativeText?: string;
    };
  }>;
}

export default function EventsSection({ 
  sectionTitle, 
  sectionHeader, 
  sectionDescription, 
  events: rawEvents 
}: EventsSectionProps) {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    // Transform the events data
    const transformedEvents = rawEvents.map((event) => {
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        image: event.image?.url 
          ? getStrapiImageUrl(event.image.url)
          : '/images/events/default.png',
        date: formattedDate,
        location: event.location || 'TBD',
        registrationLink: event.registrationLink,
        featured: event.featured || true,
        href: event.registrationLink || undefined
      };
    });
    setEvents(transformedEvents);
  }, [rawEvents]);

  // If no events, don't render section
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-transparent  relative overflow-hidden bg-transparent">
        <Gallery1
          title={sectionHeader}
          description={sectionDescription}
          sectionTitle={sectionTitle}
          items={events}
        />
    </section>
  );
}
 