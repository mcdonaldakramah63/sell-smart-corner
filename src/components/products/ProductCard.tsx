import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to message the seller',
        variant: 'destructive'
      });
      return;
    }

    if (user.id === product.seller.id) {
      toast({
        title: 'Cannot message yourself',
        description: 'You cannot start a conversation with yourself',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsCreatingConversation(true);
      console.log('Starting conversation creation for product:', product.id);

      // Check if conversation already exists between these two users for this product
      const { data: existingConversations, error: searchError } = await supabase
        .from('conversations')
        .select(`
          id,
          conversation_participants!inner(user_id)
        `)
        .eq('product_id', product.id);

      if (searchError) {
        console.error('Error searching for existing conversations:', searchError);
        throw searchError;
      }

      console.log('Existing conversations found:', existingConversations);

      // Find a conversation that has both users as participants
      let existingConversationId = null;
      if (existingConversations && existingConversations.length > 0) {
        for (const conv of existingConversations) {
          // Get all participants for this conversation
          const { data: participants, error: participantsError } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.id);

          if (participantsError) continue;

          const participantIds = participants?.map(p => p.user_id) || [];
          
          // Check if both current user and seller are participants
          if (participantIds.includes(user.id) && participantIds.includes(product.seller.id)) {
            existingConversationId = conv.id;
            break;
          }
        }
      }

      if (existingConversationId) {
        console.log('Found existing conversation:', existingConversationId);
        navigate(`/conversation/${existingConversationId}`);
        return;
      }

      console.log('Creating new conversation...');
      // Create new conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          product_id: product.id
        })
        .select('id')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }

      console.log('New conversation created:', newConversation.id);

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: newConversation.id, user_id: user.id },
          { conversation_id: newConversation.id, user_id: product.seller.id }
        ]);

      if (participantsError) {
        console.error('Error adding participants:', participantsError);
        throw participantsError;
      }

      console.log('Participants added successfully');

      // Navigate to conversation
      navigate(`/conversation/${newConversation.id}`);
    } catch (error) {
      console.error('Error in handleMessage:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingConversation(false);
    }
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
