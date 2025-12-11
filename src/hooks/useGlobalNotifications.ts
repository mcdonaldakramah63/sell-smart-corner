import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from './usePushNotifications';

export const useGlobalNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { showNotification, permission } = usePushNotifications();
  const location = useLocation();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const callChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    console.log('[GlobalNotifications] Setting up notifications for user:', user.id);

    // Get user's conversations to listen for messages
    const setupMessageNotifications = async () => {
      // First get all conversation IDs the user is part of
      const { data: participantData } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (!participantData || participantData.length === 0) {
        console.log('[GlobalNotifications] No conversations found');
        return;
      }

      const conversationIds = participantData.map(p => p.conversation_id);
      console.log('[GlobalNotifications] Listening to conversations:', conversationIds.length);

      // Subscribe to messages in all user's conversations
      const channel = supabase
        .channel(`global-messages-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          async (payload) => {
            const newMessage = payload.new as any;
            
            // Only notify if message is in user's conversations and not from user
            if (!conversationIds.includes(newMessage.conversation_id)) return;
            if (newMessage.sender_id === user.id) return;

            // Don't notify if user is currently viewing this conversation
            const currentConversationId = location.pathname.startsWith('/conversation/')
              ? location.pathname.split('/conversation/')[1]
              : null;
            
            if (currentConversationId === newMessage.conversation_id) {
              console.log('[GlobalNotifications] User is viewing this conversation, skipping notification');
              return;
            }

            console.log('[GlobalNotifications] New message received:', newMessage.id);

            // Fetch sender info
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('full_name, username, avatar_url')
              .eq('id', newMessage.sender_id)
              .single();

            const senderName = senderProfile?.full_name || senderProfile?.username || 'Someone';
            const messagePreview = newMessage.content.length > 50 
              ? newMessage.content.substring(0, 50) + '...' 
              : newMessage.content;

            // Create in-app notification in database
            await supabase.from('notifications').insert({
              user_id: user.id,
              type: 'message',
              content: `${senderName}: ${messagePreview}`,
              action_url: `/conversation/${newMessage.conversation_id}`
            });

            // Show in-app toast
            toast({
              title: `New message from ${senderName}`,
              description: messagePreview,
            });

            // Show push notification if permitted and document is hidden
            if (permission === 'granted' && document.hidden) {
              showNotification(`New message from ${senderName}`, {
                body: messagePreview,
                tag: `message-${newMessage.id}`,
                data: { url: `/conversation/${newMessage.conversation_id}` }
              });
            }
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    // Subscribe to incoming calls
    const callChannel = supabase
      .channel(`global-calls-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_signals',
          filter: `callee_id=eq.${user.id}`
        },
        async (payload) => {
          const signal = payload.new as any;
          
          if (signal.signal_type === 'offer') {
            console.log('[GlobalNotifications] Incoming call detected');

            // Fetch caller info
            const { data: callerProfile } = await supabase
              .from('profiles')
              .select('full_name, username')
              .eq('id', signal.caller_id)
              .single();

            const callerName = callerProfile?.full_name || callerProfile?.username || 'Someone';
            const callTypeText = signal.call_type === 'video' ? 'video call' : 'voice call';

            // Show in-app toast
            toast({
              title: `Incoming ${callTypeText}`,
              description: `${callerName} is calling you`,
            });

            // Show push notification if permitted
            if (permission === 'granted') {
              showNotification(`Incoming ${callTypeText}`, {
                body: `${callerName} is calling you`,
                tag: `call-${signal.id}`,
                requireInteraction: true,
                data: { url: `/conversation/${signal.conversation_id}` }
              });
            }
          }
        }
      )
      .subscribe();

    callChannelRef.current = callChannel;
    setupMessageNotifications();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (callChannelRef.current) {
        supabase.removeChannel(callChannelRef.current);
      }
    };
  }, [user?.id, toast, showNotification, permission, location.pathname]);
};
