
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Heart } from "lucide-react";
import { useCategories } from '@/hooks/useCategories';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useToast } from '@/hooks/use-toast';

interface AdvancedSearchModalProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: string;
  setLocation: (location: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  condition: string | null;
  setCondition: (condition: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onApplyFilters: () => void;
}

export function AdvancedSearchModal({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  priceRange,
  setPriceRange,
  condition,
  setCondition,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onApplyFilters
}: AdvancedSearchModalProps) {
  const [open, setOpen] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const { data: categories = [] } = useCategories();
  const { saveSearch, loading } = useSavedSearches();
  const { toast } = useToast();

  const handleSaveSearch = async () => {
    if (!saveSearchName.trim()) {
      toast({
        title: "Search name required",
        description: "Please enter a name for your saved search.",
        variant: "destructive"
      });
      return;
    }

    const searchData = {
      search_name: saveSearchName,
      search_query: searchQuery,
      filters: {
        condition,
        sortBy
      },
      location_filters: { location },
      price_range_min: priceRange[0],
      price_range_max: priceRange[1],
      category_id: selectedCategory,
      alert_enabled: true,
      alert_frequency: 'daily' as const
    };

    const result = await saveSearch(searchData);
    if (result.success) {
      setSaveSearchName('');
      setOpen(false);
    }
  };

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'distance', label: 'Distance' }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search Options</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <Input
              id="search-query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
            />
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange([value[0], value[1]])}
              max={5000}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$0</span>
              <span>$5000+</span>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select value={condition || ""} onValueChange={(value) => setCondition(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Any condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Condition</SelectItem>
                {conditions.map((cond) => (
                  <SelectItem key={cond.value} value={cond.value}>
                    {cond.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Save Search */}
          <div className="border-t pt-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <Label htmlFor="save-search">Save this search</Label>
              </div>
              <Input
                id="save-search"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
                placeholder="Enter name for saved search"
              />
              <Button 
                onClick={handleSaveSearch} 
                disabled={loading || !saveSearchName.trim()}
                variant="outline"
                size="sm"
              >
                Save Search
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              onApplyFilters();
              setOpen(false);
            }}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
