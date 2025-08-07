"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/carousel";

export interface Gallery4Item {
  id: number;
  title: string;
  description: string;
  href: string;
  image: string;
  progress?: number;
  amountRaised?: number;
  goalAmount?: number;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items: Gallery4Item[];
}

const data = [
  {
    id: 1,
    title: "shadcn/ui: Building a Modern Component Library",
    description:
      "Explore how shadcn/ui revolutionized React component libraries by providing a unique approach to component distribution and customization, making it easier for developers to build beautiful, accessible applications.",
    href: "https://ui.shadcn.com",
    image:
      "https://images.unsplash.com/photo-1551250928-243dc937c49d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjN8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    progress: 75,
    amountRaised: 50000,
    goalAmount: 100000,
  },
  {
    id: 2,
    title: "Tailwind CSS: The Utility-First Revolution",
    description:
      "Discover how Tailwind CSS transformed the way developers style their applications, offering a utility-first approach that speeds up development while maintaining complete design flexibility.",
    href: "https://tailwindcss.com",
    image:
      "https://images.unsplash.com/photo-1551250928-e4a05afaed1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjR8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    progress: 50,
    amountRaised: 25000,
    goalAmount: 50000,
  },
  {
    id: 3,
    title: "Astro: The All-in-One Web Framework",
    description:
      "Learn how Astro's innovative 'Islands Architecture' and zero-JS-by-default approach is helping developers build faster websites while maintaining rich interactivity where needed.",
    href: "https://astro.build",
    image:
      "https://images.unsplash.com/photo-1536735561749-fc87494598cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzNjM0NDc0fA&ixlib=rb-4.0.3&q=80&w=1080",
    progress: 90,
    amountRaised: 90000,
    goalAmount: 100000,
  },
  {
    id: 4,
    title: "React: Pioneering Component-Based UI",
    description:
      "See how React continues to shape modern web development with its component-based architecture, enabling developers to build complex user interfaces with reusable, maintainable code.",
    href: "https://react.dev",
    image:
      "https://images.unsplash.com/photo-1548324215-9133768e4094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMzF8fHx8fHwyfHwxNzIzNDM1MzA1fA&ixlib=rb-4.0.3&q=80&w=1080",
    progress: 60,
    amountRaised: 60000,
    goalAmount: 100000,
  },
  {
    id: 5,
    title: "Next.js: The React Framework for Production",
    description:
      "Explore how Next.js has become the go-to framework for building full-stack React applications, offering features like server components, file-based routing, and automatic optimization.",
    href: "https://nextjs.org",
    image:
      "https://images.unsplash.com/photo-1550070881-a5d71eda5800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjV8fHx8fHwyfHwxNzIzNDM1Mjk4fA&ixlib=rb-4.0.3&q=80&w=1080",
    progress: 80,
    amountRaised: 80000,
    goalAmount: 100000,
  },
];

const Gallery4 = ({
  title = "Case Studies",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences. These case studies showcase real-world applications and success stories.",
  items = data,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="py-32">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
 
 <div className="flex flex-col max-w-2xl gap-4">
   <span className="text-secondary font-medium mb-4 inline-block">Our causes</span>
   <h2 className="text-3xl md:text-4xl font-bold mb-6">
   {title}
   </h2>
   <p className="text-muted-foreground">
   {description}
   </p>
 </div>
 <div className="hidden shrink-0 gap-2 md:flex">
   <Button
     size="icon"
     variant="ghost"
     onClick={() => {
       carouselApi?.scrollPrev();
     }}
     disabled={!canScrollPrev}
     className="disabled:pointer-events-auto"
   >
     <ArrowLeft className="size-5" />
   </Button>
   <Button
     size="icon"
     variant="ghost"
     onClick={() => {
       carouselApi?.scrollNext();
     }}
     disabled={!canScrollNext}
     className="disabled:pointer-events-auto"
   >
     <ArrowRight className="size-5" />
   </Button>
 </div>
</div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0  2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[400px] pl-[20px] lg:max-w-[400px]"
              >
                <div className="group rounded-xl">
                  <Link href={item.href} className="block">
                    <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 h-full bg-gradient-to-b from-transparent to-[#072a51] mix-blend-multiply" />
                      <div className="text-primary-foreground absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8">
                        <div className="mb-2 pt-4 text-lg font-bold md:mb-3 md:pt-4 lg:pt-4">
                          {item.title}
                        </div>
                        <div className="mb-4 line-clamp-2 text-sm ">
                          {item.description}
                        </div>
                        {/* Progress bar */}
                        <div className="mb-4 w-full">
                          <div className="text-xs text-white/70 mb-1 flex justify-between">
                            <span>${item.amountRaised?.toLocaleString() || '0'}</span>
                            <span>${item.goalAmount?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white rounded-full transition-all duration-500 ease-in-out" 
                              style={{ width: `${item.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-6 pb-6 md:px-8 md:pb-8 -mt-16 relative z-10">
                    <Link href="https://www.zeffy.com/en-US/donation-form/d7a24fa2-5425-4e72-b337-120c4f0b8c64">
                      <Button 
                        size="sm" 
                        className="mt-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm hover:translate-y-0"
                      >
                        Support this cause
                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
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
};

export { Gallery4 };
