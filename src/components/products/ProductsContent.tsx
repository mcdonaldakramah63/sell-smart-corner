
import CategoryFilter from "@/components/products/CategoryFilter";
import ProductGrid from "@/components/products/ProductGrid";
import { Category, Product } from "@/lib/types";

interface ProductsContentProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  categoriesLoading: boolean;
  filteredProducts: Product[];
  loading: boolean;
}
export default function ProductsContent({
  categories,
  selectedCategory,
  onSelectCategory,
  categoriesLoading,
  filteredProducts,
  loading,
}: ProductsContentProps) {
  return (
    <div>
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          loading={categoriesLoading}
        />
      </div>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          {loading
            ? "Loading products..."
            : `Showing ${filteredProducts.length} ${
                filteredProducts.length === 1 ? "product" : "products"
              }`}
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
}
