import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdvancedSearchModal } from './AdvancedSearchModal';

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: string;
  setLocation: (location: string) => void;
  onSearch: () => void;
  activeFiltersCount: number;
  onToggleFilters: () => void;
  showFilters: boolean;
  // Add these new props for advanced search
  priceRange?: [number, number];
  setPriceRange?: (range: [number, number]) => void;
  condition?: string | null;
  setCondition?: (condition: string | null) => void;
  selectedCategory?: string | null;
  setSelectedCategory?: (category: string | null) => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
}

export function SearchHeader({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  onSearch,
  activeFiltersCount,
  onToggleFilters,
  showFilters,
  priceRange = [0, 5000],
  setPriceRange = () => {},
  condition = null,
  setCondition = () => {},
  selectedCategory = null,
  setSelectedCategory = () => {},
  sortBy = 'newest',
  setSortBy = () => {}
}: SearchHeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border p-3 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="relative md:w-64">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button type="submit" className="px-8 w-full md:w-auto">
            Search
          </Button>
        </div>

        {/* Filter Toggle and Advanced Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onToggleFilters}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <AdvancedSearchModal
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              location={location}
              setLocation={setLocation}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              condition={condition}
              setCondition={setCondition}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onApplyFilters={onSearch}
            />
          </div>

          <div className="hidden sm:block text-sm text-muted-foreground">
            Use filters to narrow down your search results
          </div>
        </div>
      </form>
    </div>
  );
}
