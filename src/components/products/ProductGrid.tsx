
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-8 8-4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium border border-blue-600 px-4 py-2 rounded">
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => {
        // Transform Product to match ProductCard expected type
        const transformedProduct = {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          location: product.location,
          created_at: product.createdAt,
          view_count: Math.floor(Math.random() * 100),
          contact_count: Math.floor(Math.random() * 20),
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
