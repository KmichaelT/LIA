"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { getStrapiImageUrl } from "@/lib/utils";

interface StrapiImage {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  width: number;
  height: number;
}

interface ImageSliderProps {
  images: StrapiImage[];
  alt: string;
  className?: string;
}

export default function ImageSlider({ images, alt, className = "" }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Define navigation functions first
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
        case "Escape":
          e.preventDefault();
          setIsFullscreen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, goToPrevious, goToNext]);

  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-[300px] bg-gray-200 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-sm">No images available</p>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`relative group ${className}`}>
        <div className="rounded-2xl overflow-hidden shadow-sm bg-white">
          <Image
            src={getStrapiImageUrl(images[0].url)}
            alt={images[0].alternativeText || alt}
            width={300}
            height={300}
            className="w-full h-[300px] object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
            priority
            onClick={openFullscreen}
          />
        </div>
        {/* Zoom icon overlay */}
        <div className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn size={16} />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Slider */}
      <div className={`relative group ${className}`}>
        <div className="rounded-2xl overflow-hidden shadow-sm bg-white">
          <Image
            src={getStrapiImageUrl(images[currentIndex].url)}
            alt={images[currentIndex].alternativeText || alt}
            width={300}
            height={300}
            className="w-full h-[300px] object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
            priority
            onClick={openFullscreen}
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>

        {/* Zoom icon overlay */}
        <div className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn size={16} />
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? "bg-white scale-125" 
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors duration-200 z-10"
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>

          {/* Fullscreen Image */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <Image
              src={getStrapiImageUrl(images[currentIndex].url)}
              alt={images[currentIndex].alternativeText || alt}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>

          {/* Fullscreen Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/20 transition-colors duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/20 transition-colors duration-200"
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>

              {/* Fullscreen Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? "bg-white scale-125" 
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Fullscreen Counter */}
              <div className="absolute top-4 left-4 text-white text-lg font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
