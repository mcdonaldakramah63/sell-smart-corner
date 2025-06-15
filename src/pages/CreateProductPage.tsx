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
  
  const [form, setForm] = useState<ProductForm>({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: ''
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    price?: string;
    category?: string;
    condition?: string;
    location?: string;
    images?: string;
  }>({});

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Validate title (required)
    const titleValidation = validateTextContent(form.title, { 
      minLength: 3, 
      maxLength: 100, 
      required: true 
    });
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.errors[0];
    }
    
    // Validate description (optional)
    if (form.description.trim()) {
      const descValidation = validateTextContent(form.description, { maxLength: 2000 });
      if (!descValidation.isValid) {
        newErrors.description = descValidation.errors[0];
      }
    }
    
    // Validate price (required)
    const priceValidation = validatePrice(form.price);
    if (!priceValidation.isValid) {
      newErrors.price = priceValidation.errors[0];
    }
    
    // Validate category (required)
    if (!form.category) {
      newErrors.category = 'Please select a category';
    }
    
    // Validate condition (required)
    if (!form.condition) {
      newErrors.condition = 'Please select a condition';
    }
    
    // Validate location (optional)
    if (form.location.trim()) {
      const locationValidation = validateTextContent(form.location, { maxLength: 100 });
      if (!locationValidation.isValid) {
        newErrors.location = locationValidation.errors[0];
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing valid input
    if (errors[field]) {
      let isValid = false;
      
      switch (field) {
        case 'title':
          const titleValidation = validateTextContent(value, { minLength: 3, maxLength: 100, required: true });
          isValid = titleValidation.isValid;
          break;
        case 'description':
          if (value.trim()) {
            const descValidation = validateTextContent(value, { maxLength: 2000 });
            isValid = descValidation.isValid;
          } else {
            isValid = true; // Optional field
          }
          break;
        case 'price':
          const priceValidation = validatePrice(value);
          isValid = priceValidation.isValid;
          break;
        case 'location':
          if (value.trim()) {
            const locationValidation = validateTextContent(value, { maxLength: 100 });
            isValid = locationValidation.isValid;
          } else {
            isValid = true; // Optional field
          }
          break;
        case 'category':
        case 'condition':
          isValid = value.trim() !== '';
          break;
      }
      
      if (isValid) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 5) {
      setErrors(prev => ({ ...prev, images: 'You can upload a maximum of 5 images' }));
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    files.forEach(file => {
      const validation = validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
      });
      
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(`${file.name}: ${validation.errors[0]}`);
      }
    });
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({ ...prev, images: invalidFiles[0] }));
      return;
    }
    
    setErrors(prev => ({ ...prev, images: undefined }));
    const newImages = [...images, ...validFiles];
    setImages(newImages);

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    // Clean up object URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
    setErrors(prev => ({ ...prev, images: undefined }));
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
      // Generate a unique ID for the product
      const productId = crypto.randomUUID();
      
      // Sanitize inputs
      const titleValidation = validateTextContent(form.title, { minLength: 3, maxLength: 100, required: true });
      const descValidation = validateTextContent(form.description, { maxLength: 2000 });
      const priceValidation = validatePrice(form.price);
      const locationValidation = validateTextContent(form.location, { maxLength: 100 });
      
      // Create product - using category as string value, not as category_id
      const { error: productError } = await supabase
        .from('products')
        .insert({
          id: productId,
          title: titleValidation.sanitized,
          description: descValidation.sanitized || null,
          price: priceValidation.value!,
          category_id: null, // Set to null since we don't have category UUIDs
          condition: form.condition,
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-700 font-medium">
                    Product Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter a descriptive title"
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
                    maxLength={100}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {form.title.length}/100 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-700 font-medium flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${errors.price ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item's condition, features, and any relevant details..."
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${errors.description ? 'border-red-500' : ''}`}
                  maxLength={2000}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {form.description.length}/2000 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Category *
                  </Label>
                  {categoriesLoading ? (
                    <div className="py-2 text-muted-foreground">Loading categories…</div>
                  ) : (
                    <Select 
                      value={form.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                      required
                    >
                      <SelectTrigger className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${errors.category ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Condition *
                  </Label>
                  <Select 
                    value={form.condition} 
                    onValueChange={(value) => handleInputChange('condition', value)}
                    required
                  >
                    <SelectTrigger className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${errors.condition ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && (
                    <p className="text-red-500 text-sm">{errors.condition}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700 font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={form.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${errors.location ? 'border-red-500' : ''}`}
                    maxLength={100}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm">{errors.location}</p>
                  )}
                </div>
              </div>
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
              <div className="space-y-4">
                {images.length < 5 && (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
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

                {errors.images && (
                  <p className="text-red-500 text-sm">{errors.images}</p>
                )}

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border shadow-sm"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            Main
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
