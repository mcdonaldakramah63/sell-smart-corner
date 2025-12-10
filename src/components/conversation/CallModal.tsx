import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneOff, Video, VideoOff, Mic, MicOff, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useAuth } from '@/contexts/AuthContext';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
  } | null;
  callType: 'voice' | 'video';
  conversationId?: string;
  incomingOffer?: RTCSessionDescriptionInit;
}

export const CallModal = ({ 
  isOpen, 
  onClose, 
  otherUser, 
  callType, 
  conversationId,
  incomingOffer
}: CallModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initRef = useRef(false);

  const isAnswering = !!incomingOffer;

  const handleRemoteStream = (stream: MediaStream) => {
    console.log('[CallModal] Received remote stream with tracks:', stream.getTracks().map(t => t.kind));
    setHasRemoteStream(true);
    
    // For video calls, set both video and audio
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
      remoteVideoRef.current.play().catch(e => console.log('[CallModal] Video play error:', e));
    }
    
    // For voice calls (or as backup for video), use audio element
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = stream;
      remoteAudioRef.current.play().catch(e => console.log('[CallModal] Audio play error:', e));
    }
  };

  const handleCallEnded = () => {
    console.log('[CallModal] Call ended');
    setCallStatus('ended');
    toast({
      title: 'Call Ended',
      description: `Call with ${otherUser?.name} has ended.`,
    });
    setTimeout(() => {
      cleanupAndClose();
    }, 500);
  };

  const handleCallConnected = () => {
    console.log('[CallModal] Call connected');
    setCallStatus('connected');
    toast({
      title: 'Connected',
      description: `${callType === 'video' ? 'Video' : 'Voice'} call connected with ${otherUser?.name}`,
    });
  };

  const webrtc = useWebRTC({
    conversationId: conversationId || '',
    localUserId: user?.id || '',
    remoteUserId: otherUser?.id || '',
    callType,
    isAnswering,
    incomingOffer,
    onRemoteStream: handleRemoteStream,
    onCallEnded: handleCallEnded,
    onCallConnected: handleCallConnected
  });

  useEffect(() => {
    if (isOpen && callStatus === 'calling' && !initRef.current && conversationId && user && otherUser) {
      initRef.current = true;
      initializeCall();
    }
    
    return () => {
      if (!isOpen) {
        initRef.current = false;
        setHasRemoteStream(false);
      }
    };
  }, [isOpen, conversationId, user, otherUser]);

  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  const initializeCall = async () => {
    try {
      console.log('[CallModal] Initializing call, isAnswering:', isAnswering);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported in this browser');
      }

      // Subscribe to signals first
      webrtc.subscribeToSignals();

      let localStream: MediaStream | undefined;

      if (isAnswering && incomingOffer) {
        // Answer the incoming call with the offer
        console.log('[CallModal] Answering incoming call');
        localStream = await webrtc.answerCall(incomingOffer);
      } else {
        // Start a new call (send offer)
        console.log('[CallModal] Starting new call');
        localStream = await webrtc.startCall();
      }
      
      if (localVideoRef.current && callType === 'video' && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      
    } catch (error: any) {
      console.error('[CallModal] Error initializing call:', error);
      
      let errorMessage = `Please allow ${callType === 'video' ? 'camera and microphone' : 'microphone'} access to make calls.`;
      
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = `No ${callType === 'video' ? 'camera or microphone' : 'microphone'} found. Please connect a device and try again.`;
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = `Permission denied. Please allow ${callType === 'video' ? 'camera and microphone' : 'microphone'} access in your browser settings.`;
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Your browser does not support media devices. Please use a modern browser.';
      }
      
      toast({
        title: 'Cannot Start Call',
        description: errorMessage,
        variant: 'destructive'
      });
      onClose();
    }
  };

  const cleanupAndClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Clear media elements
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setCallStatus('calling');
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);
    setHasRemoteStream(false);
    initRef.current = false;
    onClose();
  };

  const handleEndCall = async () => {
    setCallStatus('ended');
    await webrtc.endCall();
    toast({
      title: 'Call Ended',
      description: `Call with ${otherUser?.name} has ended.`,
    });
    setTimeout(() => {
      cleanupAndClose();
    }, 500);
  };

  const toggleMute = () => {
    const newMutedState = webrtc.toggleMute();
    setIsMuted(newMutedState);
  };

  const toggleVideo = () => {
    const newVideoOffState = webrtc.toggleVideo();
    setIsVideoOff(newVideoOffState);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!otherUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleEndCall()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 border-none" aria-describedby={undefined}>
        <VisuallyHidden>
          <DialogTitle>{callType === 'video' ? 'Video' : 'Voice'} Call with {otherUser.name}</DialogTitle>
        </VisuallyHidden>
        
        {/* Hidden audio element for remote audio (works for both voice and video calls) */}
        <audio ref={remoteAudioRef} autoPlay playsInline />
        
        <div className="relative min-h-[500px] flex flex-col">
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={handleEndCall}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Video area */}
          {callType === 'video' ? (
            <div className="flex-1 relative">
              {/* Remote video (full screen) - always rendered but may be hidden */}
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline
                  className={`w-full h-full object-cover ${hasRemoteStream ? 'block' : 'hidden'}`}
                />
                {!hasRemoteStream && (
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 ring-4 ring-white/20">
                      {otherUser.avatar ? (
                        <AvatarImage src={otherUser.avatar} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl">
                          {otherUser.name[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="text-xl font-semibold text-white">{otherUser.name}</h3>
                    <p className="text-slate-400 animate-pulse">
                      {callStatus === 'calling' ? (isAnswering ? 'Connecting...' : 'Calling...') : 'Connected'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Local video (picture-in-picture) */}
              {!isVideoOff && (
                <div className="absolute bottom-24 right-4 w-32 h-44 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/20">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            /* Voice call UI */
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className={`relative ${callStatus === 'calling' ? 'animate-pulse' : ''}`}>
                <Avatar className="h-32 w-32 ring-4 ring-white/20">
                  {otherUser.avatar ? (
                    <AvatarImage src={otherUser.avatar} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-4xl">
                      {otherUser.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                {callStatus === 'calling' && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-green-500/30" />
                )}
              </div>
              
              <h3 className="mt-6 text-2xl font-semibold text-white">{otherUser.name}</h3>
              
              <p className="mt-2 text-slate-400">
                {callStatus === 'calling' ? (isAnswering ? 'Connecting...' : 'Calling...') : 
                 callStatus === 'connected' ? formatDuration(callDuration) : 'Call ended'}
              </p>
              
              {callStatus === 'connected' && (
                <div className="mt-4 flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm">Voice call active</span>
                </div>
              )}
            </div>
          )}

          {/* Call controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-4">
              {/* Mute button */}
              <Button
                variant="outline"
                size="icon"
                className={`h-14 w-14 rounded-full border-2 ${
                  isMuted 
                    ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' 
                    : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                }`}
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              
              {/* End call button */}
              <Button
                variant="destructive"
                size="icon"
                className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-7 w-7" />
              </Button>
              
              {/* Video toggle (only for video calls) */}
              {callType === 'video' && (
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-14 rounded-full border-2 ${
                    isVideoOff 
                      ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' 
                      : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                  }`}
                  onClick={toggleVideo}
                >
                  {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
