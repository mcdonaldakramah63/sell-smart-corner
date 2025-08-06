
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Image Section - Clean Jiji Style */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/products/${product.id}`}>
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </Link>
        
        {/* Heart Button - Top Right */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-sm ${
            isSaved ? 'text-red-500' : 'text-gray-600'
          }`}
          onClick={() => onSave?.(product.id)}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>

        {/* Condition Badge */}
        {product.condition && (
          <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1">
            {product.condition}
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Price - Prominent */}
        <div className="text-xl font-bold text-blue-600">
          {formatPrice(product.price)}
        </div>
        
        {/* Title */}
        <Link 
          to={`/products/${product.id}`}
          className="block hover:text-blue-600 transition-colors"
        >
          <h3 className="font-medium text-gray-800 line-clamp-2 leading-tight">
            {product.title}
          </h3>
        </Link>
        
        {/* Location and Time */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{product.location || 'Lagos'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{timeAgo(product.created_at)}</span>
          </div>
        </div>

        {/* Action Buttons - Jiji Style */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5"
          >
            <Phone className="h-3 w-3 mr-1" />
            Call
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 text-xs py-1.5"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
