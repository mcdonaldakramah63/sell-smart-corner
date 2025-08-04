
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { AdvancedSearchModal } from '@/components/search/AdvancedSearchModal';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface AdvancedSearchFilters {
  query?: string;
  categoryId?: string;
  locationId?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'price' | 'created_at' | 'title' | 'view_count';
  sortOrder?: 'asc' | 'desc';
  hasImages?: boolean;
  isVerifiedSeller?: boolean;
  hasPremiumAd?: boolean;
}

const AdvancedSearchPage = () => {
  const { results, loading, totalCount, filters, searchProducts, debouncedSearch } = useAdvancedSearch();
  const [currentPage, setCurrentPage] = useState(0);

  const handleSearch = (searchFilters: AdvancedSearchFilters) => {
    setCurrentPage(0);
    searchProducts(searchFilters, 0);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchProducts(filters, nextPage);
  };

  const clearFilter = (filterKey: keyof AdvancedSearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    handleSearch(newFilters);
  };

  const getFilterLabel = (key: string, value: any): string => {
    switch (key) {
      case 'query':
        return `"${value}"`;
      case 'priceMin':
        return `Min: GHS ${value}`;
      case 'priceMax':
        return `Max: GHS ${value}`;
      case 'condition':
        return `Condition: ${value}`;
      case 'sortBy':
        return `Sort: ${value}`;
      case 'sortOrder':
        return value === 'asc' ? 'Ascending' : 'Descending';
      case 'hasImages':
        return 'Has Images';
      case 'isVerifiedSeller':
        return 'Verified Sellers';
      case 'hasPremiumAd':
        return 'Premium Ads';
      default:
        return String(value);
    }
  };

  const activeFilters = Object.entries(filters).filter(([key, value]) => 
    value !== undefined && value !== '' && value !== false
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Advanced Search</h1>
            <AdvancedSearchModal onSearch={handleSearch} initialFilters={filters} />
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Active Filters ({activeFilters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="flex items-center gap-1">
                      {getFilterLabel(key, value)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 hover:bg-transparent"
                        onClick={() => clearFilter(key as keyof AdvancedSearchFilters)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {loading ? 'Searching...' : `${totalCount} results found`}
            </span>
            {results.length > 0 && (
              <span>
                Showing {results.length} of {totalCount} products
              </span>
            )}
          </div>
        </div>

        {/* Search Results */}
        {loading && results.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : results.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse our categories
              </p>
              <AdvancedSearchModal onSearch={handleSearch} initialFilters={filters} />
            </CardContent>
          </Card>
        ) : (
          <>
            <ProductGrid products={results.map(result => ({
              id: result.id,
              title: result.title,
              description: result.description,
              price: result.price,
              location: result.location,
              created_at: result.created_at,
              view_count: result.view_count,
              user_id: result.user_id,
              product_images: result.images,
              premium_ad_type: result.premium_ad_type,
              seller_rating: result.seller_rating,
              is_verified_seller: result.is_verified_seller
            }))} />

            {/* Load More */}
            {results.length < totalCount && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                  className="px-8"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More Results'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdvancedSearchPage;
