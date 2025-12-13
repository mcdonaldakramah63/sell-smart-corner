import { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CallUser {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
}

interface IncomingCallData {
  conversationId: string;
  offer: RTCSessionDescriptionInit;
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

interface CallContextType {
  isCallModalOpen: boolean;
  callType: 'voice' | 'video';
  callUser: CallUser | null;
  incomingCallData: IncomingCallData | null;
  conversationId: string | null;
  connectionState: 'new' | 'connecting' | 'connected' | 'failed' | 'closed';
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  callDuration: number;
  startVoiceCall: (user: CallUser, conversationId: string, localUserId: string) => void;
  startVideoCall: (user: CallUser, conversationId: string, localUserId: string) => void;
  answerIncomingCall: (user: CallUser, type: 'voice' | 'video', conversationId: string, offer: RTCSessionDescriptionInit, localUserId: string) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [callUser, setCallUser] = useState<CallUser | null>(null);
  const [incomingCallData, setIncomingCallData] = useState<IncomingCallData | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<'new' | 'connecting' | 'connected' | 'failed' | 'closed'>('new');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const localUserIdRef = useRef<string>('');
  const remoteUserIdRef = useRef<string>('');
  const conversationIdRef = useRef<string>('');
  const callTypeRef = useRef<'voice' | 'video'>('voice');

  // Timer for call duration
  useEffect(() => {
    if (connectionState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [connectionState]);

  const cleanup = useCallback(async () => {
    console.log('[CallContext] Cleaning up...');
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
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
    if (conversationIdRef.current) {
      try {
        await supabase
          .from('call_signals' as any)
          .delete()
          .eq('conversation_id', conversationIdRef.current);
      } catch (e) {
        console.log('[CallContext] Cleanup signals error:', e);
      }
    }

    setConnectionState('closed');
    setRemoteStream(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);
  }, []);

  const handleSignal = useCallback(async (signal: any) => {
    const pc = peerConnectionRef.current;
    
    console.log('[CallContext] Handling signal:', signal.signal_type, 'from:', signal.caller_id);

    if (signal.signal_type === 'answer' && pc) {
      console.log('[CallContext] Received answer, setting remote description');
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.signal_data));
        
        // Add any pending ICE candidates
        for (const candidate of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidatesRef.current = [];
      } catch (e) {
        console.error('[CallContext] Error setting answer:', e);
      }
    }
    
    if (signal.signal_type === 'ice-candidate' && signal.signal_data.candidate) {
      console.log('[CallContext] Received ICE candidate');
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(signal.signal_data.candidate));
        } catch (e) {
          console.error('[CallContext] Error adding ICE candidate:', e);
        }
      } else {
        console.log('[CallContext] Queuing ICE candidate (no remote description yet)');
        pendingCandidatesRef.current.push(signal.signal_data.candidate);
      }
    }
    
    if (signal.signal_type === 'end') {
      console.log('[CallContext] Received end signal');
      toast({
        title: 'Call Ended',
        description: 'The other user ended the call.',
      });
      await cleanup();
      setIsCallModalOpen(false);
      setCallUser(null);
      setIncomingCallData(null);
      setConversationId(null);
    }
  }, [cleanup, toast]);

  const subscribeToSignals = useCallback((convId: string, localUserId: string, remoteUserId: string) => {
    console.log('[CallContext] Subscribing to signals for conversation:', convId, 'localUser:', localUserId);
    
    const channel = supabase
      .channel(`call-signals-${convId}-${localUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_signals',
          filter: `conversation_id=eq.${convId}`
        },
        (payload) => {
          const signal = payload.new as any;
          console.log('[CallContext] Received signal:', signal.signal_type, 'caller_id:', signal.caller_id, 'callee_id:', signal.callee_id);
          
          // Process signals from the remote user (not our own signals)
          if (signal.caller_id === remoteUserId) {
            handleSignal(signal);
          }
        }
      )
      .subscribe((status) => {
        console.log('[CallContext] Subscription status:', status);
      });

    channelRef.current = channel;
  }, [handleSignal]);

  const createPeerConnection = useCallback(() => {
    console.log('[CallContext] Creating peer connection');
    
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log('[CallContext] Sending ICE candidate');
        try {
          await supabase.from('call_signals' as any).insert({
            conversation_id: conversationIdRef.current,
            caller_id: localUserIdRef.current,
            callee_id: remoteUserIdRef.current,
            call_type: callTypeRef.current,
            signal_type: 'ice-candidate',
            signal_data: { candidate: event.candidate.toJSON() },
            status: 'pending'
          } as any);
        } catch (e) {
          console.error('[CallContext] Error sending ICE candidate:', e);
        }
      }
    };

    pc.ontrack = (event) => {
      console.log('[CallContext] Received remote track');
      if (event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('[CallContext] Connection state:', pc.connectionState);
      setConnectionState(pc.connectionState as any);
      
      if (pc.connectionState === 'connected') {
        toast({
          title: 'Connected',
          description: `Call connected successfully`,
        });
      } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        toast({
          title: 'Connection Lost',
          description: 'The call connection was lost.',
          variant: 'destructive'
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[CallContext] ICE connection state:', pc.iceConnectionState);
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [toast]);

  const initializeCall = useCallback(async (
    user: CallUser,
    convId: string,
    localUserId: string,
    type: 'voice' | 'video',
    incomingOffer?: RTCSessionDescriptionInit
  ) => {
    try {
      console.log('[CallContext] Initializing call, isAnswering:', !!incomingOffer);
      
      // Store refs for use in callbacks
      localUserIdRef.current = localUserId;
      remoteUserIdRef.current = user.id;
      conversationIdRef.current = convId;
      callTypeRef.current = type;
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported in this browser');
      }

      // Subscribe to signals first
      subscribeToSignals(convId, localUserId, user.id);

      // Get local media
      const constraints = {
        audio: true,
        video: type === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      
      const pc = createPeerConnection();
      
      // Add local tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      if (incomingOffer) {
        // Answer the incoming call with the offer
        console.log('[CallContext] Answering incoming call');
        await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
        
        // Add any pending ICE candidates
        for (const candidate of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidatesRef.current = [];

        // Create and send answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        console.log('[CallContext] Sending answer to:', user.id);
        await supabase.from('call_signals' as any).insert({
          conversation_id: convId,
          caller_id: localUserId,
          callee_id: user.id,
          call_type: type,
          signal_type: 'answer',
          signal_data: { sdp: answer.sdp, type: answer.type },
          status: 'accepted'
        } as any);
      } else {
        // Start a new call (send offer)
        console.log('[CallContext] Starting new call');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        console.log('[CallContext] Sending offer to:', user.id);
        await supabase.from('call_signals' as any).insert({
          conversation_id: convId,
          caller_id: localUserId,
          callee_id: user.id,
          call_type: type,
          signal_type: 'offer',
          signal_data: { sdp: offer.sdp, type: offer.type },
          status: 'pending'
        } as any);
      }

      setConnectionState('connecting');
      
    } catch (error: any) {
      console.error('[CallContext] Error initializing call:', error);
      
      let errorMessage = `Please allow ${type === 'video' ? 'camera and microphone' : 'microphone'} access to make calls.`;
      
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = `No ${type === 'video' ? 'camera or microphone' : 'microphone'} found. Please connect a device and try again.`;
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = `Permission denied. Please allow ${type === 'video' ? 'camera and microphone' : 'microphone'} access in your browser settings.`;
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Your browser does not support media devices. Please use a modern browser.';
      }
      
      toast({
        title: 'Cannot Start Call',
        description: errorMessage,
        variant: 'destructive'
      });
      
      await cleanup();
      setIsCallModalOpen(false);
      setCallUser(null);
      setIncomingCallData(null);
      setConversationId(null);
    }
  }, [createPeerConnection, subscribeToSignals, cleanup, toast]);

  const startVoiceCall = useCallback((user: CallUser, convId: string, localUserId: string) => {
    setCallUser(user);
    setCallType('voice');
    setIncomingCallData(null);
    setConversationId(convId);
    setConnectionState('new');
    setIsCallModalOpen(true);
    initializeCall(user, convId, localUserId, 'voice');
  }, [initializeCall]);

  const startVideoCall = useCallback((user: CallUser, convId: string, localUserId: string) => {
    setCallUser(user);
    setCallType('video');
    setIncomingCallData(null);
    setConversationId(convId);
    setConnectionState('new');
    setIsCallModalOpen(true);
    initializeCall(user, convId, localUserId, 'video');
  }, [initializeCall]);

  const answerIncomingCall = useCallback((
    user: CallUser, 
    type: 'voice' | 'video',
    convId: string,
    offer: RTCSessionDescriptionInit,
    localUserId: string
  ) => {
    setCallUser(user);
    setCallType(type);
    setIncomingCallData({ conversationId: convId, offer });
    setConversationId(convId);
    setConnectionState('new');
    setIsCallModalOpen(true);
    initializeCall(user, convId, localUserId, type, offer);
  }, [initializeCall]);

  const endCall = useCallback(async () => {
    console.log('[CallContext] Ending call');
    
    try {
      if (conversationIdRef.current && localUserIdRef.current && remoteUserIdRef.current) {
        await supabase.from('call_signals' as any).insert({
          conversation_id: conversationIdRef.current,
          caller_id: localUserIdRef.current,
          callee_id: remoteUserIdRef.current,
          call_type: callTypeRef.current,
          signal_type: 'end',
          signal_data: {},
          status: 'ended'
        } as any);
      }
    } catch (e) {
      console.error('[CallContext] Error sending end signal:', e);
    }

    await cleanup();
    setIsCallModalOpen(false);
    setCallUser(null);
    setIncomingCallData(null);
    setConversationId(null);
  }, [cleanup]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, []);

  return (
    <CallContext.Provider value={{
      isCallModalOpen,
      callType,
      callUser,
      incomingCallData,
      conversationId,
      connectionState,
      localStream,
      remoteStream,
      isMuted,
      isVideoOff,
      callDuration,
      startVoiceCall,
      startVideoCall,
      answerIncomingCall,
      endCall,
      toggleMute,
      toggleVideo
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};
