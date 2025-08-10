'use client';
 
import {  GraduationCap, Home, Flame, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFeaturedServices } from '@/lib/strapi';
import { ServiceData } from '@/types/strapi';

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
      <h3 className="text-xl font-bold mb-3 text-lia-brown-dark">{title}</h3>
      <p className="text-lia-brown-dark/80 text-sm">{description}</p>
    </div>
  );
};

interface ServicesSectionProps {
  sectionData?: {
    sectionTitle?: string;
    sectionHeader?: string;
    sectionDescription?: string;
    layoutType?: string;
    maxItems?: number;
  };
}

export default function ServicesSection({ sectionData }: ServicesSectionProps = {}) {
  const [services, setServices] = useState<ServiceData[]>([]);

  // Fallback data
  const fallbackServices = [
    {
      id: 1,
      icon: "Home",
      title: "Basic Needs",
      description: "Providing essential supplies and support for daily living necessities.",
      backgroundColor: "bg-secondary/20",
      featured: true,
      order: 1
    },
    {
      id: 2,
      icon: "Flame",
      title: "Spiritual",
      description: "Nurturing faith and providing spiritual guidance for holistic wellbeing.",
      backgroundColor: "bg-yellow-200",
      featured: true,
      order: 2
    },
    {
      id: 3,
      icon: "GraduationCap",
      title: "Educational",
      description: "Empowering communities through knowledge and skills development.",
      backgroundColor: "bg-blue-200",
      featured: true,
      order: 3
    },
    {
      id: 4,
      icon: "Users",
      title: "Mentorship",
      description: "One-on-one guidance to help individuals reach their full potential.",
      backgroundColor: "bg-teal-200",
      featured: true,
      order: 4
    },
  ];

  useEffect(() => {
    async function fetchServices() {
      try {
        const servicesData = await getFeaturedServices();
        const limit = sectionData?.maxItems || 4;
        if (servicesData && servicesData.length > 0) {
          const transformedServices = servicesData.map((service: {id: number, title: string, description: string, icon: string, backgroundColor?: string, featured: boolean, order: number}) => ({
            id: service.id,
            title: service.title,
            description: service.description,
            icon: service.icon,
            backgroundColor: service.backgroundColor || 'bg-gray-200',
            featured: service.featured,
            order: service.order
          }));
          setServices(transformedServices.slice(0, limit));
        } else {
          setServices(fallbackServices.slice(0, limit));
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        const limit = sectionData?.maxItems || 4;
        setServices(fallbackServices.slice(0, limit));
      }
    }

    fetchServices();
  }, [sectionData?.maxItems]);

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconProps = { size: 36 };
    switch (iconName) {
      case 'Home':
        return <Home {...iconProps} />;
      case 'Flame':
        return <Flame {...iconProps} />;
      case 'GraduationCap':
        return <GraduationCap {...iconProps} />;
      case 'Users':
        return <Users {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  };

  return (
    <section className="py-20  relative overflow-hidden">
 

      <div className="relative z-10">
      <div className="flex flex-col max-w-2xl gap-4 mb-8">
 <span className="text-secondary font-medium mb-4 inline-block">{sectionData?.sectionTitle || "What we do"}</span>
 <h2 className="text-3xl md:text-4xl font-bold mb-6">
 {sectionData?.sectionHeader || "Enrich lives offer hope inspire change"}
 </h2>
 <p className="text-muted-foreground">{sectionData?.sectionDescription || "Charity volunteers dedicate their time and effort to improve lives end."}
 </p>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={getIconComponent(service.icon)}
              title={service.title}
              description={service.description}
              color={service.backgroundColor || 'bg-gray-200'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
