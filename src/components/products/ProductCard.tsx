
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock, Eye, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRCodeGenerator } from './QRCodeGenerator';
import { SocialShareButtons } from '../shared/SocialShareButtons';
import { useCurrency } from '@/hooks/useCurrency';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    location?: string;
    created_at: string;
    view_count: number;
    contact_count: number;
    images?: Array<{ image_url: string; is_primary: boolean }>;
    category?: { name: string };
    condition?: string;
  };
  onSave?: (productId: string) => void;
  isSaved?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSave,
  isSaved = false
}) => {
  const { formatPrice } = useCurrency();
  
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || 
                      product.images?.[0]?.image_url;

  const productUrl = `${window.location.origin}/products/${product.id}`;

  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          
          {product.condition && (
            <Badge className="absolute top-2 left-2" variant="secondary">
              {product.condition}
            </Badge>
          )}
          
          {product.category && (
            <Badge className="absolute top-2 right-2" variant="outline">
              {product.category.name}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className={`absolute bottom-2 right-2 rounded-full ${
              isSaved ? 'text-red-500' : 'text-white'
            }`}
            onClick={() => onSave?.(product.id)}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <div className="space-y-2">
          <Link 
            to={`/products/${product.id}`}
            className="block group-hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
              {product.title}
            </h3>
          </Link>
          
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </div>
          
          {product.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {product.location}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {product.view_count}
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {product.contact_count}
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {timeAgo(product.created_at)}
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2 w-full">
          <QRCodeGenerator
            productId={product.id}
            productTitle={product.title}
            productUrl={productUrl}
          />
          
          <SocialShareButtons
            url={productUrl}
            title={product.title}
            description={product.description}
            productId={product.id}
            variant="compact"
          />
        </div>
      </CardFooter>
    </Card>
  );
};
