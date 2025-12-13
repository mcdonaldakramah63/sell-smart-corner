import { useEffect, useRef } from 'react';
import { useCallContext } from '@/contexts/CallContext';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneOff, Video, VideoOff, Mic, MicOff, X } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export const GlobalCallModal = () => {
  const {
    isCallModalOpen,
    callType,
    callUser,
    connectionState,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    callDuration,
    endCall,
    toggleMute,
    toggleVideo
  } = useCallContext();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream && callType === 'video') {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callType]);

  // Attach remote stream to video/audio elements
  useEffect(() => {
    if (remoteStream) {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(e => console.log('[GlobalCallModal] Video play error:', e));
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch(e => console.log('[GlobalCallModal] Audio play error:', e));
      }
    }
  }, [remoteStream]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    endCall();
  };

  if (!callUser || !isCallModalOpen) return null;

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'new' || connectionState === 'connecting';

  return (
    <Dialog open={isCallModalOpen} onOpenChange={(open) => !open && handleEndCall()} modal={false}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 border-none fixed bottom-4 right-4 top-auto left-auto translate-x-0 translate-y-0 z-50" aria-describedby={undefined}>
        <VisuallyHidden>
          <DialogTitle>{callType === 'video' ? 'Video' : 'Voice'} Call with {callUser.name}</DialogTitle>
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
                  className={`w-full h-full object-cover ${remoteStream ? 'block' : 'hidden'}`}
                />
                {!remoteStream && (
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 ring-4 ring-white/20">
                      {callUser.avatar ? (
                        <AvatarImage src={callUser.avatar} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl">
                          {callUser.name[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="text-xl font-semibold text-white">{callUser.name}</h3>
                    <p className="text-slate-400 animate-pulse">
                      {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Call ended'}
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
              <div className={`relative ${isConnecting ? 'animate-pulse' : ''}`}>
                <Avatar className="h-32 w-32 ring-4 ring-white/20">
                  {callUser.avatar ? (
                    <AvatarImage src={callUser.avatar} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-4xl">
                      {callUser.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isConnecting && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-green-500/30" />
                )}
              </div>
              
              <h3 className="mt-6 text-2xl font-semibold text-white">{callUser.name}</h3>
              
              <p className="mt-2 text-slate-400">
                {isConnecting ? 'Connecting...' : 
                 isConnected ? formatDuration(callDuration) : 'Call ended'}
              </p>
              
              {isConnected && (
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
