
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  read: boolean;
}

interface UseRealtimeMessagesProps {
  conversationId: string | undefined;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const useRealtimeMessages = ({ conversationId, setMessages }: UseRealtimeMessagesProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId) return;
    
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        
        // Add message to state
        setMessages(prev => [...prev, newMessage]);
        
        // Mark as read if from other user
        if (newMessage.sender_id !== user?.id) {
          supabase
            .from('messages')
            .update({ read: true })
            .eq('id', newMessage.id);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user?.id, setMessages]);
};
