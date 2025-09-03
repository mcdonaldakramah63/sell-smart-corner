
import { useState } from 'react';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Home,
  Smartphone,
  Monitor,
  ShoppingBag,
  Star,
  Gamepad2,
  Tag,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  car: Car,
  home: Home,
  mobile: Smartphone,
  computers: Monitor,
  'computer-accessories': Monitor,
  fashion: ShoppingBag,
  'beauty-personal-care': Star,
  'home-furniture-appliances': Home,
  console: Gamepad2,
  'console-accessories': Gamepad2,
  other: Tag,
  default: Tag,
};

function getIconForCategory(iconName: string | undefined) {
  const LucideIcon = (iconName && iconMap[iconName]) ? iconMap[iconName] : iconMap["default"] || Tag;
  return <LucideIcon size={16} className="inline-block" />;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  loading?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  loading,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 8);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm font-medium transition-colors",
              selectedCategory === null
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 border-gray-300"
            )}
            onClick={() => onSelectCategory(null)}
          >
            All Categories
          </Badge>
          
          {loading ? (
            <div className="flex items-center text-gray-500 ml-2 text-sm">
              Loading categories...
            </div>
          ) : (
            displayedCategories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors",
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 border-gray-300"
                )}
                onClick={() => onSelectCategory(category.id)}
              >
                {getIconForCategory(category.icon)}
                {category.name}
              </Badge>
            ))
          )}
          
          {categories.length > 8 && !loading && (
            <Badge
              variant="outline"
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 border-gray-300"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? 'Show Less' : 'More Categories'}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
