"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/badge";

// Define proper types for the Gallery1 props and items
export interface Gallery1Item {
  id: number | string;
  title: string;
  href?: string;
  image: string;
  date?: string;
  author?: string;
  comments?: number;
  featured?: boolean;

  description?: string;
}

interface Gallery1Props {
  title?: string;
  description?: string;
  items: Gallery1Item[];
}

const Gallery1 = ({ title, description, items = [] }: Gallery1Props) => {
  const [selection, setSelection] = useState(items.length > 0 ? items[0].id : null);
  
  return (
    <div>
      {(title || description) && (
 <div className="flex flex-col max-w-2xl gap-4 mb-8">
 <span className="text-secondary font-medium mb-4 inline-block">Events</span>
 <h2 className="text-3xl md:text-4xl font-bold mb-6">
 {title}
 </h2>
 <p className="text-muted-foreground">
 {description}
 </p>
</div>
      )}
      
      <div className="flex flex-col gap-5 lg:aspect-[1336/420] lg:flex-row">
        {items.map((item) => (
            <div
            key={item.id}
            data-state={selection === item.id ? "open" : "closed"}
            className='group max-lg:w-full max-lg:flex-1 max-md:h-[200px] md:max-lg:aspect-[1336/420] lg:transform-gpu lg:transition-all lg:data-[state="closed"]:w-[20%] lg:data-[state="closed"]:duration-500 lg:data-[state="open"]:w-[60%] lg:data-[state="open"]:duration-400'
            onMouseEnter={() => {
              setSelection(item.id);
            }}
          > 
            <a
              href={item.href }
              className="relative block h-full w-full overflow-hidden rounded-xl bg-primary text-primary-foreground"
            >
              {/* Image as full background cover */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>
              
              <div className="relative flex flex-col justify-between gap-4 md:absolute md:inset-0 md:max-lg:inset-x-[50%] md:max-lg:w-[50%]">
 
                <div className='flex h-[80px] items-center gap-2 p-4 transition-opacity delay-200 duration-500 lg:group-data-[state="closed"]:opacity-0'>
                {item.featured && <Badge variant="secondary">Featured</Badge>}
                {item.date && <Badge variant="secondary">{item.date}</Badge>}
                  </div>
                  <div className='flex flex-col gap-2 p-4 transition-all delay-200 delay-250 duration-500 lg:group-data-[state="closed"]:translate-y-4 lg:group-data-[state="closed"]:opacity-0'>
                  
                <div className="flex items-center justify-between gap-2">
                    <div className="text-base font-medium lg:text-lg  overflow-hidden ">
                    <div className="mb-2 pt-4 text-lg font-bold md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="flex mb-4  text-sm  ">
                        {item.description}
                      </div>
                    </div>
                      {/* <div className="flex size-8 items-center justify-center rounded-full bg-background text-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 lg:size-10">
                        <ArrowUpRight className="size-4 lg:size-5" />
                      </div> */}
                    </div>
                  </div>
 
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Gallery1 };
