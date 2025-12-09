import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WebRTCConfig {
  conversationId: string;
  callerId: string;
  calleeId: string;
  callType: 'voice' | 'video';
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
  callerId,
  calleeId,
  callType,
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

    // Clean up call signals
    await supabase
      .from('call_signals' as any)
      .delete()
      .eq('conversation_id', conversationId)
      .or(`caller_id.eq.${callerId},callee_id.eq.${callerId}`);

    setConnectionState('closed');
  }, [conversationId, callerId]);

  const createPeerConnection = useCallback(() => {
    console.log('[WebRTC] Creating peer connection');
    
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log('[WebRTC] Sending ICE candidate');
        await supabase.from('call_signals' as any).insert({
          conversation_id: conversationId,
          caller_id: callerId,
          callee_id: calleeId,
          call_type: callType,
          signal_type: 'ice-candidate',
          signal_data: { candidate: event.candidate.toJSON() },
          status: 'pending'
        } as any);
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

    peerConnectionRef.current = pc;
    return pc;
  }, [conversationId, callerId, calleeId, callType, onRemoteStream, onCallConnected, onCallEnded, toast]);

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
      
      console.log('[WebRTC] Sending offer');
      await supabase.from('call_signals' as any).insert({
        conversation_id: conversationId,
        caller_id: callerId,
        callee_id: calleeId,
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
  }, [callType, conversationId, callerId, calleeId, createPeerConnection]);

  const answerCall = useCallback(async (offer: RTCSessionDescriptionInit) => {
    try {
      console.log('[WebRTC] Answering call');
      
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
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Add any pending ICE candidates
      for (const candidate of pendingCandidatesRef.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      pendingCandidatesRef.current = [];

      // Create and send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      console.log('[WebRTC] Sending answer');
      await supabase.from('call_signals' as any).insert({
        conversation_id: conversationId,
        caller_id: callerId,
        callee_id: calleeId,
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
  }, [callType, conversationId, callerId, calleeId, createPeerConnection]);

  const handleSignal = useCallback(async (signal: any) => {
    const pc = peerConnectionRef.current;
    
    console.log('[WebRTC] Handling signal:', signal.signal_type);

    if (signal.signal_type === 'answer' && pc) {
      console.log('[WebRTC] Received answer');
      await pc.setRemoteDescription(new RTCSessionDescription(signal.signal_data));
      
      // Add any pending ICE candidates
      for (const candidate of pendingCandidatesRef.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      pendingCandidatesRef.current = [];
    }
    
    if (signal.signal_type === 'ice-candidate' && signal.signal_data.candidate) {
      console.log('[WebRTC] Received ICE candidate');
      if (pc && pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(signal.signal_data.candidate));
      } else {
        pendingCandidatesRef.current.push(signal.signal_data.candidate);
      }
    }
    
    if (signal.signal_type === 'end') {
      console.log('[WebRTC] Received end signal');
      onCallEnded();
    }
  }, [onCallEnded]);

  const subscribeToSignals = useCallback(() => {
    console.log('[WebRTC] Subscribing to signals');
    
    const channel = supabase
      .channel(`call-signals-${conversationId}`)
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
          // Only process signals meant for us (not our own signals)
          if (signal.callee_id === callerId || (signal.caller_id !== callerId && signal.signal_type === 'ice-candidate')) {
            handleSignal(signal);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, [conversationId, callerId, handleSignal]);

  const endCall = useCallback(async () => {
    console.log('[WebRTC] Ending call');
    
    await supabase.from('call_signals' as any).insert({
      conversation_id: conversationId,
      caller_id: callerId,
      callee_id: calleeId,
      call_type: callType,
      signal_type: 'end',
      signal_data: {},
      status: 'ended'
    } as any);

    await cleanup();
  }, [conversationId, callerId, calleeId, callType, cleanup]);

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
