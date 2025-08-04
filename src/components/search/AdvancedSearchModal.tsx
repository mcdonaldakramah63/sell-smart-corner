
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Filter, Search } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

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

interface AdvancedSearchModalProps {
  onSearch: (filters: AdvancedSearchFilters) => void;
  initialFilters?: AdvancedSearchFilters;
}

export const AdvancedSearchModal = ({ onSearch, initialFilters = {} }: AdvancedSearchModalProps) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<AdvancedSearchFilters>(initialFilters);
  const [priceRange, setPriceRange] = useState([filters.priceMin || 0, filters.priceMax || 10000]);
  const { categories } = useCategories();

  const handleFilterChange = (key: keyof AdvancedSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    setFilters(prev => ({
      ...prev,
      priceMin: value[0],
      priceMax: value[1]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
    setOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters = { query: filters.query };
    setFilters(clearedFilters);
    setPriceRange([0, 10000]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search Query */}
          <div className="md:col-span-2">
            <Label htmlFor="search-query">Search Keywords</Label>
            <Input
              id="search-query"
              placeholder="Enter keywords..."
              value={filters.query || ''}
              onChange={(e) => handleFilterChange('query', e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={filters.categoryId} onValueChange={(value) => handleFilterChange('categoryId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div>
            <Label>Condition</Label>
            <Select value={filters.condition} onValueChange={(value) => handleFilterChange('condition', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Condition</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like_new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="md:col-span-2">
            <Label>Price Range (GHS {priceRange[0]} - GHS {priceRange[1]})</Label>
            <div className="mt-4 mb-6">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={10000}
                step={50}
                className="w-full"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label htmlFor="date-from">Posted From</Label>
            <Input
              id="date-from"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="date-to">Posted To</Label>
            <Input
              id="date-to"
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>

          {/* Sort Options */}
          <div>
            <Label>Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Posted</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="view_count">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sort Order</Label>
            <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Checkboxes */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-images"
                checked={filters.hasImages || false}
                onCheckedChange={(checked) => handleFilterChange('hasImages', checked)}
              />
              <Label htmlFor="has-images">Only show items with images</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified-seller"
                checked={filters.isVerifiedSeller || false}
                onCheckedChange={(checked) => handleFilterChange('isVerifiedSeller', checked)}
              />
              <Label htmlFor="verified-seller">Only verified sellers</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="premium-ads"
                checked={filters.hasPremiumAd || false}
                onCheckedChange={(checked) => handleFilterChange('hasPremiumAd', checked)}
              />
              <Label htmlFor="premium-ads">Only premium ads</Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
