
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Car, Home, Smartphone } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  // Map the database icons to available lucide-react icons.
  const getIconForCategory = (iconName: string) => {
    switch (iconName) {
      case 'car':
        return <Car size={18} />;
      case 'home':
        return <Home size={18} />;
      case 'mobile':
        return <Smartphone size={18} />;
      default:
        return <Car size={18} />; // fallback
    }
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      <Badge
        variant={selectedCategory === null ? "default" : "outline"}
        className={cn(
          "cursor-pointer hover:bg-primary/90 px-3 py-1",
          selectedCategory === null
            ? "bg-marketplace-primary text-white"
            : "hover:bg-marketplace-primary/10"
        )}
        onClick={() => onSelectCategory(null)}
      >
        All
      </Badge>
      
      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1 flex items-center gap-1",
            selectedCategory === category.id
              ? "bg-marketplace-primary text-white"
              : "hover:bg-marketplace-primary/10"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          {getIconForCategory(category.icon)}
          {category.name}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilter;

