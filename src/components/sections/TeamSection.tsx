'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

interface TeamMemberProps {
  image: string;
  name: string;
  role: string;
}

const TeamMember = ({ image, name, role }: TeamMemberProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={400}
          height={400}
          className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            href="#"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-foreground hover:bg-secondary hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </Link>
          <Link
            href="#"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-foreground hover:bg-secondary hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={18} />
          </Link>
          <Link
            href="#"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-foreground hover:bg-secondary hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </Link>
        </div>
      </div>
      <div className="p-5 text-center">
        <Link href="/team-details" className="hover:text-secondary">
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm">{role}</p>
      </div>
    </div>
  );
};

export default function TeamSection() {
  const teamMembers = [
    {
      image: "/images/team/team-1.jpg",
      name: "Brandon Simmons",
      role: "Volunteer",
    },
    {
      image: "/images/team/team-2.jpg",
      name: "Jenny Wilson",
      role: "Volunteer",
    },
    {
      image: "https://ext.same-assets.com/192855812/345832902.jpeg",
      name: "Savannah Nguyen",
      role: "Volunteer",
    },
    {
      image: "https://ext.same-assets.com/171342592/1930726926.jpeg",
      name: "Robert Smith",
      role: "Volunteer",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-white">
      <div  >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary font-medium mb-4 inline-block">Team</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our team members
          </h2>
          <p className="text-muted-foreground">
            Team includes dedicated members working collaboratively toward common objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              image={member.image}
              name={member.name}
              role={member.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
