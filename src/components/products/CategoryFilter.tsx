import { useState } from 'react';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Car,
  Home,
  Smartphone,
  Monitor,
  ShoppingBag,
  Star,
  Gamepad2,
  Tag,
  ChevronDown,
  ChevronUp,
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
  return <LucideIcon size={16} className="shrink-0" />;
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
    <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-16 z-40">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {/* All Categories Button */}
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              "category-chip inline-flex items-center gap-2 text-sm",
              selectedCategory === null
                ? "category-chip-active"
                : "category-chip-inactive"
            )}
          >
            <Tag size={16} />
            <span>All</span>
          </button>
          
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm px-4">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            displayedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "category-chip inline-flex items-center gap-2 text-sm",
                  selectedCategory === category.id
                    ? "category-chip-active"
                    : "category-chip-inactive"
                )}
              >
                {getIconForCategory(category.icon)}
                <span className="truncate max-w-[120px]">{category.name}</span>
              </button>
            ))
          )}
          
          {/* Show More/Less Button */}
          {categories.length > 8 && !loading && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="category-chip category-chip-inactive inline-flex items-center gap-1.5 text-sm text-primary"
            >
              {showAllCategories ? (
                <>
                  <span>Less</span>
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  <span>More</span>
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
