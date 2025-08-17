"use client";

import { useState, useEffect } from "react";
import { getStats } from "@/lib/strapi";
import { StatsSkeleton } from "@/components/skeletons/SectionSkeletons";

interface StatsSectionProps {
  sectionData?: {
    sectionTitle?: string;
    layoutType?: string;
    maxItems?: number;
  };
}

export default function StatsSection({ sectionData }: StatsSectionProps) {
  const [stats, setStats] = useState<Array<{id: number, value: number, unit: string, label: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const data = await getStats();
        const limit = sectionData?.maxItems || 6;
        setStats(data.slice(0, limit));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStats();
  }, [sectionData?.maxItems]);

  // Show skeleton while loading
  if (isLoading) {
    return <StatsSkeleton />;
  }

  // If no stats after loading, don't render section
  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className=" mx-auto px-4">
        {sectionData?.sectionTitle && (
          <h2 className="text-3xl font-bold text-center mb-12">
            {sectionData.sectionTitle}
          </h2>
        )}
        
        <div className={`grid gap-8 ${
          sectionData?.layoutType === 'horizontal' 
            ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {stats.map((stat, index) => (
            <div key={stat.id || index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.value}{stat.unit}
              </div>
              <div className="text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}