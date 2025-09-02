import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { usePresence } from '@/hooks/usePresence';

interface OnlineStatusProps {
  userId: string;
  showText?: boolean;
  conversationId?: string;
}

export const OnlineStatus = ({ userId, showText = false, conversationId }: OnlineStatusProps) => {
  const { isUserOnline } = usePresence(conversationId);
  const isOnline = isUserOnline(userId);

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
        {isOnline ? 'Online' : 'Offline'}
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