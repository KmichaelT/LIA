"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, PlayIcon, MoveRight } from "lucide-react";
import { AspectRatio } from "@/components/aspect-ratio";
import { Button } from "@/components/button";
import { useState } from "react";
import {Banner5} from "@/components/banner";


export default function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
    <Banner5 
      title="Don't Miss Out!"
      description="Join us for the 2nd Annual Christian Sports Tournament"
      buttonText="Buy Tickets"
      buttonUrl="https://www.zeffy.com/en-US/embed/ticketing/2025-lia-sports-tournament"
    />
      <section className="bg-cover bg-center py-12 md:py-28">  
        <div className="container sm:px-12">
          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-8">
            <div className="mx-auto flex max-w-[43.75rem] flex-col gap-2 lg:mx-0">
              <div className="flex flex-col gap-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  Changing lives one child at a time!
                </h1>
              </div>
              <p className="text-muted-foreground text-base mb-4 max-w-xl">
                Join us in supporting underprivileged children in Boreda,
                Ethiopia by providing education, financial support, and
                spiritual guidance.
              </p>

              <div>
                <div className="w-fit lg:mx-0">
                  <div className="flex flex-wrap gap-4">
                    <Link href="https://www.zeffy.com/en-US/donation-form-v2/d7a24fa2-5425-4e72-b337-120c4f0b8c64">
                      <Button className="group flex h-fit w-fit items-center gap-2 rounded-full px-8 py-3 bg-primary text-white">
                        <p className="text-sm/5 font-medium text-white">
                          Donate Now
                        </p>
                        <div className="relative h-6 w-7 overflow-hidden">
                          <div className="absolute left-0 top-0 flex -translate-x-1/2 items-center transition-all duration-500 group-hover:translate-x-0">
                            <MoveRight className="!h-6 !w-6 fill-white px-1" />
                            <MoveRight className="!h-6 !w-6 fill-white px-1" />
                          </div>
                        </div>
                      </Button>
                    </Link>

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
                        Watch Demo
                      </p>
                    </Button>
                  </div>
                </div>
                <div
                  className="my-4 h-[1px] w-full bg-black"
                  style={{
                    background:
                      "linear-gradient(270deg, rgba(234, 232, 225, .2) 0%, rgba(17, 16, 17, .2) 50%, rgba(17, 16, 17, 0) 100%)",
                  }}
                />
                <div className="mt-4 flex items-center gap-16">
                  <div>
                    <h3 className="text-4xl font-bold mb-1">200+</h3>
                    <p className="text-muted-foreground">Children Sponsered</p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold mb-1">9+</h3>
                    <p className="text-muted-foreground">Years On Mission</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[31.25rem]">
              <div className="relative mx-auto w-full max-w-full lg:mx-0">
                <div className="w-full overflow-hidden rounded-3xl">
                  <AspectRatio ratio={1}>
                    <Image
                      src="/images/hero/hero-img.png"
                      alt="Hero Image"
                      width={600}
                      height={800}
                      className="mx-auto rounded-xl shadow-lg"
                    />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
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
