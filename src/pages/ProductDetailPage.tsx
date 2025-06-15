import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, MapPin, Calendar, Package } from 'lucide-react';
import { Product } from '@/lib/types';
import ImageGallery from '@/components/products/ImageGallery';
import { useNavigate } from 'react-router-dom';
import { createOrFindConversation } from '@/utils/conversationUtils';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import { SellerContactInfo } from '@/components/seller/SellerContactInfo';
import { Seo } from "@/components/layout/Seo";

interface SellerProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  created_at: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

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
              avatar_url,
              bio,
              location,
              phone,
              email,
              website,
              created_at
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
        setSellerProfile(productData.profiles);
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
    console.log('=== MESSAGE SELLER CLICKED (DETAIL PAGE) ===');
    console.log('User:', user);
    console.log('Product:', product);
    
    if (!user) {
      console.log('No user found, redirecting to auth');
      toast({
        title: 'Login required',
        description: 'Please log in to message the seller',
        variant: 'destructive'
      });
      return;
    }

    if (!product) {
      console.log('No product found');
      return;
    }

    if (user.id === product.seller.id) {
      console.log('User trying to message themselves');
      toast({
        title: 'Cannot message yourself',
        description: 'You cannot start a conversation with yourself',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsCreatingConversation(true);
      const conversationId = await createOrFindConversation(product, user.id);
      navigate(`/conversation/${conversationId}`);
    } catch (error) {
      console.error('=== CONVERSATION CREATION ERROR (DETAIL PAGE) ===');
      console.error('Error details:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start conversation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleReviewSubmitted = () => {
    setReviewRefreshTrigger(prev => prev + 1);
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

  let seoTitle = product
    ? `${product.title} - ${product.category} | Used Market`
    : "Product Details | Used Market";
  let seoDescription = product
    ? `${product.title}: ${product.condition} condition. ${product.description?.slice(0, 120)} ${product.price ? "- Only $" + product.price : ""} | Find more on Used Market!`
    : "See details for used items on Used Market.";
  let canonicalUrl = product
    ? `https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/products/${product.id}`
    : undefined;
  let image = product?.images?.[0] || "https://lovable.dev/opengraph-image-p98pqg.png";

  // Structured data for SEO (schema.org Product)
  const productJsonLd = product
    ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": product.images,
        "description": product.description,
        "sku": product.id,
        "brand": { "@type": "Brand", "name": "Used Market" },
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "USD",
          "price": product.price,
          "availability": product.is_sold
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
          "itemCondition": `https://schema.org/${product.condition
            ?.replace(/ /g, "")
            .replace(/-/g, "")}Condition`
        },
        ...(product.seller
          ? {
              "seller": {
                "@type": "Person",
                "name": product.seller.name
              }
            }
          : {})
      }
    : undefined;

  // ----- Breadcrumb structured data -----
  const breadcrumbJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: "https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/products"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.title,
            item: canonicalUrl
          }
        ]
      }
    : undefined;

  // ----- Aggregate Rating structured data -----
  // Here you would use reviews data if available. As an example, pass down aggregateRatingJsonLd prop.
  // For now, we'll show a sample (no real data used here).
  const aggregateRatingJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.5",
          "reviewCount": "24"
        }
      }
    : undefined;

  const canReview = user && user.id !== product.seller.id && !product.is_sold;

  return (
    <Layout>
      <Seo
        title={seoTitle}
        description={seoDescription}
        image={image}
        canonicalUrl={canonicalUrl}
        jsonLd={productJsonLd}
        breadcrumbJsonLd={breadcrumbJsonLd}
        aggregateRatingJsonLd={aggregateRatingJsonLd}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images and Details */}
          <div className="lg:col-span-2 space-y-8">
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

              {/* Reviews Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                
                {canReview && (
                  <ReviewForm 
                    productId={product.id} 
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                )}
                
                <ReviewList 
                  productId={product.id} 
                  refreshTrigger={reviewRefreshTrigger}
                />
              </div>
            </div>
          </div>
          
          {/* Seller Information Sidebar */}
          <div className="space-y-6">
            {sellerProfile && (
              <SellerContactInfo seller={sellerProfile} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
