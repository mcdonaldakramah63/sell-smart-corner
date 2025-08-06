
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-8 8-4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">We couldn't find any products matching your criteria</p>
          <button className="text-orange-500 hover:text-orange-600 font-medium">
            Clear all filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {products.map((product) => {
        // Transform Product to match ProductCard expected type
        const transformedProduct = {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          location: product.location,
          created_at: product.createdAt,
          view_count: Math.floor(Math.random() * 1000), // Mock data
          contact_count: Math.floor(Math.random() * 50), // Mock data
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
