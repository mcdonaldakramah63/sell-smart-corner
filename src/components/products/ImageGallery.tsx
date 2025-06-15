
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  
  if (images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }
  
  const nextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  return (
    <>
      <div className={`relative ${fullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        <div className={`relative ${fullscreen ? 'h-full' : 'aspect-video'} bg-gray-50 rounded-lg overflow-hidden`}>
          {!imageError[activeIndex] ? (
            <img
              src={images[activeIndex]}
              alt="Product"
              className={`w-full h-full ${fullscreen ? 'object-contain' : 'object-contain'}`}
              onError={() => handleImageError(activeIndex)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-500">Image unavailable</span>
            </div>
          )}
          
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-md"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-md"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next</span>
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white shadow-md"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-5 w-5" />
            <span className="sr-only">{fullscreen ? 'Exit fullscreen' : 'View fullscreen'}</span>
          </Button>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        {!fullscreen && images.length > 1 && (
          <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded overflow-hidden border-2 flex-shrink-0 ${
                  activeIndex === index ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {!imageError[index] ? (
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">N/A</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Fullscreen background overlay */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black/80 z-40" onClick={toggleFullscreen}></div>
      )}
    </>
  );
}
