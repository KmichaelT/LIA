"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayIcon, MoveRight } from "lucide-react";
import { AspectRatio } from "@/components/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { getStrapiImageUrl } from "@/lib/utils";

interface HeroSectionProps {
  title?: string;
  description?: string;
  backgroundImage?: {
    id: number;
    url: string;
    name?: string;
    alternativeText?: string;
    formats?: Record<string, unknown>;
  };
  primaryButton?: {
    id: number;
    label: string;
    url: string;
    type: string;
    style?: string;
    isExternal?: boolean;
    opensInPopup?: boolean;
  };
  secondaryButton?: {
    id: number;
    label: string;
    url: string;
    type: string;
    style?: string;
    isExternal?: boolean;
    opensInPopup?: boolean;
  };
  stats?: Array<{
    id: number;
    label: string;
    value: number;
    unit: string;
    icon: string;
    category: string;
    description?: string;
  }>;
}

export default function HeroSection({ 
  title, 
  description, 
  backgroundImage, 
  primaryButton, 
  secondaryButton, 
  stats 
}: HeroSectionProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);


  // If no essential data, don't render
  if (!title) {
    return null;
  }

  const heroTitle = title;
  const heroDescription = description || "";
  const heroImageUrl = backgroundImage?.url 
    ? getStrapiImageUrl(backgroundImage.url)
    : null;

  return (
    <>
      <section className="bg-cover bg-center mt-24 py-12 md:py-28">  
          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-8">
            <div className="mx-auto flex max-w-[43.75rem] flex-col gap-2 lg:mx-0 py-8">
              <div className="flex flex-col gap-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"> 
                  {heroTitle}
                </h1>
              </div>
              <p className="text-muted-foreground text-base mb-4 max-w-xl">
                {heroDescription}
              </p>

              <div>
                <div className="w-fit lg:mx-0">
                  <div className="flex flex-wrap gap-4">
                    {primaryButton && (
                      (primaryButton.opensInPopup || (primaryButton.type === 'donation' && primaryButton.url?.includes('zeffy'))) ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="group flex h-fit w-fit items-center gap-2 rounded-full px-8 py-3 bg-primary text-white">
                              <p className="text-sm/5 font-medium text-white">
                                {primaryButton.label}
                              </p>
                              <div className="relative h-6 w-7 overflow-hidden">
                                <div className="absolute left-0 top-0 flex -translate-x-1/2 items-center transition-all duration-500 group-hover:translate-x-0">
                                  <MoveRight className="!h-6 !w-6 fill-white px-1" />
                                  <MoveRight className="!h-6 !w-6 fill-white px-1" />
                                </div>
                              </div>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 overflow-hidden flex items-center justify-center">
                            <iframe
                              src={primaryButton.url}
                              className="w-full h-full border-none"
                              title={primaryButton.label}
                            />
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Link href={primaryButton.url} target={(primaryButton.isExternal || primaryButton.url?.includes('http')) ? "_blank" : "_self"}>
                          <Button className="group flex h-fit w-fit items-center gap-2 rounded-full px-8 py-3 bg-primary text-white">
                            <p className="text-sm/5 font-medium text-white">
                              {primaryButton.label}
                            </p>
                            <div className="relative h-6 w-7 overflow-hidden">
                              <div className="absolute left-0 top-0 flex -translate-x-1/2 items-center transition-all duration-500 group-hover:translate-x-0">
                                <MoveRight className="!h-6 !w-6 fill-white px-1" />
                                <MoveRight className="!h-6 !w-6 fill-white px-1" />
                              </div>
                            </div>
                          </Button>
                        </Link>
                      )
                    )}

                    {secondaryButton && (
                      (secondaryButton.opensInPopup || (secondaryButton.type === 'donation' && secondaryButton.url?.includes('zeffy'))) ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex w-fit items-center gap-3 hover:bg-transparent"
                            >
                              <div className="relative h-7 w-7 rounded-full p-[3px] before:absolute before:top-0 before:left-0 before:block before:h-full before:w-full before:animate-[spin_5s_ease-in-out_infinite] before:rounded-full before:bg-gradient-to-r before:from-primary before:to-transparent before:content-['']">
                                <div className="relative z-20 flex h-full w-full rounded-full bg-white">
                                  <PlayIcon className="m-auto !h-3 !w-3 fill-primary stroke-primary" />
                                </div>
                              </div>
                              <p className="text-sm/5 font-medium text-primary">
                                {secondaryButton.label}
                              </p>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 overflow-hidden flex items-center justify-center">
                            <iframe
                              src={secondaryButton.url}
                              className="w-full h-full border-none"
                              title={secondaryButton.label}
                            />
                          </DialogContent>
                        </Dialog>
                      ) : secondaryButton.url === "/video/lia_video.mp4" ? (
                        <Button
                          variant="ghost"
                          onClick={() => setIsVideoOpen(true)}
                          className="flex w-fit items-center gap-3 hover:bg-transparent"
                        >
                          <div className="relative h-7 w-7 rounded-full p-[3px] before:absolute before:top-0 before:left-0 before:block before:h-full before:w-full before:animate-[spin_5s_ease-in-out_infinite] before:rounded-full before:bg-gradient-to-r before:from-primary before:to-transparent before:content-['']">
                            <div className="relative z-20 flex h-full w-full rounded-full bg-white">
                              <PlayIcon className="m-auto !h-3 !w-3 fill-primary stroke-primary" />
                            </div>
                          </div>
                          <p className="text-sm/5 font-medium text-primary">
                            {secondaryButton.label}
                          </p>
                        </Button>
                      ) : (
                        <Link href={secondaryButton.url} target={(secondaryButton.isExternal || secondaryButton.url?.includes('http')) ? "_blank" : "_self"}>
                          <Button
                            variant="ghost"
                            className="flex w-fit items-center gap-3 hover:bg-transparent"
                          >
                            <div className="relative h-7 w-7 rounded-full p-[3px] before:absolute before:top-0 before:left-0 before:block before:h-full before:w-full before:animate-[spin_5s_ease-in-out_infinite] before:rounded-full before:bg-gradient-to-r before:from-primary before:to-transparent before:content-['']">
                              <div className="relative z-20 flex h-full w-full rounded-full bg-white">
                                <PlayIcon className="m-auto !h-3 !w-3 fill-primary stroke-primary" />
                              </div>
                            </div>
                            <p className="text-sm/5 font-medium text-primary">
                              {secondaryButton.label}
                            </p>
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                </div>
                
                {stats && stats.length > 0 && (
                  <div className="mt-8">
                    <div
                      className="h-[1px] w-full bg-black mb-6"
                      style={{
                        background:
                          "linear-gradient(270deg, rgba(234, 232, 225, .2) 0%, rgba(17, 16, 17, .2) 50%, rgba(17, 16, 17, 0) 100%)",
                      }}
                    />
                    <div className="flex items-center gap-16">
                      {stats.slice(0, 2).map((stat, index) => (
                        <div key={stat.id || index}>
                          <h3 className="text-4xl font-bold mb-1">
                            {stat.value}{stat.unit}
                          </h3>
                          <p className="text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {heroImageUrl && (
              <div className="mx-auto w-full max-w-[31.25rem]">
                <div className="w-full overflow-hidden rounded-3xl">
                  <AspectRatio ratio={1}>
                    <Image
                      src={heroImageUrl}
                      alt="Hero Image"
                      width={600}
                      height={800}
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                    />
                  </AspectRatio>
                </div>
              </div>
            )}
          </div>

      </section>

      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white"
              onClick={() => setIsVideoOpen(false)}
            >
              Close
            </button>
            <div className="aspect-video rounded-lg overflow-hidden">
              <video
                width="100%"
                height="100%"
                controls
                autoPlay
                src="/video/lia_video.mp4"
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
