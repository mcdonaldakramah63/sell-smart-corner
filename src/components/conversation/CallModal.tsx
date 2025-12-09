import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
}

export const CallModal = ({ isOpen, onClose, otherUser, callType }: CallModalProps) => {
  const { toast } = useToast();
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [permissionError, setPermissionError] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && callStatus === 'calling' && !permissionError) {
      initializeCall();
    }
    
    return () => {
      cleanupCall();
    };
  }, [isOpen]);

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
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported in this browser');
      }

      const constraints = {
        audio: true,
        video: callType === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = stream;
      }
      
      // Simulate call connection after 2 seconds
      setTimeout(() => {
        setCallStatus('connected');
        toast({
          title: 'Connected',
          description: `${callType === 'video' ? 'Video' : 'Voice'} call connected with ${otherUser?.name}`,
        });
      }, 2000);
      
    } catch (error: any) {
      console.error('Error accessing media devices:', error);
      setPermissionError(true);
      
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

  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCallStatus('calling');
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    toast({
      title: 'Call Ended',
      description: `Call with ${otherUser?.name} has ended.`,
    });
    setTimeout(() => {
      cleanupCall();
      onClose();
    }, 500);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!isVideoOff);
      }
    }
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
              {/* Remote video (full screen) */}
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                {callStatus === 'connected' ? (
                  <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
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
                      {callStatus === 'calling' ? 'Calling...' : 'Connected'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Local video (picture-in-picture) */}
              {callStatus === 'connected' && !isVideoOff && (
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
                {callStatus === 'calling' ? 'Calling...' : 
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
