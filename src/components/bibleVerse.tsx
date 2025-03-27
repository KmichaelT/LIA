
import { Book } from 'lucide-react';

interface BibleVerseProps {
  quote?: string;
  author?: {
    name: string; 
    avatar: {
      src: string;
      alt: string;
    };
  };
}

const BibleVerse = ({
  quote = "Dear children, let us not merely say that we love each other; let us show the truth by our actions.",
  author = {
    name: "1st John 3:18", 
    avatar: {
      src: "https://www.shadcnblocks.com/images/block/avatar-1.webp",
      alt: "Customer Name",
    },
  },
}: BibleVerseProps) => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <p className="mb-4 max-w-4xl px-8 font-medium lg:text-2xl">
            &ldquo;{quote}&rdquo;
          </p> 
            <div className="text-left">
              <p className="text-sm font-medium md:text-base">{author.name}</p>
 
            </div>
          </div>
        </div> 
    </section>
  );
};

export { BibleVerse };
