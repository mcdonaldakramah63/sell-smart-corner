
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/layout/HeroSection';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import SearchBar from '@/components/products/SearchBar';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/mockData';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  // Fetch featured products from Supabase
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        // Fetch latest 4 products with seller info
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
          .limit(4);

        if (productError) {
          console.error('Error fetching featured products:', productError);
          throw productError;
        }

        // Fetch product images for each product
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

  return (
    <>
      <HeroSection />
      
      <section className="py-12 container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Find what you need</h2>
          <SearchBar onSearch={handleSearch} />
          <CategoryFilter 
            categories={categories}
            selectedCategory={null}
            onSelectCategory={(categoryId) => {
              if (categoryId) {
                navigate(`/products?category=${encodeURIComponent(categoryId)}`);
              }
            }}
          />
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button 
              onClick={handleSeeAllProducts}
              variant="outline"
            >
              See All Products
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No products available</h3>
              <p className="text-muted-foreground">Be the first to list a product!</p>
            </div>
          )}
        </div>
      </section>
      
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-marketplace-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-marketplace-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
            <p className="text-muted-foreground">
              Sign up for free and join our trusted Used Market community.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-marketplace-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-marketplace-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Buy or Sell</h3>
            <p className="text-muted-foreground">
              List your items for sale or browse products from other users.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-marketplace-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-marketplace-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect & Complete</h3>
            <p className="text-muted-foreground">
              Chat with buyers or sellers and complete your transactions safely.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-marketplace-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users buying and selling on Used Market every day.
          </p>
          <Button asChild size="lg" className="bg-white text-marketplace-primary hover:bg-white/90">
            <a href="/auth/register">Create Your Account</a>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
