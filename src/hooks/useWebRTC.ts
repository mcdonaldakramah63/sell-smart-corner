import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WebRTCConfig {
  conversationId: string;
  localUserId: string;
  remoteUserId: string;
  callType: 'voice' | 'video';
  isAnswering: boolean;
  incomingOffer?: RTCSessionDescriptionInit;
  onRemoteStream: (stream: MediaStream) => void;
  onCallEnded: () => void;
  onCallConnected: () => void;
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

export const useWebRTC = ({
  conversationId,
  localUserId,
  remoteUserId,
  callType,
  isAnswering,
  incomingOffer,
  onRemoteStream,
  onCallEnded,
  onCallConnected
}: WebRTCConfig) => {
  const { toast } = useToast();
  const [connectionState, setConnectionState] = useState<'new' | 'connecting' | 'connected' | 'failed' | 'closed'>('new');
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const cleanup = useCallback(async () => {
    console.log('[WebRTC] Cleaning up...');
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Clean up call signals for this conversation
    try {
      await supabase
        .from('call_signals' as any)
        .delete()
        .eq('conversation_id', conversationId);
    } catch (e) {
      console.log('[WebRTC] Cleanup signals error:', e);
    }

    setConnectionState('closed');
  }, [conversationId]);

  const createPeerConnection = useCallback(() => {
    console.log('[WebRTC] Creating peer connection');
    
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log('[WebRTC] Sending ICE candidate');
        try {
          await supabase.from('call_signals' as any).insert({
            conversation_id: conversationId,
            caller_id: localUserId,
            callee_id: remoteUserId,
            call_type: callType,
            signal_type: 'ice-candidate',
            signal_data: { candidate: event.candidate.toJSON() },
            status: 'pending'
          } as any);
        } catch (e) {
          console.error('[WebRTC] Error sending ICE candidate:', e);
        }
      }
    };

    pc.ontrack = (event) => {
      console.log('[WebRTC] Received remote track');
      if (event.streams[0]) {
        onRemoteStream(event.streams[0]);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] Connection state:', pc.connectionState);
      setConnectionState(pc.connectionState as any);
      
      if (pc.connectionState === 'connected') {
        onCallConnected();
      } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        toast({
          title: 'Connection Lost',
          description: 'The call connection was lost.',
          variant: 'destructive'
        });
        onCallEnded();
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE connection state:', pc.iceConnectionState);
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [conversationId, localUserId, remoteUserId, callType, onRemoteStream, onCallConnected, onCallEnded, toast]);

  const startCall = useCallback(async () => {
    try {
      console.log('[WebRTC] Starting call as caller');
      
      // Get local media
      const constraints = {
        audio: true,
        video: callType === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      const pc = createPeerConnection();
      
      // Add local tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      console.log('[WebRTC] Sending offer to:', remoteUserId);
      await supabase.from('call_signals' as any).insert({
        conversation_id: conversationId,
        caller_id: localUserId,
        callee_id: remoteUserId,
        call_type: callType,
        signal_type: 'offer',
        signal_data: { sdp: offer.sdp, type: offer.type },
        status: 'pending'
      } as any);

      setConnectionState('connecting');
      
      return stream;
    } catch (error: any) {
      console.error('[WebRTC] Error starting call:', error);
      throw error;
    }
  }, [callType, conversationId, localUserId, remoteUserId, createPeerConnection]);

  const answerCall = useCallback(async (offer: RTCSessionDescriptionInit) => {
    try {
      console.log('[WebRTC] Answering call from:', remoteUserId);
      
      // Get local media
      const constraints = {
        audio: true,
        video: callType === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      const pc = createPeerConnection();
      
      // Add local tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Set remote description (the offer)
      console.log('[WebRTC] Setting remote description (offer)');
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Add any pending ICE candidates
      for (const candidate of pendingCandidatesRef.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      pendingCandidatesRef.current = [];

      // Create and send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      console.log('[WebRTC] Sending answer to:', remoteUserId);
      await supabase.from('call_signals' as any).insert({
        conversation_id: conversationId,
        caller_id: localUserId,
        callee_id: remoteUserId,
        call_type: callType,
        signal_type: 'answer',
        signal_data: { sdp: answer.sdp, type: answer.type },
        status: 'accepted'
      } as any);

      setConnectionState('connecting');
      
      return stream;
    } catch (error: any) {
      console.error('[WebRTC] Error answering call:', error);
      throw error;
    }
  }, [callType, conversationId, localUserId, remoteUserId, createPeerConnection]);

  const handleSignal = useCallback(async (signal: any) => {
    const pc = peerConnectionRef.current;
    
    console.log('[WebRTC] Handling signal:', signal.signal_type, 'from:', signal.caller_id);

    if (signal.signal_type === 'answer' && pc) {
      console.log('[WebRTC] Received answer, setting remote description');
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.signal_data));
        
        // Add any pending ICE candidates
        for (const candidate of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidatesRef.current = [];
      } catch (e) {
        console.error('[WebRTC] Error setting answer:', e);
      }
    }
    
    if (signal.signal_type === 'ice-candidate' && signal.signal_data.candidate) {
      console.log('[WebRTC] Received ICE candidate');
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(signal.signal_data.candidate));
        } catch (e) {
          console.error('[WebRTC] Error adding ICE candidate:', e);
        }
      } else {
        console.log('[WebRTC] Queuing ICE candidate (no remote description yet)');
        pendingCandidatesRef.current.push(signal.signal_data.candidate);
      }
    }
    
    if (signal.signal_type === 'end') {
      console.log('[WebRTC] Received end signal');
      onCallEnded();
    }
  }, [onCallEnded]);

  const subscribeToSignals = useCallback(() => {
    console.log('[WebRTC] Subscribing to signals for conversation:', conversationId, 'localUser:', localUserId);
    
    const channel = supabase
      .channel(`call-signals-${conversationId}-${localUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_signals',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const signal = payload.new as any;
          console.log('[WebRTC] Received signal:', signal.signal_type, 'caller_id:', signal.caller_id, 'callee_id:', signal.callee_id);
          
          // Process signals from the remote user (not our own signals)
          if (signal.caller_id === remoteUserId) {
            handleSignal(signal);
          }
        }
      )
      .subscribe((status) => {
        console.log('[WebRTC] Subscription status:', status);
      });

    channelRef.current = channel;
  }, [conversationId, localUserId, remoteUserId, handleSignal]);

  const endCall = useCallback(async () => {
    console.log('[WebRTC] Ending call');
    
    try {
      await supabase.from('call_signals' as any).insert({
        conversation_id: conversationId,
        caller_id: localUserId,
        callee_id: remoteUserId,
        call_type: callType,
        signal_type: 'end',
        signal_data: {},
        status: 'ended'
      } as any);
    } catch (e) {
      console.error('[WebRTC] Error sending end signal:', e);
    }

    await cleanup();
  }, [conversationId, localUserId, remoteUserId, callType, cleanup]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled;
      }
    }
    return false;
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return !videoTrack.enabled;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    connectionState,
    localStream: localStreamRef.current,
    startCall,
    answerCall,
    endCall,
    cleanup,
    subscribeToSignals,
    toggleMute,
    toggleVideo
  };
};
