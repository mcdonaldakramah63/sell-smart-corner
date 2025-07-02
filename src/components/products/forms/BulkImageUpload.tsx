
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { validateFile } from '@/utils/validation';

interface UploadItem {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface BulkImageUploadProps {
  onUploadComplete: (files: File[]) => void;
  maxFiles?: number;
}

export default function BulkImageUpload({ onUploadComplete, maxFiles = 20 }: BulkImageUploadProps) {
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: UploadItem[] = [];

    fileArray.forEach((file) => {
      const validation = validateFile(file, {
        maxSize: 10 * 1024 * 1024,
        allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        allowedExtensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      });

      if (validation.isValid) {
        validFiles.push({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          status: 'pending',
          progress: 0
        });
      }
    });

    if (uploadItems.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploadItems(prev => [...prev, ...validFiles]);
  };

  const removeItem = (id: string) => {
    setUploadItems(prev => {
      const item = prev.find(item => item.id === id);
      if (item) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const startUpload = async () => {
    const pendingItems = uploadItems.filter(item => item.status === 'pending');
    
    for (const item of pendingItems) {
      setUploadItems(prev => 
        prev.map(i => i.id === item.id ? { ...i, status: 'uploading' } : i)
      );

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadItems(prev => 
            prev.map(i => i.id === item.id ? { ...i, progress } : i)
          );
        }

        setUploadItems(prev => 
          prev.map(i => i.id === item.id ? { ...i, status: 'success', progress: 100 } : i)
        );
      } catch (error) {
        setUploadItems(prev => 
          prev.map(i => i.id === item.id ? { 
            ...i, 
            status: 'error', 
            error: 'Upload failed' 
          } : i)
        );
      }
    }

    // Call completion handler with successful files
    const successfulFiles = uploadItems
      .filter(item => item.status === 'success')
      .map(item => item.file);
    
    onUploadComplete(successfulFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const getStatusIcon = (status: UploadItem['status']) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <ImageIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Image Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            Drop images here or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Support: JPG, PNG, GIF, WebP (max 10MB each)
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Upload Items */}
        {uploadItems.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 border rounded">
                <img
                  src={item.preview}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded"
                />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(item.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                  
                  {item.status === 'uploading' && (
                    <Progress value={item.progress} className="w-full h-1 mt-1" />
                  )}
                  
                  {item.error && (
                    <p className="text-xs text-red-500 mt-1">{item.error}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  
                  {item.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {uploadItems.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {uploadItems.length} images selected
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  uploadItems.forEach(item => URL.revokeObjectURL(item.preview));
                  setUploadItems([]);
                }}
              >
                Clear All
              </Button>
              
              <Button
                onClick={startUpload}
                disabled={uploadItems.every(item => item.status !== 'pending')}
              >
                Upload All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
