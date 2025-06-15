
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  condition: string | null;
  setCondition: (v: string | null) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  handleReset: () => void;
}

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  condition,
  setCondition,
  sortBy,
  setSortBy,
  handleReset,
}: ProductFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border">
      <h3 className="font-medium mb-4">Filters</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="searchInput">Search</Label>
          <input
            type="text"
            id="searchInput"
            placeholder="Search for products…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <Label>Price Range</Label>
          <div className="mt-2">
            <Slider
              defaultValue={[0, 5000]}
              max={5000}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleReset} className="w-full mt-4">
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
