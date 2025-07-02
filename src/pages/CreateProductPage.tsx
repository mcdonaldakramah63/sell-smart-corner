
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Upload, Package, CheckCircle, Palette } from 'lucide-react';
import { validateTextContent, validatePrice } from '@/utils/validation';
import { useCategories } from '@/hooks/useCategories';
import { useProductForm } from "@/hooks/products/useProductForm";
import { useImageUpload } from "@/hooks/products/useImageUpload";
import { useProductTemplates } from "@/hooks/products/useProductTemplates";
import ProductDetailsCard from "@/components/products/forms/ProductDetailsCard";
import ImageUploadCard from "@/components/products/forms/ImageUploadCard";
import BulkImageUpload from "@/components/products/forms/BulkImageUpload";
import ProductTemplates from "@/components/products/forms/ProductTemplates";
import AdvancedValidation from "@/components/products/forms/AdvancedValidation";
import ImageEditingTools from "@/components/products/forms/ImageEditingTools";
import Layout from "@/components/layout/Layout";

export default function CreateProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImageUrl, setEditingImageUrl] = useState<string>('');
  const [editingImageIndex, setEditingImageIndex] = useState<number>(-1);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const { fields, errors, handleInputChange, validateForm, setFields } = useProductForm({
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
    setPreviewUrls
  } = useImageUpload();

  const { selectedTemplate, applyTemplate } = useProductTemplates();

  const handleTemplateSelect = (template: any) => {
    const updatedFields = applyTemplate(template, fields);
    setFields(updatedFields);
    
    toast({
      title: 'Template applied',
      description: `Applied ${template.name} template to your listing`
    });
  };

  const handleBulkUpload = (newFiles: File[]) => {
    const combinedFiles = [...images, ...newFiles];
    if (combinedFiles.length > 5) {
      toast({
        title: 'Too many images',
        description: 'Maximum 5 images allowed',
        variant: 'destructive'
      });
      return;
    }
    
    setImages(combinedFiles);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
    
    toast({
      title: 'Images uploaded',
      description: `${newFiles.length} images added to your listing`
    });
  };

  const handleEditImage = (index: number) => {
    setEditingImageIndex(index);
    setEditingImageUrl(previewUrls[index]);
    setShowImageEditor(true);
  };

  const handleSaveEditedImage = async (editedBlob: Blob) => {
    const editedFile = new File([editedBlob], `edited_${images[editingImageIndex].name}`, {
      type: 'image/jpeg'
    });
    
    // Replace the image at the specific index
    const newImages = [...images];
    newImages[editingImageIndex] = editedFile;
    setImages(newImages);
    
    // Update preview URL
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[editingImageIndex]);
    newPreviewUrls[editingImageIndex] = URL.createObjectURL(editedFile);
    setPreviewUrls(newPreviewUrls);
    
    setShowImageEditor(false);
    
    toast({
      title: 'Image updated',
      description: 'Your edited image has been saved'
    });
  };

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
      const productId = crypto.randomUUID();
      
      const titleValidation = validateTextContent(fields.title, { minLength: 3, maxLength: 100, required: true });
      const descValidation = validateTextContent(fields.description, { maxLength: 2000 });
      const priceValidation = validatePrice(fields.price);
      const locationValidation = validateTextContent(fields.location, { maxLength: 100 });
      
      const { error: productError } = await supabase
        .from('products')
        .insert({
          id: productId,
          title: titleValidation.sanitized,
          description: descValidation.sanitized || null,
          price: priceValidation.value!,
          category_id: null,
          condition: fields.condition,
          location: locationValidation.sanitized || null,
          user_id: user.id,
          seller_id: user.id
        });

      if (productError) {
        console.error('Product creation error:', productError);
        throw productError;
      }

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

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

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
    <Layout>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
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
                </TabsContent>

                <TabsContent value="images" className="space-y-6">
                  <Card className="shadow-lg border-slate-200 bg-white">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
                          <Upload className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-slate-800">Product Images</CardTitle>
                      </div>
                      <CardDescription>
                        Upload and edit images to showcase your item
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ImageUploadCard
                        images={images}
                        previewUrls={previewUrls}
                        error={imagesError}
                        onImageSelect={handleImageSelect}
                        onRemove={removeImage}
                        onEdit={handleEditImage}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="templates" className="space-y-6">
                  <ProductTemplates onSelectTemplate={handleTemplateSelect} />
                </TabsContent>

                <TabsContent value="bulk" className="space-y-6">
                  <BulkImageUpload onUploadComplete={handleBulkUpload} />
                </TabsContent>
              </Tabs>

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
                  onClick={handleSubmit}
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
            </div>

            {/* Validation Sidebar */}
            <div className="space-y-6">
              <AdvancedValidation fields={fields} images={images} />
            </div>
          </div>
        </div>
      </div>

      {/* Image Editor Dialog */}
      <Dialog open={showImageEditor} onOpenChange={setShowImageEditor}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Edit Image
            </DialogTitle>
          </DialogHeader>
          {showImageEditor && (
            <ImageEditingTools
              imageUrl={editingImageUrl}
              onSave={handleSaveEditedImage}
              onCancel={() => setShowImageEditor(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
