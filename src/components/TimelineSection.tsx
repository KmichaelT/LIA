'use client';

import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TimelinePhase {
  id: number;
  date: string;
  title: string;
  description: string;
}

interface TimelineSectionProps {
  title: string;
  description: string;
  phases: TimelinePhase[];
  currentPhase?: number;
}

export default function TimelineSection({ 
  title, 
  description, 
  phases, 
  currentPhase 
}: TimelineSectionProps) {
  return (
    <section className="bg-background py-16">
      <div className="flex flex-col">
        <div className="flex flex-col gap-7">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            {title}
          </h1>
          <p className="max-w-xl text-lg">
            {description}
          </p>
        </div> 
        <Card className="relative w-full border-none shadow-none md:py-16 bg-transparent">
          <CardContent className="p-0">
            <div className="relative flex flex-col items-center md:mt-12">
              <Separator className="absolute   -top-[23px] left-0 hidden md:block" />
              {currentPhase && (
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: currentPhase > 1 && phases.length > 1
                      ? `${((currentPhase - 1) / phases.length) * 100}%`
                      : '0%',
                  }}
                  transition={{ ease: "easeOut", duration: 0.5 }}
                  className={cn(
                    "absolute   -top-[23px] left-4 hidden h-0.5 bg-foreground md:block",
                  )}
                />
              )}

              <div className={`grid gap-6 ${phases.length === 2 ? 'md:grid-cols-2' : phases.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
                {phases.map((phase, index) => {
                  const phaseNumber = index + 1;
                  const isCompleted = currentPhase ? phaseNumber < currentPhase : false;
                  const isCurrent = currentPhase === phaseNumber;
                  const isUpcoming = currentPhase ? phaseNumber > currentPhase : true;
                  
                  return (
                    <div key={phase.id} className="relative space-y-2">
                      <Separator
                        orientation="vertical"
                        className={cn(
                          "absolute top-2 left-[1px] block md:hidden",
                          isUpcoming ? "bg-gray-300" : "bg-foreground"
                        )}
                      />
                      {index == 0 && (
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{
                            height: currentPhase ? currentPhase * 112 : 0,
                          }}
                          transition={{ ease: "easeOut", duration: 0.5 }}
                          className={cn(
                            "absolute left-[1px] z-10 w-0.5 bg-foreground md:hidden",
                          )}
                        />
                      )}
                      <div className={cn(
                        "absolute top-0 -left-[9px] z-10 mb-5 flex size-5 items-center justify-center rounded-full p-1 md:-top-10 md:left-0",
                        isUpcoming ? "bg-gray-300" : "bg-foreground"
                      )}>
                        <div className="size-full rounded-full bg-background" />
                      </div>

                      <div className="pl-7 md:pl-0">
                        <p className={cn(
                          "text-sm mb-2",
                          isUpcoming ? "text-gray-400" : "text-muted-foreground"
                        )}>
                          {phase.date}
                        </p>
                        <h3 className={cn(
                          "text-md font-bold   mb-4",
                          isUpcoming ? "text-gray-400" : "text-foreground"
                        )}>
                          {phase.title}
                        </h3>
                        <p className={cn(
                          "text-sm",
                          isUpcoming ? "text-gray-400" : "text-muted-foreground"
                        )}>
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}