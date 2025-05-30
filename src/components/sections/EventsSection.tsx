'use client';

import { Gallery1 } from '../gallery1';

export default function EventsSection() {
  const galleryItems = [
    {
      id: 1,
      image: "/images/events/run.png",
      title: "Run With Purpose 2025",
      description: "Join us May 31 for the 2nd Annual Run With Purpose, spread love, support our mission, and enjoy community fun.",
      date: "31 May 2025",
      href:"https://www.zeffy.com/en-US/ticketing/2025-lia-5k-run"
    },
    {
      id: 3,
      image: "/images/events/jub.JPG",
      title: "ESFNA 2025",
      description: "On July 2025, visit our booth at the ESFNA to explore cool merch and join us in empowering underprivileged children.",
      date: "Jul 2025",
    },
    {
      id: 2,
      image: "/images/events/com_weekend.png",
      title: "Empower The Community Weekend",
      description: "Swing by our booth at the Empower The Community Weekend to support our mission. Grab a t‑shirt or gadget and help uplift underprivileged children.",
      date: "Sep 2025",
    },
        {
      id: 4,
      image: "/images/events/meet.JPG",
      title: "Love in Action Annual Staff Meeting",
      description: "The Love in Action Annual Staff Meeting to reflect on our achievements, plan ahead, and celebrate our impact together.",
      date: "Dec 2025",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container">
        <Gallery1
          title="Upcoming Events"
          description="Join us at our upcoming events where we work together to make a meaningful difference in our community through service and compassion."
          items={galleryItems}
        />
      </div>
    </section>
  );
}
