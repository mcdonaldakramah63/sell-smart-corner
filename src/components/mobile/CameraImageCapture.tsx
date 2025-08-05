
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Image, X } from 'lucide-react';
import { useCapacitorFeatures } from '@/hooks/useCapacitorFeatures';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CameraImageCaptureProps {
  onImageCapture: (imageDataUrl: string) => void;
  onClose?: () => void;
}

export const CameraImageCapture = ({ onImageCapture, onClose }: CameraImageCaptureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const { isNative, cameraSupported, takePhoto, selectFromGallery } = useCapacitorFeatures();

  const handleTakePhoto = async () => {
    setIsCapturing(true);
    try {
      const imageDataUrl = await takePhoto();
      if (imageDataUrl) {
        onImageCapture(imageDataUrl);
        setIsOpen(false);
        onClose?.();
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSelectFromGallery = async () => {
    setIsCapturing(true);
    try {
      const imageDataUrl = await selectFromGallery();
      if (imageDataUrl) {
        onImageCapture(imageDataUrl);
        setIsOpen(false);
        onClose?.();
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleWebFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          onImageCapture(result);
          setIsOpen(false);
          onClose?.();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Camera className="h-4 w-4" />
          Add Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Photo</DialogTitle>
          <DialogDescription>
            Choose how you'd like to add a photo to your listing
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isNative && cameraSupported ? (
            <>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleTakePhoto}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Take Photo</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your device camera to capture a new photo
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleSelectFromGallery}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Image className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Choose from Gallery</h3>
                    <p className="text-sm text-muted-foreground">
                      Select an existing photo from your gallery
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Image className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Upload Photo</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a photo from your device
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWebFileUpload}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
