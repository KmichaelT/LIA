"use client";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { STRAPI_URL, getStrapiImageUrl } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const firstImage = gallery.image?.[0];
  const hasMultipleImages = gallery.image && gallery.image.length > 1;

  const nextImage = () => {
    if (gallery.image && currentImageIndex < gallery.image.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(gallery.image[newIndex]);
    }
  };

  const prevImage = () => {
    if (gallery.image && currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(gallery.image[newIndex]);
    }
  };

  const openImage = (image: StrapiImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };
  
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
        onClick={() => openImage(firstImage, 0)}
        style={{ backgroundImage: `url(${getStrapiImageUrl(imageUrl)})` }}
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

      {/* Modal for image preview with carousel */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={getStrapiImageUrl(selectedImage.url)}
              alt={selectedImage.alternativeText || selectedImage.name}
              className="w-full h-full object-contain rounded-lg"
            />
            
            {/* Navigation arrows for multiple images */}
            {hasMultipleImages && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                {currentImageIndex < gallery.image!.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </>
            )}
            
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
            
            {/* Image info and counter */}
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-lg font-semibold">{gallery.name}</p>
              <p className="text-sm text-white/70">{selectedImage.name}</p>
              {hasMultipleImages && (
                <p className="text-xs text-white/50 mt-1">
                  {currentImageIndex + 1} of {gallery.image!.length}
                </p>
              )}
            </div>
            
            {/* Thumbnail strip for multiple images */}
            {hasMultipleImages && gallery.image!.length <= 5 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                {gallery.image!.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => openImage(img, index)}
                    className={`w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-white' : 'border-white/30'
                    }`}
                  >
                    <img
                      src={getStrapiImageUrl(img.formats?.thumbnail?.url || img.url)}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
        <div  >
          <h1 className="mb-4">Gallery</h1>
          <p>No gallery items available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32">
      <div  >
        <div className="mb-12 max-w-2xl">
          <h1 className="mb-4">Gallery</h1>
          <p>
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
