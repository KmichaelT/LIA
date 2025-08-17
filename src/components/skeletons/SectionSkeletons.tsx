import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/aspect-ratio";

export function HeroSkeleton() {
  return (
    <section className="bg-cover bg-center mt-24 py-12 md:py-28">
      <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-8">
        <div className="mx-auto flex max-w-[43.75rem] flex-col gap-2 lg:mx-0 py-8">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-12 w-3/4 md:h-14 lg:h-16" />
            <Skeleton className="h-12 w-1/2 md:h-14 lg:h-16" />
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-5/6 max-w-xl" />
            <Skeleton className="h-4 w-4/6 max-w-xl" />
          </div>

          <div>
            <div className="w-fit lg:mx-0">
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-12 w-32 rounded-full" />
                <Skeleton className="h-12 w-36 rounded-full" />
              </div>
            </div>
            
            <div className="mt-8">
              <Skeleton className="h-[1px] w-full mb-6" />
              <div className="flex items-center gap-16">
                <div>
                  <Skeleton className="h-10 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-10 w-16 mb-1" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[31.25rem]">
          <div className="w-full overflow-hidden rounded-3xl">
            <AspectRatio ratio={1}>
              <Skeleton className="w-full h-full rounded-xl" />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSkeleton() {
  return (
    <section className="py-16 px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 rounded-lg bg-gray-50">
              <Skeleton className="h-10 w-10 mb-4" />
              <Skeleton className="h-6 w-3/4 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EventsSkeleton() {
  return (
    <section className="py-16 px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="space-y-1 mb-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CausesSkeleton() {
  return (
    <section className="py-16 px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="space-y-1 mb-4">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsSkeleton() {
  return (
    <section className="py-16">
      <div className="mx-auto px-4">
        <Skeleton className="h-8 w-48 mx-auto mb-12" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-12 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BibleVerseSkeleton() {
  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-5/6 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <Skeleton className="h-5 w-32 mx-auto mt-6" />
      </div>
    </section>
  );
}

export function NewsletterSkeleton() {
  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-2xl text-center">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 mx-auto mb-6" />
        <div className="flex gap-2 justify-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </section>
  );
}