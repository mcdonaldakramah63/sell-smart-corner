
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Star, Eye, MessageCircle, ShoppingCart } from 'lucide-react';
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

  // Calculate discount percentage (mock data for demo)
  const originalPrice = product.price * 1.3;
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white border-gray-100 overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs">
            -{discountPercentage}%
          </Badge>
        )}
        
        {/* Condition Badge */}
        {product.condition && (
          <Badge className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 text-xs">
            {product.condition}
          </Badge>
        )}
        
        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white ${
            isSaved ? 'text-red-500' : 'text-gray-600'
          }`}
          onClick={() => onSave?.(product.id)}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-center p-4 space-x-2">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="space-y-2 flex-grow">
          {/* Category */}
          {product.category && (
            <div className="text-xs text-orange-500 font-medium">
              {product.category.name}
            </div>
          )}
          
          {/* Title */}
          <Link 
            to={`/products/${product.id}`}
            className="block group-hover:text-orange-500 transition-colors"
          >
            <h3 className="font-medium text-sm line-clamp-2 leading-tight text-gray-800">
              {product.title}
            </h3>
          </Link>
          
          {/* Price Section */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-orange-500">
                {formatPrice(product.price)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Rating (mock data) */}
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-3 w-3 fill-yellow-400 text-yellow-400" 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">(4.5)</span>
          </div>
          
          {/* Location */}
          {product.location && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {product.location}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {product.view_count}
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                {product.contact_count}
              </div>
            </div>
            <span>{timeAgo(product.created_at)}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-2">
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
        </div>
      </CardContent>
    </Card>
  );
};
