
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Filter } from "lucide-react";

interface AdvancedFiltersProps {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  condition: string | null;
  setCondition: (v: string | null) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  region: string;
  setRegion: (v: string) => void;
  isNegotiable: boolean | null;
  setIsNegotiable: (v: boolean | null) => void;
  dateRange: string;
  setDateRange: (v: string) => void;
  handleReset: () => void;
}

const regions = [
  'All Regions',
  'Greater Accra',
  'Ashanti',
  'Western',
  'Central',
  'Eastern',
  'Volta',
  'Northern',
  'Upper East',
  'Upper West',
  'Brong Ahafo'
];

export default function AdvancedFilters({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  condition,
  setCondition,
  sortBy,
  setSortBy,
  location,
  setLocation,
  region,
  setRegion,
  isNegotiable,
  setIsNegotiable,
  dateRange,
  setDateRange,
  handleReset,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const activeFiltersCount = [
    searchQuery,
    condition,
    location,
    region !== 'All Regions' ? region : null,
    isNegotiable !== null ? 'negotiable' : null,
    dateRange !== 'all' ? dateRange : null,
  ].filter(Boolean).length;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="searchInput">Search Keywords</Label>
          <div className="relative mt-1">
            <Input
              type="text"
              id="searchInput"
              placeholder="Search for products, brands, models..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="flex items-center justify-between">
            Price Range
            <span className="text-sm text-muted-foreground">
              GH₵{priceRange[0]} - GH₵{priceRange[1]}
            </span>
          </Label>
          <div className="mt-3">
            <Slider
              defaultValue={[0, 5000]}
              max={10000}
              min={0}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>GH₵0</span>
              <span>GH₵10,000+</span>
            </div>
          </div>
        </div>

        {/* Location Filters */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          
          <div>
            <Label htmlFor="region" className="text-sm">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger id="region" className="mt-1">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city" className="text-sm">City/Area</Label>
            <Input
              id="city"
              placeholder="Enter city or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Condition */}
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition || ''} onValueChange={(value) =>
                setCondition(value === "any" ? null : value)
              }>
                <SelectTrigger id="condition" className="mt-1">
                  <SelectValue placeholder="Any condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any condition</SelectItem>
                  <SelectItem value="new">Brand New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Negotiable */}
            <div>
              <Label>Price Type</Label>
              <Select 
                value={isNegotiable === null ? 'any' : isNegotiable ? 'negotiable' : 'fixed'} 
                onValueChange={(value) => {
                  if (value === 'any') setIsNegotiable(null);
                  else setIsNegotiable(value === 'negotiable');
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price Type</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <Label htmlFor="dateRange">Posted</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="dateRange" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Sort By */}
        <div>
          <Label htmlFor="sortBy">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sortBy" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="distance">Nearest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button 
          variant="outline" 
          onClick={handleReset} 
          className="w-full"
          disabled={activeFiltersCount === 0}
        >
          Reset All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
