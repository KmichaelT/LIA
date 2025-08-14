'use client';

import { useEffect, useState, useMemo } from 'react';
import { Gallery1 } from '../gallery1';
import { getUpcomingEvents } from '@/lib/strapi';
import { EventData } from '@/types/strapi';
import { getStrapiImageUrl } from '@/lib/utils';

// Map event titles to existing image files
function getEventFallbackImage(title: string): string {
  const imageMap: { [key: string]: string } = {
    'Run With Purpose 2025': '/images/events/run.png',
    'ESFNA 2025': '/images/events/jub.JPG',
    'Empower The Community Weekend': '/images/events/com_weekend.png',
    'Love in Action Annual Staff Meeting': '/images/events/meet.JPG'
  };
  
  return imageMap[title] || '/images/events/default.png';
}

interface EventsSectionProps {
  sectionData?: {
    sectionTitle?: string;
    sectionHeader?: string;
    sectionDescription?: string;
    layoutType?: string;
    maxItems?: number;
  };
}

export default function EventsSection({ sectionData }: EventsSectionProps = {}) {
  const [events, setEvents] = useState<EventData[]>([]);

  // Fallback data
  const fallbackEvents = useMemo(() => [
    {
      id: 1,
      image: "/images/events/run.png",
      title: "Run With Purpose 2025",
      description: "Join us May 31 for the 2nd Annual Run With Purpose, spread love, support our mission, and enjoy community fun.",
      date: "31 May 2025",
      location: "TBD",
      featured: true,
      href: "https://www.zeffy.com/en-US/ticketing/2025-lia-5k-run"
    },
    {
      id: 3,
      image: "/images/events/jub.JPG",
      title: "ESFNA 2025",
      description: "On July 2025, visit our booth at the ESFNA to explore cool merch and join us in empowering underprivileged children.",
      date: "Jul 2025",
      location: "TBD",
      featured: true
    },
    {
      id: 2,
      image: "/images/events/com_weekend.png",
      title: "Empower The Community Weekend",
      description: "Swing by our booth at the Empower The Community Weekend to support our mission. Grab a t‑shirt or gadget and help uplift underprivileged children.",
      date: "Sep 2025",
      location: "TBD",
      featured: true
    },
    {
      id: 4,
      image: "/images/events/meet.JPG",
      title: "Love in Action Annual Staff Meeting",
      description: "The Love in Action Annual Staff Meeting to reflect on our achievements, plan ahead, and celebrate our impact together.",
      date: "Dec 2025",
      location: "TBD",
      featured: true
    },
  ], []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const limit = sectionData?.maxItems || 4;
        const eventsData = await getUpcomingEvents(limit);
        if (eventsData && eventsData.length > 0) {
          const transformedEvents = eventsData.map((event: {id: number, title: string, description: string, date: string, image?: {url: string}, registrationLink?: string}) => {
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
                : getEventFallbackImage(event.title),
              date: formattedDate,
              href: event.registrationLink || undefined
            };
          });
          setEvents(transformedEvents);
        } else {
          setEvents(fallbackEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents(fallbackEvents);
      }
    }

    fetchEvents();
  }, [sectionData?.maxItems, fallbackEvents]);

  return (
    <section className="py-20 bg-transparent  relative overflow-hidden bg-transparent">
        <Gallery1
          title={sectionData?.sectionHeader || "Upcoming Events"}
          description={sectionData?.sectionDescription || "Join us at our upcoming events where we work together to make a meaningful difference in our community through service and compassion."}
          items={events}
        />
    </section>
  );
}
 