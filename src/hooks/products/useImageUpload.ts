
import { useState } from "react";
import { validateFile } from "@/utils/validation";

export function useImageUpload() {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleImageSelect = (files: FileList | null) => {
    const fileArr = Array.from(files || []);
    if (fileArr.length + images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    const validFiles: File[] = [];
    fileArr.forEach((file) => {
      const validation = validateFile(file, {
        maxSize: 10 * 1024 * 1024,
        allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        allowedExtensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      });
      if (validation.isValid) {
        validFiles.push(file);
      }
    });
    setImages((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);
    setError(undefined);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setError(undefined);
  };

  return { images, previewUrls, error, handleImageSelect, removeImage, setImages, setPreviewUrls, setError };
}
