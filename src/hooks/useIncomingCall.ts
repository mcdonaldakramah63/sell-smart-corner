import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface IncomingCall {
  id: string;
  conversationId: string;
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  callType: 'voice' | 'video';
  offer: RTCSessionDescriptionInit;
}

export const useIncomingCall = () => {
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const answerCall = useCallback(async (accept: boolean) => {
    if (!incomingCall || !user) return null;

    if (!accept) {
      // Reject call
      await supabase.from('call_signals' as any).insert({
        conversation_id: incomingCall.conversationId,
        caller_id: user.id,
        callee_id: incomingCall.callerId,
        call_type: incomingCall.callType,
        signal_type: 'end',
        signal_data: { reason: 'rejected' },
        status: 'rejected'
      } as any);
      setIncomingCall(null);
      return null;
    }

    // Accept call - return call data for the modal to handle
    const callData = { ...incomingCall };
    setIncomingCall(null);
    return callData;
  }, [incomingCall, user]);

  useEffect(() => {
    if (!user) return;

    console.log('[IncomingCall] Subscribing to incoming calls for user:', user.id);

    const channel = supabase
      .channel(`incoming-calls-${user.id}`)
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
            console.log('[IncomingCall] Received incoming call offer');
            
            // Fetch caller info
            const { data: callerProfile } = await supabase
              .from('profiles')
              .select('full_name, username, avatar_url')
              .eq('id', signal.caller_id)
              .single();

            setIncomingCall({
              id: signal.id,
              conversationId: signal.conversation_id,
              callerId: signal.caller_id,
              callerName: callerProfile?.full_name || callerProfile?.username || 'Unknown',
              callerAvatar: callerProfile?.avatar_url,
              callType: signal.call_type,
              offer: signal.signal_data
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user]);

  return {
    incomingCall,
    answerCall,
    dismissCall: () => setIncomingCall(null)
  };
};
