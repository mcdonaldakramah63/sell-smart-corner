import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/layout/HeroSection';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import { Product, Category } from '@/lib/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Star } from 'lucide-react';

// Simplified fetch function without complex Supabase types
const fetchFeaturedProducts = async (limit: number): Promise<Product[]> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Simple query without joins to avoid type issues
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (productsError) throw productsError;

    // Fetch images separately to avoid complex joins
    const productIds = productsData?.map(p => p.id) || [];
    const { data: imagesData } = await supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds);

    // Fetch categories separately
    const categoryIds = productsData?.map(p => p.category_id).filter(Boolean) || [];
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .in('id', categoryIds);

    // Map the data manually
    const products: Product[] = productsData?.map((product: any) => {
      const productImages = imagesData?.filter(img => img.product_id === product.id) || [];
      const category = categoriesData?.find(cat => cat.id === product.category_id);
      
      return {
        id: product.id,
        title: product.title || '',
        description: product.description || '',
        price: Number(product.price) || 0,
        location: product.location || '',
        createdAt: product.created_at,
        images: productImages.map(img => img.image_url),
        category: category?.name || '',
        condition: product.condition as 'new' | 'like-new' | 'good' | 'fair' | 'poor',
        seller: {
          id: product.user_id,
          name: 'Anonymous',
          avatar: ''
        },
        is_sold: product.is_sold || false
      };
    }) || [];

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, icon');

    if (error) throw error;

    const categories: Category[] = data?.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon || ''
    })) || [];

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const fetchStats = async () => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Fetch active listings count
    const { count: activeListings } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .eq('is_sold', false);

    // Fetch total users count
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Fetch total product views as daily visits proxy
    const { data: viewsData } = await supabase
      .from('products')
      .select('view_count');
    
    const totalViews = viewsData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;

    return {
      activeListings: activeListings || 0,
      happyUsers: totalUsers || 0,
      dailyVisits: totalViews
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { activeListings: 0, happyUsers: 0, dailyVisits: 0 };
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
  return num.toString();
};

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [itemsToShow, setItemsToShow] = useState(100);

  // Auto-refresh products every 30 seconds
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products', itemsToShow],
    queryFn: () => fetchFeaturedProducts(itemsToShow),
    refetchInterval: 30000,
    refetchIntervalInBackground: true
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: statsData } = useQuery({
    queryKey: ['homepage-stats'],
    queryFn: fetchStats,
    refetchInterval: 60000 // Refresh stats every minute
  });

  const filteredProducts = products.filter((product: Product) => 
    !selectedCategory || product.category === categories.find((c: Category) => c.id === selectedCategory)?.name
  );

  const stats = [
    { label: 'Active Listings', value: formatNumber(statsData?.activeListings || 0), icon: Eye },
    { label: 'Happy Users', value: formatNumber(statsData?.happyUsers || 0), icon: Star },
    { label: 'Total Views', value: formatNumber(statsData?.dailyVisits || 0), icon: TrendingUp },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <HeroSection />
        
        {/* Stats Section - Jiji Style */}
        <div className="bg-white py-12 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <stat.icon className="h-8 w-8 text-blue-600 mb-3" />
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          loading={categoriesLoading}
        />

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedCategory 
                    ? `${categories.find((c: Category) => c.id === selectedCategory)?.name} Items` 
                    : 'Latest Items'}
                </h2>
                <p className="text-gray-600">
                  {productsLoading
                    ? "Loading..."
                    : `${filteredProducts.length} items found`}
                </p>
              </div>
              
              {!selectedCategory && (
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate('/products')}
                >
                  View All Categories
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                  <Skeleton className="w-full aspect-square mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}

          {/* Load More Button */}
          {!productsLoading && filteredProducts.length > 0 && filteredProducts.length >= itemsToShow && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
                onClick={() => setItemsToShow(prev => prev + 20)}
              >
                Load More Items
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;