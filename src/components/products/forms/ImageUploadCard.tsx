
import { Upload, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadCardProps {
  images: File[];
  previewUrls: string[];
  error?: string;
  onImageSelect: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  onEdit?: (index: number) => void;
}

export default function ImageUploadCard({
  images,
  previewUrls,
  error,
  onImageSelect,
  onRemove,
  onEdit,
}: ImageUploadCardProps) {
  return (
    <div>
      {images.length < 5 && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onImageSelect(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-slate-700 font-medium">Click to upload images</p>
              <p className="text-sm text-slate-500">PNG, JPG, WebP up to 10MB each</p>
            </div>
          </label>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border shadow-sm" />
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Main
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                {onEdit && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemove(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
