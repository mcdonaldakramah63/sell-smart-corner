
import ProductGrid from "../ProductGrid";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
}

export default function FeaturedProductsSection({ products, loading }: FeaturedProductsSectionProps) {
  const navigate = useNavigate();
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button onClick={() => navigate("/products")} variant="outline">
            See All Products
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No products available</h3>
            <p className="text-muted-foreground">Be the first to list a product!</p>
          </div>
        )}
      </div>
    </section>
  );
}
