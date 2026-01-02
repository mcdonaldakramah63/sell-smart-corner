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
import { Eye, TrendingUp, Star, ArrowRight, Loader2 } from 'lucide-react';

const fetchFeaturedProducts = async (limit: number): Promise<Product[]> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (productsError) throw productsError;

    const productIds = productsData?.map(p => p.id) || [];
    const { data: imagesData } = await supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds);

    const categoryIds = productsData?.map(p => p.category_id).filter(Boolean) || [];
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .in('id', categoryIds);

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
    
    const { count: activeListings } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .eq('is_sold', false);

    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

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
    refetchInterval: 60000
  });

  const filteredProducts = products.filter((product: Product) => 
    !selectedCategory || product.category === categories.find((c: Category) => c.id === selectedCategory)?.name
  );

  const stats = [
    { label: 'Active Listings', value: formatNumber(statsData?.activeListings || 0), icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { label: 'Happy Users', value: formatNumber(statsData?.happyUsers || 0), icon: Star, color: 'from-amber-500 to-orange-500' },
    { label: 'Total Views', value: formatNumber(statsData?.dailyVisits || 0), icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <HeroSection />
        
        {/* Stats Section */}
        <div className="py-12 md:py-20 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary-glow/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="stat-card group animate-slide-up-fade hover:shadow-elegant"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 md:mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1.5 group-hover:scale-105 transition-transform duration-300">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
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
        <div className="container mx-auto px-4 py-10 md:py-16">
          {/* Section Header */}
          <div className="mb-10 md:mb-12 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="section-title relative inline-block">
                  {selectedCategory 
                    ? `${categories.find((c: Category) => c.id === selectedCategory)?.name}` 
                    : 'Latest Listings'}
                  <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full" />
                </h2>
                <p className="section-subtitle mt-4">
                  {productsLoading
                    ? "Loading amazing items..."
                    : `${filteredProducts.length} items available`}
                </p>
              </div>
              
              {!selectedCategory && (
                <Button 
                  variant="outline" 
                  className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 font-medium group self-start sm:self-auto transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/products')}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className="marketplace-card p-3 md:p-4 animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <Skeleton className="w-full aspect-square rounded-xl mb-3 md:mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-fade-in">
              <ProductGrid products={filteredProducts} />
            </div>
          )}

          {/* Load More Button */}
          {!productsLoading && filteredProducts.length > 0 && filteredProducts.length >= itemsToShow && (
            <div className="text-center mt-14 md:mt-20 animate-fade-in">
              <Button 
                size="lg"
                className="gradient-primary text-primary-foreground font-semibold px-10 py-7 rounded-2xl shadow-elegant hover:shadow-glow transition-all duration-500 hover:scale-105 group hover-shine"
                onClick={() => setItemsToShow(prev => prev + 20)}
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin hidden" />
                Load More Items
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
