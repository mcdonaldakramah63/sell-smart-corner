
import { Upload, X } from "lucide-react";

interface ImageUploadCardProps {
  images: File[];
  previewUrls: string[];
  error?: string;
  onImageSelect: (files: FileList | null) => void;
  onRemove: (index: number) => void;
}

export default function ImageUploadCard({
  images,
  previewUrls,
  error,
  onImageSelect,
  onRemove,
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
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
