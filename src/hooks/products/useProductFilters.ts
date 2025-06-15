
import { useState } from "react";

export function useProductFilters(initial: {
  category?: string | null;
  searchQuery?: string;
  sortBy?: string;
  priceRange?: [number, number];
  condition?: string | null;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initial.category || null
  );
  const [searchQuery, setSearchQuery] = useState(initial.searchQuery || "");
  const [sortBy, setSortBy] = useState(initial.sortBy || "newest");
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initial.priceRange || [0, 5000]
  );
  const [condition, setCondition] = useState<string | null>(
    initial.condition || null
  );
  const handleReset = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setSortBy("newest");
    setPriceRange([0, 5000]);
    setCondition(null);
  };

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
    handleReset,
  };
}
