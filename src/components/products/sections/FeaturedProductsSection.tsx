
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-marketplace-secondary">Featured Products</h2>
          <Button onClick={() => navigate("/products")} variant="outline" className="shadow-soft hover:shadow-elegant">
            See All Products
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-16 marketplace-card mx-auto max-w-md">
            <h3 className="text-2xl font-medium mb-4 text-marketplace-secondary">No products available</h3>
            <p className="text-muted-foreground text-lg">Be the first to list a product!</p>
            <Button 
              className="mt-6" 
              variant="marketplace"
              onClick={() => navigate("/create-product")}
            >
              List Your Product
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
