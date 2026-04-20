'use client';
 
import {  GraduationCap, Home, Flame, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getStrapiImageUrl } from '@/lib/utils';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  href?: string;
  hasDetails?: boolean;
  image?: {
    url: string;
    alternativeText?: string;
  };
}

const ServiceCard = ({ icon, title, description, color, hasDetails, href, image }: ServiceCardProps) => {
  const shortDescription =
    description.length > 70 ? `${description.slice(0, 70).trimEnd()}...` : description;

  const content = (
    <div className={`rounded-lg ${color} h-full flex flex-col overflow-hidden bg-white`}>
      {image?.url ? (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-slate-100">
          <img
            src={getStrapiImageUrl(image.url)}
            alt={image.alternativeText || title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="px-4 pt-4 mb-4 text-lia-brown-dark">
          {icon}
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center gap-3 text-lia-brown-dark">
          <div className="shrink-0">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-lia-brown-dark/80 text-sm mb-4 flex-grow">{shortDescription}</p>

        {hasDetails && (
          <div className="mt-auto flex items-center text-sm text-black">
            View Details{" "}
            <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block">
        {content}
      </Link>
    );
  }

  return content;
};

interface ServicesSectionProps {
  sectionTitle?: string;
  sectionHeader?: string;
  sectionDescription?: string;
  services: Array<{
    id: number;
    documentId?: string;
    title: string;
    description: string;
    icon: string;
    hasDetails?: boolean;
    image?: {
      url: string;
      alternativeText?: string;
    };
  }>;
}

export default function ServicesSection({ 
  sectionTitle, 
  sectionHeader, 
  sectionDescription, 
  services 
}: ServicesSectionProps) {


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

  // If no services, don't render section
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="py-20  relative overflow-hidden">
      <div className="relative z-10">
        {(sectionTitle || sectionHeader || sectionDescription) && (
          <div className="flex flex-col max-w-2xl gap-4 mb-8">
            {sectionTitle && (
              <span className="text-secondary font-medium mb-4 inline-block">{sectionTitle}</span>
            )}
            {sectionHeader && (
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {sectionHeader}
              </h2>
            )}
            {sectionDescription && (
              <p className="text-muted-foreground">{sectionDescription}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={getIconComponent(service.icon)}
              title={service.title}
              description={service.description}
              color=""
              hasDetails={service.hasDetails}
              image={service.image}
              href={
                service.hasDetails
                  ? `/services/${service.documentId ?? service.id}`
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
