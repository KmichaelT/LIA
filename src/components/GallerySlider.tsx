"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2, Play } from "lucide-react";
import { getStrapiImageUrl } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StrapiImage {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  width: number;
  height: number;
}

interface GallerySliderProps {
  images: StrapiImage[];
  childName: string;
}

// Helper function to check if a media item is a video
function isVideo(media: StrapiImage): boolean {
  if (!media.name) return false;
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v'];
  const extension = media.name.toLowerCase().substring(media.name.lastIndexOf('.'));
  return videoExtensions.includes(extension);
}

export default function GallerySlider({ images, childName }: GallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const goToFullscreenPrevious = () => {
    setFullscreenIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToFullscreenNext = () => {
    setFullscreenIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Photo Gallery</CardTitle>
          <p className="text-sm text-gray-600">
            View more photos and videos of {childName}
          </p>
        </CardHeader>
        <CardContent>
          {/* Main Slider */}
          <div className="relative group">
            {/* Main Media Display - No stretching */}
            <div className="relative rounded-lg overflow-hidden bg-white" style={{ height: '400px' }}>
              {isVideo(images[currentIndex]) ? (
                <video
                  src={getStrapiImageUrl(images[currentIndex].url)}
                  controls
                  className="w-full h-full object-contain cursor-pointer"
                  style={{ maxHeight: '400px' }}
                  onClick={() => openFullscreen(currentIndex)}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={getStrapiImageUrl(images[currentIndex].url)}
                  alt={images[currentIndex].alternativeText || `${childName} - Photo ${currentIndex + 1}`}
                  fill
                  className="object-contain cursor-pointer"
                  onClick={() => openFullscreen(currentIndex)}
                  priority={currentIndex === 0}
                />
              )}
              
              {/* Fullscreen Icon */}
              <button
                onClick={() => openFullscreen(currentIndex)}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                aria-label="View fullscreen"
              >
                <Maximize2 size={18} />
              </button>

              {/* Media Counter */}
              <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            {/* Navigation Arrows - Only show if more than 1 media */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70 z-10"
                  aria-label="Previous"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70 z-10"
                  aria-label="Next"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="mt-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => {
                  const isVideoItem = isVideo(image);
                  return (
                    <button
                      key={image.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentIndex 
                          ? 'border-primary ring-2 ring-primary/50 scale-105' 
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                      aria-label={`View ${isVideoItem ? 'video' : 'photo'} ${index + 1}`}
                    >
                      {isVideoItem ? (
                        <>
                          <video
                            src={getStrapiImageUrl(image.url)}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            onMouseEnter={(e) => {
                              const video = e.currentTarget;
                              video.currentTime = 0.1;
                              video.play().catch(() => {});
                            }}
                            onMouseLeave={(e) => {
                              const video = e.currentTarget;
                              video.pause();
                              video.currentTime = 0;
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play size={16} className="text-white" fill="white" />
                          </div>
                        </>
                      ) : (
                        <Image
                          src={getStrapiImageUrl(image.url)}
                          alt={image.alternativeText || `${childName} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors duration-200 z-10"
            aria-label="Close fullscreen"
          >
            <X size={28} />
          </button>

          {/* Fullscreen Media - No stretching */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative max-w-[95vw] max-h-[95vh]">
              {isVideo(images[fullscreenIndex]) ? (
                <video
                  src={getStrapiImageUrl(images[fullscreenIndex].url)}
                  controls
                  className="max-w-full max-h-[95vh] w-auto h-auto object-contain"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={getStrapiImageUrl(images[fullscreenIndex].url)}
                  alt={images[fullscreenIndex].alternativeText || `${childName} - Photo ${fullscreenIndex + 1}`}
                  width={images[fullscreenIndex].width}
                  height={images[fullscreenIndex].height}
                  className="max-w-full max-h-[95vh] w-auto h-auto object-contain"
                  priority
                />
              )}
            </div>
          </div>

          {/* Fullscreen Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToFullscreenPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/20 transition-colors duration-200"
                aria-label="Previous"
              >
                <ChevronLeft size={36} />
              </button>
              
              <button
                onClick={goToFullscreenNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/20 transition-colors duration-200"
                aria-label="Next"
              >
                <ChevronRight size={36} />
              </button>

              {/* Fullscreen Counter */}
              <div className="absolute top-4 left-4 text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-full">
                {fullscreenIndex + 1} / {images.length}
              </div>

              {/* Fullscreen Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2 px-2">
                {images.map((image, index) => {
                  const isVideoItem = isVideo(image);
                  return (
                    <button
                      key={image.id}
                      onClick={() => setFullscreenIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === fullscreenIndex 
                          ? 'border-white ring-2 ring-white/50' 
                          : 'border-white/50 hover:border-white'
                      }`}
                    >
                      {isVideoItem ? (
                        <>
                          <video
                            src={getStrapiImageUrl(image.url)}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            onMouseEnter={(e) => {
                              const video = e.currentTarget;
                              video.currentTime = 0.1;
                              video.play().catch(() => {});
                            }}
                            onMouseLeave={(e) => {
                              const video = e.currentTarget;
                              video.pause();
                              video.currentTime = 0;
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play size={12} className="text-white" fill="white" />
                          </div>
                        </>
                      ) : (
                        <Image
                          src={getStrapiImageUrl(image.url)}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
