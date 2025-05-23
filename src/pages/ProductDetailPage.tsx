
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Heart, Share2, AlertTriangle } from 'lucide-react';
import ImageGallery from '@/components/products/ImageGallery';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [sellerProfile, setSellerProfile] = useState<{
    id: string;
    name: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*, category:categories(name, id, slug)')
          .eq('id', id)
          .single();
        
        if (productError) throw productError;
        
        // Fetch product images
        const { data: imageData, error: imageError } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', id)
          .order('is_primary', { ascending: false });
        
        if (imageError) throw imageError;
        
        // Fetch seller profile
        const { data: sellerData, error: sellerError } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .eq('id', productData.seller_id)
          .single();
        
        if (sellerError) throw sellerError;
        
        setSellerProfile({
          id: sellerData.id,
          name: sellerData.full_name || sellerData.username,
          avatar: sellerData.avatar_url
        });
        
        setProduct({
          id: productData.id,
          title: productData.title,
          description: productData.description,
          price: productData.price,
          images: imageData.map(img => img.image_url),
          category: productData.category?.name || 'Uncategorized',
          condition: productData.condition,
          seller: {
            id: sellerData.id,
            name: sellerData.full_name || sellerData.username,
            avatar: sellerData.avatar_url
          },
          createdAt: productData.created_at,
          location: productData.location
        });
        
        setImages(imageData.map(img => img.image_url));
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id, toast]);

  const startConversation = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please log in to contact the seller',
        variant: 'destructive'
      });
      return;
    }
    
    if (user?.id === product?.seller.id) {
      toast({
        description: 'This is your own listing',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Check if a conversation already exists
      const { data: existingConvo, error: convoError } = await supabase
        .from('conversations')
        .select('id, conversation_participants!inner(*)')
        .eq('product_id', id)
        .filter('conversation_participants.user_id', 'eq', user?.id);
      
      if (convoError) throw convoError;
      
      let conversationId;
      
      if (existingConvo && existingConvo.length > 0) {
        conversationId = existingConvo[0].id;
      } else {
        // Create new conversation
        const { data: newConvo, error: createError } = await supabase
          .from('conversations')
          .insert({
            product_id: id
          })
          .select()
          .single();
        
        if (createError) throw createError;
        
        conversationId = newConvo.id;
        
        // Add conversation participants
        await supabase.from('conversation_participants').insert([
          { conversation_id: conversationId, user_id: user?.id },
          { conversation_id: conversationId, user_id: product?.seller.id }
        ]);
        
        // Create notification for seller
        await supabase.from('notifications').insert({
          user_id: product?.seller.id,
          type: 'message',
          content: `Someone is interested in your "${product?.title}" listing`,
          action_url: `/conversation/${conversationId}`
        });
      }
      
      // Navigate to conversation
      window.location.href = `/conversation/${conversationId}`;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="mb-6">The product you are looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-lg overflow-hidden">
            <ImageGallery images={images} />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl font-semibold text-primary mb-4">${parseFloat(product.price.toString()).toFixed(2)}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge>{product.condition}</Badge>
              <Badge variant="outline">{product.category}</Badge>
              {product.location && (
                <Badge variant="secondary">{product.location}</Badge>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {product.seller.avatar ? (
                      <img 
                        src={product.seller.avatar} 
                        alt={product.seller.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold">
                        {product.seller.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{product.seller.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Listed {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={startConversation} 
                className="flex-1"
                disabled={user?.id === product.seller.id}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {user?.id === product.seller.id ? 'Your Listing' : 'Contact Seller'}
              </Button>
              
              <Button variant="outline" className="px-4">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
              
              <Button variant="outline" className="px-4">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
              
              <Button variant="outline" className="px-4" asChild>
                <Link to="#" className="flex items-center">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="sr-only">Report</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
