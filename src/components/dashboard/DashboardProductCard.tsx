
import { Link } from 'react-router-dom';
import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PenSquare, Trash2 } from 'lucide-react';

interface DashboardProductCardProps {
  product: Product;
}

export default function DashboardProductCard({ product }: DashboardProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-gray-50">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.title}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.objectFit = 'cover';
            }}
          />
          {product.is_sold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge className="text-lg py-1 px-3 bg-red-500 hover:bg-red-600">
                Sold
              </Badge>
            </div>
          )}
        </Link>
      </div>
      
      <CardContent className="p-4">
        <Link to={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-medium line-clamp-1">{product.title}</h3>
        </Link>
        <div className="flex justify-between items-center mt-1">
          <p className="font-semibold text-primary">
            ${parseFloat(product.price.toString()).toFixed(2)}
          </p>
          <Badge variant="outline" className="text-xs">
            {product.condition}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/edit-product/${product.id}`}>
            <PenSquare className="mr-1 h-3 w-3" />
            Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
