
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/layout/HeroSection';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import SearchBar from '@/components/products/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Seo } from "@/components/layout/Seo";
import { useFeaturedProducts } from "@/hooks/products/useFeaturedProducts";
import FeaturedProductsSection from "@/components/products/sections/FeaturedProductsSection";
import HowItWorksSection from "@/components/products/sections/HowItWorksSection";
import CallToActionSection from "@/components/products/sections/CallToActionSection";
import { Truck, Shield, Headphones, RotateCcw, Star, TrendingUp, Clock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const handleSeeAllProducts = () => {
    navigate('/products');
  };
  
  const handleSearch = (query: string) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/"
      }
    ]
  };

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            profiles (
              id,
              username,
              full_name,
              avatar_url
            )
          `)
          .eq('is_sold', false)
          .order('created_at', { ascending: false })
          .limit(12);

        if (productError) {
          console.error('Error fetching featured products:', productError);
          throw productError;
        }

        const productsWithImages = await Promise.all(
          (productData || []).map(async (product) => {
            const { data: imageData } = await supabase
              .from('product_images')
              .select('image_url')
              .eq('product_id', product.id)
              .order('is_primary', { ascending: false });

            return {
              id: product.id,
              title: product.title,
              description: product.description || '',
              price: parseFloat(product.price.toString()),
              images: imageData ? imageData.map(img => img.image_url) : [],
              category: product.category_id || 'other',
              condition: (product.condition || 'good') as Product['condition'],
              seller: {
                id: product.profiles?.id || '',
                name: product.profiles?.full_name || product.profiles?.username || 'Unknown',
                avatar: product.profiles?.avatar_url || undefined
              },
              createdAt: product.created_at,
              location: product.location || '',
              is_sold: product.is_sold
            } as Product;
          })
        );

        setFeaturedProducts(productsWithImages);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load featured products',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [toast]);

  const { featuredProducts: featuredProducts2, loading: loading2 } = useFeaturedProducts(4);

  return (
    <Layout>
      <Seo
        title="MarketHub - Buy & Sell Online | Best Deals & Quality Products"
        description="Discover amazing deals on electronics, fashion, home goods and more. Join millions of buyers and sellers on MarketHub - your trusted online marketplace."
        keywords="online marketplace, buy sell online, electronics deals, fashion, home goods, second hand, new products"
        canonicalUrl="https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/"
        image="https://lovable.dev/opengraph-image-p98pqg.png"
        breadcrumbJsonLd={breadcrumbJsonLd}
      />
      
      <HeroSection />

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-1">Buyer Protection</h3>
              <p className="text-sm text-gray-600">Secure transactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <Headphones className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold mb-1">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <RotateCcw className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 text-center">
            <Badge className="bg-yellow-400 text-black px-3 py-1 font-bold animate-pulse">
              FLASH SALE
            </Badge>
            <span className="font-semibold">Up to 70% OFF - Limited Time Only!</span>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="font-mono">12:34:56</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Find What You're Looking For</h2>
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <CategoryFilter
            categories={categories}
            selectedCategory={null}
            onSelectCategory={(categoryId) => {
              if (categoryId) {
                navigate(`/products?category=${encodeURIComponent(categoryId)}`);
              }
            }}
            loading={categoriesLoading}
          />
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <h2 className="text-3xl font-bold">Trending Now</h2>
            </div>
            <Button variant="outline" onClick={handleSeeAllProducts}>
              View All
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>

      <FeaturedProductsSection products={featuredProducts2} loading={loading2} />
      <HowItWorksSection />
      <CallToActionSection />
    </Layout>
  );
};

export default Index;
