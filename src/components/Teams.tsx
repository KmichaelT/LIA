"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TeamMemberProps = {
  header: string;
  description: string;
  image: string;
};

type TeamsProps = {
  teamMember?: TeamMemberProps;
  sectionTitle?: string;
  sectionDescription?: string;
};

const Teams = ({ teamMember, sectionTitle = "Our Team", sectionDescription = "Meet the dedicated individuals behind our mission to support children in Boreda, Ethiopia." }: TeamsProps) => {
  // If no team member data is provided, don't render the section
  if (!teamMember) {
    return null;
  }

  return (
    <section className="bg-background py-16">
      <div className="flex flex-col">
        <div className="flex flex-col gap-7 mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            {teamMember.header}
          </h1>
          <p className="max-w-xl text-lg">
            {teamMember.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <motion.div
            className="group block overflow-hidden rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-muted relative aspect-[16/9] overflow-hidden border-none p-0">
              <img
                src={teamMember.image} 
                alt={teamMember.header}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { Teams };
