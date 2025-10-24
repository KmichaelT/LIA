import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import TimelineSection from "./TimelineSection";

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
  timeline?: {
    title: string;
    currentPhase: number;
    phases: TimelinePhase[];
  };
  joinTeam?: {
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isHovered && content.missionContent.length > 1) {
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentContentIndex((current) => 
              (current + 1) % content.missionContent.length
            );
            return 0;
          }
          return prev + 2.5; // 100% in 4000ms (100/40 = 2.5% per 100ms)
        });
      }, 100);

      return () => clearInterval(progressInterval);
    } else {
      setProgress(0);
    }
  }, [isHovered, content.missionContent.length]);

  const currentContent = content.missionContent[currentContentIndex];
  return (
    <section className="py-32">
      <div  >
        <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-7">
          <h1>
            {content.hero.title}
          </h1>
          <p className="max-w-xl">
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
            className="flex gap-4 rounded-2xl bg-muted p-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Content Section */}
            <div className="flex-1 flex flex-col gap-4">
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
            
            {/* Vertical Navigation Indicators */}
            <div className="flex flex-col items-center gap-3">
              {/* Vertical Progress Bar */}
              {!isHovered && content.missionContent.length > 1 && (
                <div className="h-16 w-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div 
                    className="w-full bg-primary transition-all duration-100 ease-linear"
                    style={{ height: `${progress}%` }}
                  />
                </div>
              )}
              
              {/* Vertical Navigation Dots */}
              <div className="flex flex-col gap-2">
                {content.missionContent.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentContentIndex(index);
                      setProgress(0);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentContentIndex 
                        ? 'bg-primary scale-125' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to ${content.missionContent[index].title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {content.timeline && (
          <TimelineSection
            title={content.timeline.title}
            description={content.hero.description}
            phases={content.timeline.phases}
            currentPhase={content.timeline.currentPhase}
          />
        )}
        
        {content.joinTeam && (
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-2.5">
                {content.joinTeam.title}
              </h2>
            </div>
            <div>
              <p className="text-muted-foreground">
                {content.joinTeam.description}
              </p>
              <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row">
                <Button className="w-full sm:w-auto">Join the team</Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  become a sponsor
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export { About1 };