
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <Input
        type="search"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-3 sm:pl-4 pr-12 sm:pr-14 text-sm sm:text-base h-10 sm:h-12"
      />
      <Button 
        type="submit" 
        size="icon" 
        className="absolute right-0 top-0 h-10 sm:h-12 w-10 sm:w-12 bg-marketplace-primary hover:bg-marketplace-primary/90"
      >
        <Search size={16} className="sm:w-5 sm:h-5" />
      </Button>
    </form>
  );
};

export default SearchBar;
