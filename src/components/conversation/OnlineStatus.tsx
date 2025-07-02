import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface OnlineStatusProps {
  userId: string;
  showText?: boolean;
}

export const OnlineStatus = ({ userId, showText = false }: OnlineStatusProps) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<string>('');

  useEffect(() => {
    if (!userId) return;

    // Subscribe to user presence
    const channel = supabase.channel(`user-${userId}`)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const userPresence = presenceState[userId];
        setIsOnline(!!userPresence && userPresence.length > 0);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === userId) {
          setIsOnline(true);
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === userId) {
          setIsOnline(false);
          setLastSeen(new Date().toLocaleString());
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (showText) {
    return (
      <Badge 
        variant={isOnline ? "default" : "secondary"}
        className={`text-xs ${
          isOnline 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}
      >
        {isOnline ? 'Online' : lastSeen ? `Last seen ${lastSeen}` : 'Offline'}
      </Badge>
    );
  }

  return (
    <div className="relative">
      <div 
        className={`w-3 h-3 rounded-full border-2 border-white ${
          isOnline ? 'bg-green-500' : 'bg-slate-400'
        }`}
        title={isOnline ? 'Online' : 'Offline'}
      />
      {isOnline && (
        <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-30" />
      )}
    </div>
  );
};