
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RotateCw, Crop, Palette, Download, Undo2 } from 'lucide-react';

interface ImageEditingToolsProps {
  imageUrl: string;
  onSave: (editedImageBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageEditingTools({ imageUrl, onSave, onCancel }: ImageEditingToolsProps) {
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [rotation, setRotation] = useState(0);

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setRotation(0);
  };

  const handleSave = async () => {
    // Create canvas and apply filters
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        // Apply filters
        ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`;
        
        // Apply rotation
        if (rotation !== 0) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            onSave(blob);
          }
        }, 'image/jpeg', 0.9);
      }
    };
    
    img.src = imageUrl;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Image Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="flex justify-center">
          <div className="relative border rounded-lg overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-sm max-h-64 object-contain"
              style={{
                filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
                transform: `rotate(${rotation}deg)`
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Brightness</label>
            <Slider
              value={brightness}
              onValueChange={setBrightness}
              max={200}
              min={50}
              step={5}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">{brightness[0]}%</span>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Contrast</label>
            <Slider
              value={contrast}
              onValueChange={setContrast}
              max={200}
              min={50}
              step={5}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">{contrast[0]}%</span>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Saturation</label>
            <Slider
              value={saturation}
              onValueChange={setSaturation}
              max={200}
              min={0}
              step={5}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">{saturation[0]}%</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="h-4 w-4 mr-1" />
              Rotate
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <Undo2 className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Download className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
