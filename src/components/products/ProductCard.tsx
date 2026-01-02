import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || 
                      product.images?.[0]?.image_url;

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
    <Card className="product-card group overflow-hidden hover-lift">
      {/* Image Section */}
      <div className="product-card-image relative">
        <Link to={`/products/${product.id}`}>
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
        </Link>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
        
        {/* Heart Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 rounded-full w-9 h-9 md:w-10 md:h-10 p-0 bg-background/90 hover:bg-background shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
            isSaved ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save product'}
          onClick={() => onSave?.(product.id)}
        >
          <Heart className={`h-4 w-4 transition-all duration-300 ${isSaved ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
        </Button>

        {/* Condition Badge */}
        {product.condition && (
          <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2.5 py-1 backdrop-blur-sm shadow-lg capitalize animate-fade-in">
            {product.condition}
          </Badge>
        )}
      </div>

      <CardContent className="p-3 md:p-4 space-y-2.5">
        {/* Price with animation */}
        <div className="text-lg md:text-xl font-bold text-primary group-hover:scale-105 origin-left transition-transform duration-300">
          {formatPrice(product.price)}
        </div>
        
        {/* Title */}
        <Link 
          to={`/products/${product.id}`}
          className="block hover:text-primary transition-colors duration-300 link-underline"
        >
          <h3 className="font-medium text-foreground line-clamp-2 leading-snug text-sm md:text-base">
            {product.title}
          </h3>
        </Link>
        
        {/* Location and Time */}
        <div className="flex items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-1.5 min-w-0 max-w-[60%] group/loc">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60 group-hover/loc:text-primary transition-colors duration-300" />
            <span className="truncate">{product.location || 'Accra'}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 group/time">
            <Clock className="h-3.5 w-3.5 text-primary/60 group-hover/time:text-primary transition-colors duration-300" />
            <span>{timeAgo(product.created_at)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 h-10 text-xs md:text-sm font-medium gradient-primary text-primary-foreground shadow-sm hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] group/call"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
          >
            <Phone className="h-3.5 w-3.5 mr-1.5 group-hover/call:animate-bounce-subtle" />
            Call
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 h-10 text-xs md:text-sm font-medium border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] group/chat"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/messages?productId=${product.id}`);
            }}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5 group-hover/chat:animate-bounce-subtle" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
