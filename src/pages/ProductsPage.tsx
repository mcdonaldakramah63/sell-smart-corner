import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Seo } from "@/components/layout/Seo";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { useCategories } from '@/hooks/useCategories';
import { useProductsData } from '@/hooks/products/useProductsData';
import { useProductFilters } from '@/hooks/products/useProductFilters';
import ProductFilters from '@/components/products/filters/ProductFilters';
import ProductsContent from '@/components/products/ProductsContent';
import { useToast } from '@/hooks/use-toast';

const ProductsPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const searchParam = queryParams.get('search');

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
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/products"
      }
    ]
  };

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();

  const { allProducts, loading } = useProductsData();
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    condition,
    setCondition,
    handleReset,
  } = useProductFilters({
    category: categoryParam,
    searchQuery: searchParam,
  });

  // Filtering logic
  const filteredProducts = allProducts
    .filter(product =>
      (!searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(product =>
      !selectedCategory || product.category === selectedCategory
    )
    .filter(product =>
      !condition || product.condition === condition
    )
    .filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "price_low") {
        return a.price - b.price;
      } else if (sortBy === "price_high") {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <Layout>
      <Seo
        title="Browse Used Products For Sale | Used Market"
        description="Browse hundreds of used products, from electronics to furniture. Filter listings by category, price, condition, and location. Discover great deals near you."
        keywords="used products, buy used, sell used, secondhand goods, classifieds, online marketplace, electronics, furniture"
        canonicalUrl="https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/products"
        breadcrumbJsonLd={breadcrumbJsonLd}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Products</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Left Side */}
          <div className="w-full md:w-1/4 space-y-6">
            <ProductFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              condition={condition}
              setCondition={setCondition}
              sortBy={sortBy}
              setSortBy={setSortBy}
              handleReset={handleReset}
            />
          </div>
          {/* Product Content - Right Side */}
          <div className="w-full md:w-3/4">
            <ProductsContent
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoriesLoading={categoriesLoading}
              filteredProducts={filteredProducts}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
