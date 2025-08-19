'use client';
 
import {  GraduationCap, Home, Flame, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  hasDetails?: boolean;
  learnMoreBlog?: {
    Heading: string;
    documentId: string;
  };
}

const ServiceCard = ({ icon, title, description, color, hasDetails, learnMoreBlog }: ServiceCardProps) => {
  return (
    <div className={`p-2 rounded-lg ${color} h-full flex flex-col`}>
      <div className="mb-4 text-lia-brown-dark">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-lia-brown-dark">{title}</h3>
      <p className="text-lia-brown-dark/80 text-sm mb-4 flex-grow">{description}</p>
      
      {/* Conditional Learn More Link - only show if hasDetails is true and learnMoreBlog exists */}
      {hasDetails === true && learnMoreBlog && learnMoreBlog.documentId && (
        <div className="mt-auto">
          <Link 
            href={`/blog/${learnMoreBlog.documentId}`}
            className="flex items-center text-sm text-black hover:opacity-80"
          >
            Learn More{" "}
            <ArrowRight className="ml-2 size-5 transition-transform hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

interface ServicesSectionProps {
  sectionTitle?: string;
  sectionHeader?: string;
  sectionDescription?: string;
  services: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    hasDetails?: boolean;
    learnMoreBlog?: {
      Heading: string;
      documentId: string;
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
              learnMoreBlog={service.learnMoreBlog}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
