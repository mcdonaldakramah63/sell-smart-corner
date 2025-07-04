
import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createOrFindConversation } from '@/utils/conversationUtils';
import { PremiumAdBadge } from './PremiumAdBadge';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };
  
  const handleMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('=== MESSAGE SELLER CLICKED ===');
    console.log('User:', user);
    console.log('Product:', product);
    console.log('Seller ID:', product.seller.id);
    
    if (!user) {
      console.log('No user found, redirecting to auth');
      toast({
        title: 'Login required',
        description: 'Please log in to message the seller',
        variant: 'destructive'
      });
      return;
    }

    if (user.id === product.seller.id) {
      console.log('User trying to message themselves');
      toast({
        title: 'Cannot message yourself',
        description: 'You cannot start a conversation with yourself',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsCreatingConversation(true);
      const conversationId = await createOrFindConversation(product, user.id);
      navigate(`/conversation/${conversationId}`);
    } catch (error) {
      console.error('=== CONVERSATION CREATION ERROR ===');
      console.error('Error details:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start conversation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingConversation(false);
    }
  };
  
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in" 
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden relative bg-gray-50">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.objectFit = 'cover';
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {product.premiumAdType && (
            <PremiumAdBadge adType={product.premiumAdType} />
          )}
          <Badge className="bg-marketplace-accent">
            ${product.price.toFixed(2)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
          <Badge variant="outline" className="ml-2 text-xs">
            {product.condition}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
          {product.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <span>{product.location}</span>
          <span className="mx-1">•</span>
          <span>
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center space-x-1">
          <img 
            src={product.seller.avatar || "https://via.placeholder.com/24"} 
            alt={product.seller.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-xs">{product.seller.name}</span>
        </div>
        <div className="flex space-x-1">
          <Button size="icon" variant="ghost" onClick={handleLike}>
            <Heart 
              size={18} 
              className={liked ? "fill-red-500 text-red-500" : ""}
            />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleMessage}
            disabled={isCreatingConversation}
          >
            {isCreatingConversation ? (
              <div className="h-4 w-4 border-t-2 border-r-2 border-gray-600 rounded-full animate-spin" />
            ) : (
              <MessageCircle size={18} />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
