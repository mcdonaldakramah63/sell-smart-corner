
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import SearchBar from '@/components/products/SearchBar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { categories, products } from '@/lib/mockData';
import { Product } from '@/lib/types';

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const searchParam = queryParams.get('search');

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [condition, setCondition] = useState<string | null>(null);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, sortBy, priceRange, condition]);

  // Update state if URL params change
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchQuery(searchParam || '');
  }, [categoryParam, searchParam]);

  const filterProducts = () => {
    let filtered = [...products];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }
    
    // Filter by condition
    if (condition) {
      filtered = filtered.filter(product => 
        product.condition === condition
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        filtered.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSortBy('newest');
    setPriceRange([0, 5000]);
    setCondition(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Products</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Left Side */}
          <div className="w-full md:w-1/4 space-y-6">
            <div className="bg-white p-4 rounded-md shadow-sm border">
              <h3 className="font-medium mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="searchInput">Search</Label>
                  <div className="mt-1">
                    <SearchBar 
                      onSearch={handleSearch} 
                      initialQuery={searchQuery}
                    />
                  </div>
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
                  <Select 
                    value={condition || ''} 
                    onValueChange={(value) => setCondition(value === 'any' ? null : value)}
                  >
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
                  <Select 
                    value={sortBy} 
                    onValueChange={setSortBy}
                  >
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
                
                <Button 
                  variant="outline"
                  onClick={handleReset}
                  className="w-full mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Product Content - Right Side */}
          <div className="w-full md:w-3/4">
            {/* Categories */}
            <div className="mb-6">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
              />
            </div>
            
            {/* Results summary */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            
            {/* Product Grid */}
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
