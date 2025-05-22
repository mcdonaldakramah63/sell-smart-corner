
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { 
  Laptop, Armchair, Shirt, Book, Dumbbell, Gamepad, Search 
} from 'lucide-react';

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
  const getIconForCategory = (iconName: string) => {
    switch (iconName) {
      case 'laptop':
        return <Laptop size={18} />;
      case 'armchair':
        return <Armchair size={18} />;
      case 'shirt':
        return <Shirt size={18} />;
      case 'book':
        return <Book size={18} />;
      case 'dumbbell':
        return <Dumbbell size={18} />;
      case 'gamepad':
        return <Gamepad size={18} />;
      default:
        return <Search size={18} />;
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
          variant={selectedCategory === category.name ? "default" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1 flex items-center gap-1",
            selectedCategory === category.name
              ? "bg-marketplace-primary text-white"
              : "hover:bg-marketplace-primary/10"
          )}
          onClick={() => onSelectCategory(category.name)}
        >
          {getIconForCategory(category.icon)}
          {category.name}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilter;
