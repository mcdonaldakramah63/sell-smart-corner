
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/layout/HeroSection';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import { Product, Category } from '@/lib/types';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Star } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch featured products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, is_primary),
          categories(name)
        `)
        .eq('is_active', true)
        .limit(20);

      if (error) throw error;

      return data?.map((product): Product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        location: product.location,
        createdAt: product.created_at,
        images: product.product_images?.map((img: any) => img.image_url) || [],
        category: product.categories?.name,
        condition: product.condition,
        isSold: product.is_sold
      })) || [];
    }
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return data?.map((category): Category => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
        description: category.description
      })) || [];
    }
  });

  const filteredProducts = products.filter(product => 
    !selectedCategory || product.category === categories.find(c => c.id === selectedCategory)?.name
  );

  const stats = [
    { label: 'Active Listings', value: '50,000+', icon: Eye },
    { label: 'Happy Users', value: '2M+', icon: Star },
    { label: 'Daily Visits', value: '100K+', icon: TrendingUp },
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
                    ? `${categories.find(c => c.id === selectedCategory)?.name} Items` 
                    : 'Latest Items'}
                </h2>
                <p className="text-gray-600">
                  {productsLoading
                    ? "Loading..."
                    : `${filteredProducts.length} items found`}
                </p>
              </div>
              
              {!selectedCategory && (
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
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
          {!productsLoading && filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
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
