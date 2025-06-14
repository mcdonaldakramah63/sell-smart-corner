
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

interface UseSendMessageProps {
  conversationId: string | undefined;
  product: ProductDetails | null;
  otherUser: Participant | null;
}

export const useSendMessage = ({ conversationId, product, otherUser }: UseSendMessageProps) => {
  const { user } = useAuth();

  const sendMessage = async (messageContent: string) => {
    if (!conversationId || !user?.id) return;
    
    // Send message
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: messageContent,
        read: false
      });
    
    if (error) throw error;
    
    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    // Mark message notifications as read for this conversation when replying
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('type', 'message')
      .like('action_url', `%/conversation/${conversationId}%`)
      .eq('read', false);
    
    // Create notification for recipient
    if (otherUser?.id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: otherUser.id,
          type: 'message',
          content: `New message about "${product?.title}"`,
          action_url: `/conversation/${conversationId}`
        });
    }
  };

  return { sendMessage };
};
