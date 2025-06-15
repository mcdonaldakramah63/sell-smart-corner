
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProductDetails {
  id: string;
  title: string;
  image?: string;
  price: number;
}

interface ProductInfoCardProps {
  product: ProductDetails;
}

export const ProductInfoCard = ({ product }: ProductInfoCardProps) => {
  return (
    <Card className="p-4 mb-6 flex items-center bg-gradient-to-r from-white to-slate-50 border shadow-sm">
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 mr-4 shadow-sm bg-gray-50">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.objectFit = 'cover';
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold line-clamp-1 text-slate-800">{product.title}</h3>
        <p className="text-lg font-bold text-green-600">${parseFloat(product.price.toString()).toFixed(2)}</p>
      </div>
      <Button size="sm" variant="outline" className="ml-auto shrink-0 hover:bg-blue-50 border-blue-200" asChild>
        <Link to={`/products/${product.id}`}>View Product</Link>
      </Button>
    </Card>
  );
};
