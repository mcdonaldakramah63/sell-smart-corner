
import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };
  
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/messages?product=${product.id}`);
  };
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in" 
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden relative">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            No image
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-marketplace-accent">
          ${product.price.toFixed(2)}
        </Badge>
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
            className="w-5 h-5 rounded-full"
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
          <Button size="icon" variant="ghost" onClick={handleMessage}>
            <MessageCircle size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
