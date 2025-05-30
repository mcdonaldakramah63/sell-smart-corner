import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, MapPin, Calendar, Package } from 'lucide-react';
import { Product } from '@/lib/types';
import ImageGallery from '@/components/products/ImageGallery';
import { useNavigate } from 'react-router-dom';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch product with category and seller information
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            ),
            profiles!products_seller_id_fkey (
              id,
              full_name,
              username,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();
        
        if (productError) throw productError;
        
        // Fetch product images
        const { data: imageData, error: imageError } = await supabase
          .from('product_images')
          .select('image_url, is_primary')
          .eq('product_id', id)
          .order('is_primary', { ascending: false })
          .order('created_at', { ascending: true });
        
        if (imageError) throw imageError;
        
        const formattedProduct: Product = {
          id: productData.id,
          title: productData.title,
          description: productData.description || '',
          price: productData.price,
          images: imageData?.map(img => img.image_url) || [],
          category: productData.categories?.name || 'Uncategorized',
          condition: (productData.condition || 'good') as Product['condition'],
          seller: {
            id: productData.profiles?.id || '',
            name: productData.profiles?.full_name || productData.profiles?.username || 'Unknown Seller',
            avatar: productData.profiles?.avatar_url || undefined
          },
          createdAt: productData.created_at,
          location: productData.location || '',
          is_sold: productData.is_sold || false
        };
        
        setProduct(formattedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? 'Removed from favorites' : 'Added to favorites',
      description: liked ? 'Product removed from your favorites' : 'Product added to your favorites'
    });
  };

  const handleMessage = async () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to message the seller',
        variant: 'destructive'
      });
      return;
    }

    if (!product) return;

    if (user.id === product.seller.id) {
      toast({
        title: 'Cannot message yourself',
        description: 'You cannot start a conversation with yourself',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsCreatingConversation(true);
      console.log('Starting conversation creation for product:', product.id);

      // Check if conversation already exists between these two users for this product
      const { data: existingConversations, error: searchError } = await supabase
        .from('conversations')
        .select(`
          id,
          conversation_participants!inner(user_id)
        `)
        .eq('product_id', product.id);

      if (searchError) {
        console.error('Error searching for existing conversations:', searchError);
        throw searchError;
      }

      console.log('Existing conversations found:', existingConversations);

      // Find a conversation that has both users as participants
      let existingConversationId = null;
      if (existingConversations && existingConversations.length > 0) {
        for (const conv of existingConversations) {
          // Get all participants for this conversation
          const { data: participants, error: participantsError } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.id);

          if (participantsError) continue;

          const participantIds = participants?.map(p => p.user_id) || [];
          
          // Check if both current user and seller are participants
          if (participantIds.includes(user.id) && participantIds.includes(product.seller.id)) {
            existingConversationId = conv.id;
            break;
          }
        }
      }

      if (existingConversationId) {
        console.log('Found existing conversation:', existingConversationId);
        navigate(`/conversation/${existingConversationId}`);
        return;
      }

      console.log('Creating new conversation...');
      // Create new conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          product_id: product.id
        })
        .select('id')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }

      console.log('New conversation created:', newConversation.id);

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: newConversation.id, user_id: user.id },
          { conversation_id: newConversation.id, user_id: product.seller.id }
        ]);

      if (participantsError) {
        console.error('Error adding participants:', participantsError);
        throw participantsError;
      }

      console.log('Participants added successfully');

      // Navigate to conversation
      navigate(`/conversation/${newConversation.id}`);
    } catch (error) {
      console.error('Error in handleMessage:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingConversation(false);
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
            <p className="text-muted-foreground mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
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
          <div>
            <ImageGallery images={product.images} />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                {product.is_sold && (
                  <Badge variant="secondary">Sold</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Package size={16} />
                  <span>{product.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
                {product.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{product.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <Badge variant="outline" className="ml-2">
                  {product.condition}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={handleLike}>
                  <Heart 
                    size={20} 
                    className={liked ? "fill-red-500 text-red-500" : ""}
                  />
                </Button>
                <Button 
                  onClick={handleMessage} 
                  disabled={product.is_sold || isCreatingConversation || user?.id === product.seller.id}
                >
                  {isCreatingConversation ? (
                    <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                  ) : (
                    <MessageCircle size={20} className="mr-2" />
                  )}
                  {user?.id === product.seller.id ? 'Your Listing' : 'Message Seller'}
                </Button>
              </div>
            </div>
            
            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    {product.seller.avatar ? (
                      <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                    ) : (
                      <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{product.seller.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Member since {new Date(product.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Product Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
