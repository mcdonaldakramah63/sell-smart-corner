
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
  Wand2,
  Tag,
  User,
  LucideIcon
} from 'lucide-react';

/**
 * Utility to map category icon slugs/names from DB to lucide icons.
 * Add to this mapping as your category icon set grows!
 */
const iconMap: Record<string, LucideIcon> = {
  car: Car,
  home: Home,
  mobile: Smartphone,
  // Example mappings for new categories:
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

/** Fallback for unknown icon names. */
function getIconForCategory(iconName: string | undefined) {
  // fallback to "default" icon if not mapped
  const LucideIcon = (iconName && iconMap[iconName]) ? iconMap[iconName] : iconMap["default"] || Tag;
  return <LucideIcon size={18} className="inline-block" />;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  loading?: boolean;
}

/** Renders clickable badges for all categories */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  loading,
}) => {
  return (
    <div className="flex flex-wrap gap-2 my-4 min-h-8">
      <Badge
        variant={selectedCategory === null ? "default" : "outline"}
        className={cn(
          "cursor-pointer hover:bg-primary/90 px-3 py-1",
          selectedCategory === null
            ? "bg-marketplace-primary text-white"
            : "hover:bg-marketplace-primary/10"
        )}
        onClick={() => onSelectCategory(null)}
        aria-label="Show all categories"
      >
        All
      </Badge>
      {loading ? (
        <div className="flex items-center text-muted-foreground ml-2 text-sm">Loading categories…</div>
      ) : (
        categories.map((category) => (
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
            aria-label={category.name}
          >
            {getIconForCategory(category.icon)}
            {category.name}
          </Badge>
        ))
      )}
    </div>
  );
};

export default CategoryFilter;
