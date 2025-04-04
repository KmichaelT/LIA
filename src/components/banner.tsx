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
    <section className="mx-auto max-w-4xl animate-fade-in pt-8">
      <div className="mx-4">
        <div 
          className="w-full rounded-lg border-2 border-transparent p-4 shadow-md
          [background:linear-gradient(45deg,#f8fafc,theme(colors.white)_50%,#f8fafc)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.300/.48)_80%,_theme(colors.orange.500)_86%,_theme(colors.orange.300)_90%,_theme(colors.orange.500)_94%,_theme(colors.slate.300/.48))_border-box] 
          animate-border"
        >
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
              <Sparkles className="h-5 w-5 flex-shrink-0 text-orange-500" />
              <div className="flex flex-col gap-1 md:flex-row md:items-center">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-secondary text-white hover:bg-secondary-50 hover:text-secondary hover:border-secondary hover:bg-white md:w-auto"
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