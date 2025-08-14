'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function HelpPeopleSection() {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
 

      <div className=" relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Video Thumbnail */}
          <div className="relative rounded-xl overflow-hidden group">
            <Image
              src="https://ext.same-assets.com/2237034016/3790608263.jpeg"
              alt="Help People"
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Link
                href="https://www.youtube.com/watch?v=lTxn2BuqyzU"
                className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center transition-transform duration-300 hover:scale-110"
                target="_blank"
                aria-label="Play video"
              >
                <Play className="ml-1 text-secondary" size={30} />
              </Link>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-secondary font-medium mb-4 inline-block">Help people</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Were dedicated to assisting for poor soul
            </h2>
            <p className="text-muted-foreground mb-8">
              We aim to aid individuals facing economic difficulties to help them overcome financial dignity.
            </p>

            <div className="flex flex-wrap gap-8 mb-8">
              <div>
                <h3 className="text-4xl font-bold mb-1">18k</h3>
                <p className="text-muted-foreground">Building a hospital</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-1">14+</h3>
                <p className="text-muted-foreground">Successful campaigns</p>
              </div>
            </div>

            <Link href="/blog-details" className="btn-primary">
              About us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
