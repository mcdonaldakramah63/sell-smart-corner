import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseTypingIndicatorProps {
  conversationId: string | undefined;
}

export const useTypingIndicator = ({ conversationId }: UseTypingIndicatorProps) => {
  const { user } = useAuth();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Track typing timeout
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Start typing
  const startTyping = useCallback(() => {
    if (!conversationId || !user?.id) return;

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Send typing event
    const channel = supabase.channel(`conversation-${conversationId}`);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, typing: true }
    });

    setIsTyping(true);

    // Auto-stop typing after 3 seconds
    const timeout = setTimeout(() => {
      stopTyping();
    }, 3000);
    
    setTypingTimeout(timeout);
  }, [conversationId, user?.id, typingTimeout]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!conversationId || !user?.id) return;

    // Clear timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }

    // Send stop typing event
    const channel = supabase.channel(`conversation-${conversationId}`);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, typing: false }
    });

    setIsTyping(false);
  }, [conversationId, user?.id, typingTimeout]);

  // Listen for other users typing
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, typing } = payload.payload;
        
        // Don't show our own typing
        if (userId === user?.id) return;

        setTypingUsers(prev => {
          if (typing) {
            return prev.includes(userId) ? prev : [...prev, userId];
          } else {
            return prev.filter(id => id !== userId);
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      stopTyping();
    };
  }, [typingTimeout, stopTyping]);

  return {
    startTyping,
    stopTyping,
    isTyping,
    typingUsers,
    isOtherUserTyping: typingUsers.length > 0
  };
};