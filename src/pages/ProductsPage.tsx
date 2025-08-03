
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Seo } from "@/components/layout/Seo";
import { useCategories } from '@/hooks/useCategories';
import { useProductsData } from '@/hooks/products/useProductsData';
import { useAdvancedProductFilters } from '@/hooks/products/useAdvancedProductFilters';
import AdvancedFilters from '@/components/products/filters/AdvancedFilters';
import { SearchHeader } from '@/components/products/search/SearchHeader';
import ProductsContent from '@/components/products/ProductsContent';
import { useToast } from '@/hooks/use-toast';

const ProductsPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const searchParam = queryParams.get('search');
  const locationParam = queryParams.get('location');

  const [showFilters, setShowFilters] = useState(true);

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

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
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
    location: filterLocation,
    setLocation,
    region,
    setRegion,
    isNegotiable,
    setIsNegotiable,
    dateRange,
    setDateRange,
    handleReset,
    filteredProducts,
    activeFiltersCount,
  } = useAdvancedProductFilters(allProducts, {
    category: categoryParam,
    searchQuery: searchParam,
    location: locationParam,
  });

  const handleSearch = () => {
    // Search is handled automatically by the filter hook
    toast({
      title: "Search Updated",
      description: `Found ${filteredProducts.length} products`,
    });
  };

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
        
        {/* Enhanced Search Header */}
        <SearchHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          location={filterLocation}
          setLocation={setLocation}
          onSearch={handleSearch}
          activeFiltersCount={activeFiltersCount}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          condition={condition}
          setCondition={setCondition}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Advanced Filters - Left Side */}
          {showFilters && (
            <div className="w-full lg:w-1/4">
              <AdvancedFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                condition={condition}
                setCondition={setCondition}
                sortBy={sortBy}
                setSortBy={setSortBy}
                location={filterLocation}
                setLocation={setLocation}
                region={region}
                setRegion={setRegion}
                isNegotiable={isNegotiable}
                setIsNegotiable={setIsNegotiable}
                dateRange={dateRange}
                setDateRange={setDateRange}
                handleReset={handleReset}
              />
            </div>
          )}
          
          {/* Product Content - Right Side */}
          <div className={`w-full ${showFilters ? 'lg:w-3/4' : 'lg:w-full'}`}>
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
