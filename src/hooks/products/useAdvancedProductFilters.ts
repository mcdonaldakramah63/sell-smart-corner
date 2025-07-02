
import { useState, useMemo } from "react";
import { Product } from "@/lib/types";

export function useAdvancedProductFilters(products: Product[], initial: {
  category?: string | null;
  searchQuery?: string;
  location?: string;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initial.category || null
  );
  const [searchQuery, setSearchQuery] = useState(initial.searchQuery || "");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [condition, setCondition] = useState<string | null>(null);
  const [location, setLocation] = useState(initial.location || "");
  const [region, setRegion] = useState("All Regions");
  const [isNegotiable, setIsNegotiable] = useState<boolean | null>(null);
  const [dateRange, setDateRange] = useState("all");

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!product.title.toLowerCase().includes(query) &&
              !product.description.toLowerCase().includes(query)) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory && product.category !== selectedCategory) {
          return false;
        }

        // Condition filter
        if (condition && product.condition !== condition) {
          return false;
        }

        // Price range filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }

        // Location filter
        if (location && !product.location.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }

        // Region filter (simplified - in real app, you'd have region data)
        if (region !== 'All Regions') {
          // This would need proper region mapping in a real app
          if (!product.location.toLowerCase().includes(region.toLowerCase())) {
            return false;
          }
        }

        // Date range filter
        if (dateRange !== 'all') {
          const productDate = new Date(product.createdAt);
          const now = new Date();
          const diffTime = now.getTime() - productDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          switch (dateRange) {
            case 'today':
              if (diffDays > 1) return false;
              break;
            case 'week':
              if (diffDays > 7) return false;
              break;
            case 'month':
              if (diffDays > 30) return false;
              break;
            case '3months':
              if (diffDays > 90) return false;
              break;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "oldest":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case "price_low":
            return a.price - b.price;
          case "price_high":
            return b.price - a.price;
          case "relevance":
            // Simple relevance scoring based on search query matches
            if (!searchQuery) return 0;
            const aRelevance = (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                             (a.description.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
            const bRelevance = (b.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                             (b.description.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
            return bRelevance - aRelevance;
          case "distance":
            // In a real app, this would calculate actual distance
            return 0;
          default:
            return 0;
        }
      });
  }, [products, searchQuery, selectedCategory, condition, priceRange, location, region, isNegotiable, dateRange, sortBy]);

  const handleReset = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setSortBy("newest");
    setPriceRange([0, 5000]);
    setCondition(null);
    setLocation("");
    setRegion("All Regions");
    setIsNegotiable(null);
    setDateRange("all");
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory,
    condition,
    location,
    region !== 'All Regions' ? region : null,
    isNegotiable !== null ? 'negotiable' : null,
    dateRange !== 'all' ? dateRange : null,
  ].filter(Boolean).length;

  return {
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
    location,
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
  };
}
