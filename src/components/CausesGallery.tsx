"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/carousel";

export interface CausesGalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  donationLink?: {
    url: string;
    label: string;
    type: string;
    external: boolean;
    opensInPopup: boolean;
  };
  blogLink?: {
    Heading: string;
    documentId: string;
  };
}

export interface CausesGalleryProps {
  title?: string;
  description?: string;
  sectionTitle?: string;
  items: CausesGalleryItem[];
}

const data = [
  {
    id: 1,
    title: "Sample Cause",
    description: "Sample description",
    href: "#",
    image: "https://via.placeholder.com/400x300",
    progress: 75,
    amountRaised: 50000,
    goalAmount: 100000,
  },
];

function CausesGallery({
  title,
  description,
  sectionTitle,
  items = data,
}: CausesGalleryProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const updateState = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", updateState);
    updateState();

    return () => {
      carouselApi.off("select", updateState);
    };
  }, [carouselApi]);

  return (
    <section className="py-32">
      <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
        <div className="flex flex-col gap-4">
          {sectionTitle && (
            <span className="text-secondary font-medium mb-4 inline-block">
              {sectionTitle}
            </span>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border border-primary/20"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border border-primary/20"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </div>
      <div className="mx-auto">
        <Carousel
          setApi={setCarouselApi}
          className="ml-[20px] overflow-visible "
          opts={{
            align: "start",
            skipSnaps: false,
            slidesToScroll: 1,
            containScroll: false,
          }}
        >
          <CarouselContent className="ml-0  ">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[440px] pl-[20px] lg:max-w-[500px]"
              >
                <div className="group rounded-xl">
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-5/4 lg:aspect-16/9">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_20%,hsl(var(--primary))_100%)] mix-blend-multiply" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8 z-10">
                      <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="mb-8 line-clamp-4 md:mb-12 lg:mb-9 text-sm">
                        {item.description}
                      </div>
                      {/* Button container with space between */}
                      <div className="flex items-center justify-between w-full gap-4">
                        {/* Support button on the left - only show if donation link exists */}
                        {item.donationLink && item.donationLink.url && (
                          <div>
                            {item.donationLink.opensInPopup ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button 
                                    className="flex items-center text-sm cursor-pointer bg-transparent border-none p-0 text-primary-foreground hover:opacity-80"
                                  >
                                    {item.donationLink.label || "Support this cause"}{" "}
                                    <ArrowRight className="ml-2 size-5 transition-transform hover:translate-x-1" />
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 overflow-hidden flex items-center justify-center">
                                  <DialogTitle className="sr-only">
                                    {item.donationLink.label || "Support this cause"} - Donation Form
                                  </DialogTitle>
                                  <iframe
                                    src={(() => {
                                      let url = item.donationLink!.url;
                                      // Add modal=true parameter for complete Zeffy UI if not present
                                      if (url.includes('zeffy.com') && !url.includes('modal=')) {
                                        url += url.includes('?') ? '&modal=true' : '?modal=true';
                                      }
                                      return url;
                                    })()}
                                    className="w-full h-full border-none"
                                    title="Donation Form"
                                  />
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Link
                                href={item.donationLink?.url || "#"}
                                target={item.donationLink?.external ? "_blank" : "_self"}
                                rel={item.donationLink?.external ? "noopener noreferrer" : undefined}
                                className="flex items-center text-sm text-primary-foreground hover:opacity-80"
                              >
                                {item.donationLink?.label || "Support this cause"}{" "}
                                <ArrowRight className="ml-2 size-5 transition-transform hover:translate-x-1" />
                              </Link>
                            )}
                          </div>
                        )}
                        
                        {/* Learn More button on the right - without arrow */}
                        {item.blogLink && item.blogLink.documentId && (
                          <Link 
                            href={`/blog/${item.blogLink.documentId}`}
                            className="text-sm text-primary-foreground hover:opacity-80"
                          >
                            Learn More
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { CausesGallery };