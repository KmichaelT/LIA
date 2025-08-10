import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";

interface TimelinePhase {
  id: number;
  date: string;
  title: string;
  description: string;
}

interface AboutContent {
  hero: {
    title: string;
    description: string;
  };
  image: string;
  missionContent: {
    title: string;
    content: string;
  }[];
  timeline: {
    title: string;
    currentPhase: number;
    phases: TimelinePhase[];
  };
  joinTeam: {
    title: string;
    description: string;
  };
}

interface About1Props {
  content: AboutContent;
}

const About1: React.FC<About1Props> = ({ content }) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered && content.missionContent.length > 1) {
      const interval = setInterval(() => {
        setCurrentContentIndex((prev) => 
          (prev + 1) % content.missionContent.length
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isHovered, content.missionContent.length]);

  const currentContent = content.missionContent[currentContentIndex];
  return (
    <section className="py-32">
      <div className="flex flex-col gap-28">
        <div className="flex flex-col gap-7">
          <h1 className="text-4xl font-semibold lg:text-7xl">
            {content.hero.title}
          </h1>
          <p className="max-w-xl text-lg">
            {content.hero.description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <img
            src={content.image}
            alt="About us"
            className="size-full max-h-96 rounded-2xl object-cover"
          />
          <div 
            className="flex flex-col justify-between gap-10 rounded-2xl bg-muted p-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.p 
                key={`title-${currentContentIndex}`}
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                {currentContent.title}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p 
                key={`content-${currentContentIndex}`}
                className="text-lg font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {currentContent.content}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <section className="bg-background py-16">
          <div className=" flex flex-col">
                    <div className="flex flex-col gap-7">
          <h1 className="text-2xl font-semibold lg:text-4xl">
           {content.timeline.title}
          </h1>
          <p className="max-w-xl text-lg">
            {content.hero.description}
          </p>
        </div> 
            <Card className="relative w-full border-none shadow-none md:py-16 bg-transparent">
              <CardContent className="p-0">
                <div className="relative flex flex-col items-center md:mt-12">
                  <Separator className="absolute -top-6 left-0 hidden md:block" />
                  {content.timeline.currentPhase && (
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: content.timeline.currentPhase > 1 && content.timeline.phases.length > 1
                          ? `${((content.timeline.currentPhase - 1) / content.timeline.phases.length) * 100}%`
                          : '0%',
                      }}
                      transition={{ ease: "easeOut", duration: 0.5 }}
                      className={cn(
                        "absolute -top-[20px] left-4 hidden h-0.5 bg-foreground md:block",
                      )}
                    />
                  )}

                  <div className={`grid gap-6 ${content.timeline.phases.length === 2 ? 'md:grid-cols-2' : content.timeline.phases.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
                    {content.timeline.phases.map((phase, index) => (
                      <div key={phase.id} className="relative space-y-2">
                        <Separator
                          orientation="vertical"
                          className="absolute top-2 left-[1px] block md:hidden"
                        />
                        {index == 0 && (
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{
                              height: content.timeline.currentPhase * 112,
                            }}
                            transition={{ ease: "easeOut", duration: 0.5 }}
                            className={cn(
                              "absolute left-[1px] z-10 w-0.5 bg-foreground md:hidden",
                            )}
                          />
                        )}
                        <div className="absolute top-0 -left-[9px] z-10 mb-5 flex size-5 items-center justify-center rounded-full bg-foreground p-1 md:-top-10 md:left-0">
                          <div className="size-full rounded-full bg-background" />
                        </div>

                        <div className="pl-7 md:pl-0">
                          <p className="text-sm text-muted-foreground mb-2">
                            {phase.date}
                          </p>
                          <h3 className="text-md font-bold tracking-tighter text-foreground mb-4">
                            {phase.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {phase.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <div className="grid gap-10 md:grid-cols-2">

          <div>
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              {content.joinTeam.title}
            </h2>
          </div>
          <div>
 
            <p className="text-muted-foreground">
              {content.joinTeam.description}
            </p>
                        <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row">
              <Button className="w-full sm:w-auto">Join the team
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                become a sponsor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { About1 };