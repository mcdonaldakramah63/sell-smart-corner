import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/layout/HeroSection';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import SearchBar from '@/components/products/SearchBar';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Seo } from "@/components/layout/Seo";
import { useFeaturedProducts } from "@/hooks/products/useFeaturedProducts";
import FeaturedProductsSection from "@/components/products/sections/FeaturedProductsSection";
import HowItWorksSection from "@/components/products/sections/HowItWorksSection";
import CallToActionSection from "@/components/products/sections/CallToActionSection";

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
          .limit(4);

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
        title="Used Market - Buy & Sell Used Items Online"
        description="Find and sell secondhand goods on Used Market, a trusted secure online marketplace. Discover electronics, furniture, clothing and more in your local area!"
        keywords="used marketplace, buy sell used items, secondhand, pre-owned, classified ads, local online marketplace"
        canonicalUrl="https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/"
        image="https://lovable.dev/opengraph-image-p98pqg.png"
        breadcrumbJsonLd={breadcrumbJsonLd}
      />
      <HeroSection />
      <section className="py-12 container mx-auto px-4">
        {/* Search and categories */}
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
            loading={categoriesLoading}
          />
        </div>
      </section>
      <FeaturedProductsSection products={featuredProducts2} loading={loading2} />
      <HowItWorksSection />
      <CallToActionSection />
    </Layout>
  );
};

export default Index;
