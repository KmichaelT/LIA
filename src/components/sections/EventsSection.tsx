'use client';

import { Gallery1 } from '../gallery1';

export default function EventsSection() {
  const galleryItems = [
    {
      id: 1,
      image: "/images/events/sport.png",
      title: "Love in Action 2nd Annual Christian Sport Tournament",
      description: "Join us on May 31 from 8 AM to 11 PM for our 2nd Annual Christian Sport Tournament—compete in games, fellowship in faith, and strengthen community bonds.",
      date: "31 May",
    },
    {
      id: 2,
      image: "/images/events/com_weekend.png",
      title: "Empower The Community Weekend",
      description: "This July 27, swing by our booth at the Walter E. Washington Convention Center to support our mission—grab a t‑shirt or gadget and help uplift underprivileged children.",
      date: "27 Jul",
    },
    {
      id: 3,
      image: "/images/events/jub.jpg",
      title: "Jubilee",
      description: "On July 27, visit our Jubilee booth at the Walter E. Washington Convention Center to explore cool merch and join us in empowering underprivileged children.",
      date: "27 Jul",
    },

        {
      id: 4,
      image: "/images/events/meet.jpg",
      title: "Love in Action Annual Staff Meeting",
      description: "Join us on December 21 for the Love in Action Annual Staff Meeting to reflect on our achievements, plan ahead, and celebrate our impact together.",
      date: "21 Dec",
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
