import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PresenceState {
  [key: string]: {
    user_id: string;
    username?: string;
    avatar_url?: string;
    online_at: string;
  }[];
}

export const usePresence = (conversationId?: string) => {
  const [presenceState, setPresenceState] = useState<PresenceState>({});
  const [isOnline, setIsOnline] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase.channel(`conversation:${conversationId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState() as PresenceState;
        setPresenceState(newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        // Track current user's presence
        const presenceTrackStatus = await channel.track({
          user_id: user.id,
          username: user.email,
          online_at: new Date().toISOString(),
        });

        setIsOnline(presenceTrackStatus === 'ok');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  // Get online users excluding current user
  const getOnlineUsers = () => {
    const onlineUsers: Array<{
      user_id: string;
      username?: string;
      avatar_url?: string;
      online_at: string;
    }> = [];

    Object.values(presenceState).forEach(presences => {
      presences.forEach(presence => {
        if (presence.user_id !== user?.id) {
          onlineUsers.push(presence);
        }
      });
    });

    return onlineUsers;
  };

  // Check if specific user is online
  const isUserOnline = (userId: string) => {
    return Object.values(presenceState).some(presences =>
      presences.some(presence => presence.user_id === userId)
    );
  };

  return {
    presenceState,
    isOnline,
    onlineUsers: getOnlineUsers(),
    isUserOnline,
  };
};