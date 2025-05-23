
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  
  if (images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted flex items-center justify-center">
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

  return (
    <>
      <div className={`relative ${fullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        <div className={`relative ${fullscreen ? 'h-full' : 'aspect-video'}`}>
          <img
            src={images[activeIndex]}
            alt="Product"
            className={`w-full h-full ${fullscreen ? 'object-contain' : 'object-cover'}`}
          />
          
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
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
            className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-5 w-5" />
            <span className="sr-only">{fullscreen ? 'Exit fullscreen' : 'View fullscreen'}</span>
          </Button>
        </div>
        
        {/* Thumbnails */}
        {!fullscreen && images.length > 1 && (
          <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded overflow-hidden border-2 ${
                  activeIndex === index ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
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
