import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Filter out images that have failed to load
  const validImages = images?.filter(url => !failedImages.has(url)) || [];

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (failedUrl: string) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(failedUrl);
      return newSet;
    });
    // Reset index if we lose the current image, or if list becomes empty
    setCurrentIndex(0); 
  };

  // Auto-advance
  useEffect(() => {
    if (validImages.length <= 1) return;
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [validImages.length]);

  const isModalImage = className?.includes('modal-image');

  // If no valid images remain, show placeholder
  if (validImages.length === 0) {
    return (
      <div className={cn("w-full h-48 bg-muted/30 flex flex-col items-center justify-center gap-2", className)}>
        <ImageOff className="w-8 h-8 text-muted-foreground/50" />
        <span className="text-sm text-muted-foreground/70">이미지가 없습니다</span>
      </div>
    );
  }
  
  // Ensure index is valid
  const safeIndex = currentIndex >= validImages.length ? 0 : currentIndex;
  const currentImageUrl = validImages[safeIndex];

  return (
    <div className={cn(
      "relative w-full bg-muted/20 rounded-lg overflow-hidden",
      isModalImage ? "h-full flex items-center justify-center bg-transparent" : "h-48",
      className
    )}>
      {/* Main Image */}
      <img 
        src={currentImageUrl} 
        alt={`${alt} - 이미지 ${safeIndex + 1}`}
        className={cn(
          "transition-opacity duration-300",
          isModalImage ? "max-w-full max-h-full object-contain" : "w-full h-full object-cover"
        )}
        onError={() => handleImageError(currentImageUrl)}
      />
      
      {/* Navigation arrows - only show if more than 1 image */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
      
      {/* Dots indicator - only show if more than 1 image */}
      {validImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
              className={cn(
                "w-2 h-2 rounded-full transition-all shadow-sm",
                index === safeIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
      
      {/* Image counter */}
      {validImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {safeIndex + 1} / {validImages.length}
        </div>
      )}
    </div>
  );
}