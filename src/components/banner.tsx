"use client";

import { Sparkles, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/button";

interface Banner5Props {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  defaultVisible?: boolean;
}

const Banner5 = ({
  title = "Version 2.0 is now available!",
  description = "Check out all the new features.",
  buttonText = "Read update",
  buttonUrl = "https://shadcnblocks.com",
  defaultVisible = true,
}: Banner5Props) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <section className="fixed top-4 right-0 left-0 z-50 mx-auto max-w-2xl animate-fade-in">
      <div className="mx-4">
        <div className="w-full rounded-lg border bg-white p-4 shadow-md">
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-8 w-8 md:hidden"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex flex-col items-start gap-3 pt-2 md:flex-row md:items-center md:pt-0">
              <Sparkles className="h-5 w-5 flex-shrink-0" />
              <div className="flex flex-col gap-1 md:flex-row md:items-center">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full md:w-auto"
                asChild
              >
                <a href={buttonUrl} target="_blank">
                  {buttonText}
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-8 w-8 md:inline-flex"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Banner5 };
