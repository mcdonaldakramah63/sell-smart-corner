
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-10 px-4">
        <h3 className="text-base sm:text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground text-sm sm:text-base">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-0">
      {products.map((product) => {
        // Transform Product to match ProductCard expected type
        const transformedProduct = {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          location: product.location,
          created_at: product.createdAt,
          view_count: 0, // Default value since Product type doesn't have this
          contact_count: 0, // Default value since Product type doesn't have this
          images: product.images?.map(img => ({
            image_url: img,
            is_primary: false
          })),
          category: product.category ? { name: product.category } : undefined,
          condition: product.condition
        };

        return (
          <ProductCard key={product.id} product={transformedProduct} />
        );
      })}
    </div>
  );
};

export default ProductGrid;
