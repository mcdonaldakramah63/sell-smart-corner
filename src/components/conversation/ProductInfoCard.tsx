
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

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
    <Card className="overflow-hidden shadow-sm">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-green-500 hover:bg-green-600">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-slate-900 line-clamp-2 leading-tight">{product.title}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              ${parseFloat(product.price.toString()).toFixed(2)}
            </span>
            <span className="text-sm text-slate-500 line-through">
              ${(parseFloat(product.price.toString()) * 1.2).toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Truck className="h-4 w-4" />
            <span>Free delivery available</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Buy Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/products/${product.id}`}>
              View Product Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
