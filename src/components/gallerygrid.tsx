"use client";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

interface StrapiGallery {
  id: number;
  documentId: string;
  name: string;
  category: string;
  image?: StrapiImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface GallerygridProps {
  galleries: StrapiGallery[];
}

const Card = ({ gallery }: { gallery: StrapiGallery }) => {
  const [selectedImage, setSelectedImage] = useState<StrapiImage | null>(null);
  const firstImage = gallery.image?.[0];
  
  if (!firstImage) {
    return (
      <div className="relative min-h-auto w-full overflow-hidden rounded-[.5rem] bg-gradient-to-br from-muted/50 to-muted bg-cover bg-center bg-no-repeat p-5 sm:aspect-square md:aspect-auto md:min-h-[30rem] md:max-w-[30rem] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <span className="text-4xl mb-2 block">📷</span>
          <p className="text-sm">No images</p>
        </div>
      </div>
    );
  }

  const imageUrl = firstImage.formats?.medium?.url || firstImage.formats?.small?.url || firstImage.url;
  
  return (
    <>
      <div
        onClick={() => setSelectedImage(firstImage)}
        style={{ backgroundImage: `url(https://best-desire-8443ae2768.strapiapp.com${imageUrl})` }}
        className="before:content-[] relative min-h-auto w-full overflow-hidden rounded-[.5rem] bg-black/80 bg-cover bg-center bg-no-repeat p-5 transition-all duration-300 before:absolute before:top-0 before:left-0 before:z-10 before:block before:size-full before:bg-black/50 before:transition-all before:duration-300 hover:before:bg-black/30 sm:aspect-square md:aspect-auto md:min-h-[30rem] md:max-w-[30rem] cursor-pointer group"
      >
        <div className="relative z-20 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
              {gallery.category}
            </Badge>
            {gallery.image && gallery.image.length > 1 && (
              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                +{gallery.image.length - 1} more
              </Badge>
            )}
          </div>
          <div className="mt-auto">
            <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-white/90 transition-colors">
              {gallery.name}
            </h3>
            <p className="text-white/70 text-sm">
              {gallery.image?.length || 0} image{gallery.image?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Modal for image preview */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <img
              src={`https://best-desire-8443ae2768.strapiapp.com${selectedImage.url}`}
              alt={selectedImage.alternativeText || selectedImage.name}
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-lg font-semibold">{gallery.name}</p>
              <p className="text-sm text-white/70">{selectedImage.name}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Gallerygrid = ({ galleries }: GallerygridProps) => {
  if (galleries.length === 0) {
    return (
      <section className="py-32">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Gallery</h2>
          <p className="text-muted-foreground">No gallery items available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of images showcasing our work and community.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <Card key={gallery.documentId} gallery={gallery} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallerygrid };
