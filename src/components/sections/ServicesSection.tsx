'use client';
 
import {  GraduationCap, Home, Flame, Users } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const ServiceCard = ({ icon, title, description, color }: ServiceCardProps) => {
  return (
    <div className={`p-6 rounded-lg ${color} hover:shadow-lg transition-shadow duration-300 h-full flex flex-col`}>
      <div className="mb-4 text-lia-brown-dark">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-lia-brown-dark">{title}</h3>
      <p className="text-lia-brown-dark/80 text-sm">{description}</p>
    </div>
  );
};

export default function ServicesSection() {
  const services = [
    {
      icon: <Home size={36} />,
      title: "Basic Needs",
      description: "Providing essential supplies and support for daily living necessities.",
      color: "bg-secondary/20",
    },
    {
      icon: <Flame size={36} />,
      title: "Spiritual",
      description: "Nurturing faith and providing spiritual guidance for holistic wellbeing.",
      color: "bg-yellow-200",
    },
    {
      icon: <GraduationCap size={36} />,
      title: "Educational",
      description: "Empowering communities through knowledge and skills development.",
      color: "bg-blue-200",
    },
    {
      icon: <Users size={36} />,
      title: "Mentorship",
      description: "One-on-one guidance to help individuals reach their full potential.",
      color: "bg-teal-200",
    },
  ];

  return (
    <section className="py-20  bg-white relative overflow-hidden">
 

      <div className="container relative z-10">
      <div className="flex flex-col max-w-2xl gap-4 mb-8">
 <span className="text-secondary font-medium mb-4 inline-block">What we do</span>
 <h2 className="text-3xl md:text-4xl font-bold mb-6">
 Enrich lives offer hope inspire change
 </h2>
 <p className="text-muted-foreground">Charity volunteers dedicate their time and effort to improve lives end.
 </p>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
