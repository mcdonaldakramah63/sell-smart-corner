import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlusCircle, Upload, X, Package, DollarSign, MapPin, Tag } from 'lucide-react';
import { validateTextContent, validatePrice, validateFile } from '@/utils/validation';
import { useCategories } from '@/hooks/useCategories';
import { useProductForm } from "@/hooks/products/useProductForm";
import { useImageUpload } from "@/hooks/products/useImageUpload";
import ProductDetailsCard from "@/components/products/forms/ProductDetailsCard";
import ImageUploadCard from "@/components/products/forms/ImageUploadCard";

interface ProductForm {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  location: string;
}

export default function CreateProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();

  const { fields, errors, handleInputChange, validateForm, setErrors } = useProductForm({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
  });

  const {
    images,
    previewUrls,
    error: imagesError,
    handleImageSelect,
    removeImage,
    setImages,
    setPreviewUrls,
    setError: setImagesError
  } = useImageUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a listing',
        variant: 'destructive'
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: 'Please fix the errors',
        description: 'Check the form for validation errors',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a unique ID for the product
      const productId = crypto.randomUUID();
      
      // Sanitize inputs
      const titleValidation = validateTextContent(fields.title, { minLength: 3, maxLength: 100, required: true });
      const descValidation = validateTextContent(fields.description, { maxLength: 2000 });
      const priceValidation = validatePrice(fields.price);
      const locationValidation = validateTextContent(fields.location, { maxLength: 100 });
      
      // Create product - using category as string value, not as category_id
      const { error: productError } = await supabase
        .from('products')
        .insert({
          id: productId,
          title: titleValidation.sanitized,
          description: descValidation.sanitized || null,
          price: priceValidation.value!,
          category_id: null, // Set to null since we don't have category UUIDs
          condition: fields.condition,
          location: locationValidation.sanitized || null,
          user_id: user.id,
          seller_id: user.id
        });

      if (productError) {
        console.error('Product creation error:', productError);
        throw productError;
      }

      // Upload images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${productId}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            continue;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          // Save image record
          await supabase
            .from('product_images')
            .insert({
              product_id: productId,
              image_url: publicUrl,
              is_primary: i === 0
            });
        }
      }

      toast({
        title: 'Product created successfully!',
        description: 'Your listing is now live'
      });

      navigate(`/products`);
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Create Listing
            </h1>
          </div>
          <p className="text-slate-600">List your item for sale on the marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
          {/* Product Details */}
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-slate-800">Product Information</CardTitle>
              </div>
              <CardDescription>
                Provide details about your item to attract buyers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <ProductDetailsCard
                fields={fields}
                errors={errors}
                handleInputChange={handleInputChange}
                categories={categories}
                categoriesLoading={categoriesLoading}
              />
            </CardContent>
          </Card>
          {/* Image Upload */}
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
                  <Upload className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-slate-800">Product Images</CardTitle>
              </div>
              <CardDescription>
                Upload up to 5 images to showcase your item (first image will be the main photo)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ImageUploadCard
                images={images}
                previewUrls={previewUrls}
                error={imagesError}
                onImageSelect={(e) => handleImageSelect(e.target.files)}
                onRemove={removeImage}
              />
            </CardContent>
          </Card>
          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Listing
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
