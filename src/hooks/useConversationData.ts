
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  read: boolean;
}

interface ProductDetails {
  id: string;
  title: string;
  image?: string;
  price: number;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

export const useConversationData = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [otherUser, setOtherUser] = useState<Participant | null>(null);

  useEffect(() => {
    const fetchConversationData = async () => {
      if (!id || !user?.id) return;
      
      try {
        setLoading(true);
        
        // Check if user is part of this conversation using security definer function
        console.log('Checking if user is participant using security definer function');
        const { data: participants, error: participantError } = await supabase
          .rpc('get_conversation_participants', { conversation_uuid: id });
        
        if (participantError) {
          console.error('Error checking participants:', participantError);
          throw participantError;
        }
        
        const participantIds = participants?.map(p => p.user_id) || [];
        const isParticipant = participantIds.includes(user.id);
        
        if (!isParticipant) {
          toast({
            title: 'Access denied',
            description: 'You do not have access to this conversation',
            variant: 'destructive'
          });
          navigate('/messages');
          return;
        }
        
        // Get conversation details
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .select(`
            product_id,
            products:products (
              id,
              title,
              price
            )
          `)
          .eq('id', id)
          .maybeSingle();
        
        if (conversationError) throw conversationError;
        if (!conversation) {
          toast({
            title: 'Not found',
            description: 'Conversation not found',
            variant: 'destructive'
          });
          navigate('/messages');
          return;
        }
        
        // Get product image
        const { data: productImage } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', conversation.product_id)
          .eq('is_primary', true)
          .maybeSingle();
        
        // Get other participant (not current user)
        const otherParticipantId = participantIds.find(pid => pid !== user.id);
        
        if (!otherParticipantId) {
          throw new Error('Could not find other participant');
        }
        
        // Get profile data for other participant
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url')
          .eq('id', otherParticipantId)
          .maybeSingle();
        
        setProduct({
          id: conversation.products.id,
          title: conversation.products.title,
          price: conversation.products.price,
          image: productImage?.image_url
        });
        
        setOtherUser({
          id: otherParticipantId,
          name: profileData?.full_name || profileData?.username || 'Unknown User',
          avatar: profileData?.avatar_url
        });
        
        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', id)
          .order('created_at');
        
        if (messagesError) throw messagesError;
        
        setMessages(messagesData || []);
        
        // Mark unread messages as read
        const unreadMessages = (messagesData || []).filter(
          msg => !msg.read && msg.sender_id !== user.id
        );
        
        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map(msg => 
              supabase
                .from('messages')
                .update({ read: true })
                .eq('id', msg.id)
            )
          );
        }

        // Mark message notifications as read for this conversation
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .eq('type', 'message')
          .like('action_url', `%/conversation/${id}%`)
          .eq('read', false);
        
      } catch (error) {
        console.error('Error fetching conversation:', error);
        toast({
          title: 'Error',
          description: 'Failed to load conversation',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversationData();
  }, [id, user?.id, toast, navigate]);

  return {
    id,
    messages,
    setMessages,
    loading,
    product,
    otherUser
  };
};
