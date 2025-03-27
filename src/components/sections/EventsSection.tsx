'use client';

import { Gallery1 } from '../gallery1';

export default function EventsSection() {
  const galleryItems = [
    {
      id: 1,
      image: "/images/blog/blog-1.jpg",
      title: "Annual Charity Fundraising Gala",
      description: "Join us for an evening of giving, entertainment, and community support at our flagship fundraising event.", 
      date: "15 Apr", 
      featured: true,
    },
    {
      id: 2,
      image: "/images/blog/blog-2.jpg",
      title: "Community Outreach Day",
      description: "Volunteer with us as we provide essential services and fellowship to local communities in need.",
      date: "22 May",
    },
    {
      id: 3,
      image: "https://ext.same-assets.com/2459100695/674975058.jpeg",
      title: "Youth Mentorship Workshop",
      description: "A special workshop connecting experienced mentors with youth who are seeking guidance and support.", 
      date: "10 Jun", 
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
