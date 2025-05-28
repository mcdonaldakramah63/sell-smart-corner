
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImagePlus, Trash2, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

type Category = {
  id: string;
  name: string;
};

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  
  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive'
        });
      } finally {
        setFetchingCategories(false);
      }
    };
    
    fetchCategories();
  }, [toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files);
    setImages(prev => [...prev, ...newFiles]);
    
    // Create temporary preview URLs
    newFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setImageUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index]);
    
    setImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    setImageUrls(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a product listing',
        variant: 'destructive'
      });
      return;
    }
    
    if (images.length === 0) {
      toast({
        title: 'Images required',
        description: 'Please upload at least one image',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Create product with both user_id and seller_id
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title,
          description,
          price: parseFloat(price),
          user_id: user.id,
          seller_id: user.id,
          category_id: categoryId,
          condition,
          location
        })
        .select()
        .single();
      
      if (productError) throw productError;
      
      // Upload images
      const imagePromises = images.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        // Store image reference in database
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: data.publicUrl,
          is_primary: index === 0 // First image is primary
        });
        
        return data.publicUrl;
      });
      
      await Promise.all(imagePromises);
      
      toast({
        title: 'Success',
        description: 'Your product has been listed',
      });
      
      navigate(`/product/${product.id}`);
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product listing',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
          {/* Product Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Details</h2>
            
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you selling?"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item in detail"
                required
                className="mt-1"
                rows={5}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select value={condition} onValueChange={setCondition} required>
                  <SelectTrigger id="condition" className="mt-1">
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
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required disabled={fetchingCategories}>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder={fetchingCategories ? "Loading categories..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where is the item located?"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          {/* Product Images */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Images</h2>
            <p className="text-sm text-muted-foreground">
              Upload at least one image. The first image will be the cover image.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {imageUrls.map((url, index) => (
                <Card key={index} className="relative group">
                  <CardContent className="p-0">
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute top-0 left-0 bg-primary text-white px-2 py-1 text-xs rounded-br">
                        Cover
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {/* Image upload button */}
              <Card className="border-dashed">
                <CardContent className="p-0">
                  <Label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 cursor-pointer"
                  >
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    <span className="mt-2 text-sm text-muted-foreground">
                      Add Image
                    </span>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </Label>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creating listing...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
