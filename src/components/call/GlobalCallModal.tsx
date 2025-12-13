import { useEffect, useRef, useState } from 'react';
import { useCallContext } from '@/contexts/CallContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneOff, Video, VideoOff, Mic, MicOff, X, Maximize2, Minimize2 } from 'lucide-react';

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

  const [isMinimized, setIsMinimized] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream && callType === 'video') {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callType, isMinimized]);

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
    setIsMinimized(false);
    endCall();
  };

  if (!callUser || !isCallModalOpen) return null;

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'new' || connectionState === 'connecting';

  // Hidden audio element for remote audio (always needed)
  const audioElement = <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />;

  // Minimized view - small floating widget like WhatsApp
  if (isMinimized) {
    return (
      <>
        {audioElement}
        <div className="fixed bottom-4 right-4 z-[9999] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 p-3">
            {/* Avatar or mini video */}
            <div className="relative">
              {callType === 'video' && remoteStream && !isVideoOff ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Avatar className="h-14 w-14 ring-2 ring-green-500/50">
                  {callUser.avatar ? (
                    <AvatarImage src={callUser.avatar} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg">
                      {callUser.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              {isConnected && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
              )}
            </div>

            {/* Call info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{callUser.name}</p>
              <p className="text-slate-400 text-xs">
                {isConnecting ? 'Connecting...' : formatDuration(callDuration)}
              </p>
            </div>

            {/* Mini controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full ${isMuted ? 'text-red-400' : 'text-white'}`}
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-white hover:bg-white/10"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Full view
  return (
    <>
      {audioElement}
      <div className="fixed bottom-4 right-4 z-[9999] w-[380px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in slide-in-from-bottom-2">
        <div className="relative min-h-[480px] flex flex-col">
          {/* Header with controls */}
          <div className="absolute top-0 left-0 right-0 p-4 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full text-white hover:bg-white/20"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full text-white hover:bg-white/20"
              onClick={handleEndCall}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video area */}
          {callType === 'video' ? (
            <div className="flex-1 relative">
              {/* Remote video (full screen) */}
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
                <div className="absolute bottom-24 right-4 w-28 h-40 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/20">
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
                <Avatar className="h-28 w-28 ring-4 ring-white/20">
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
              
              <h3 className="mt-5 text-xl font-semibold text-white">{callUser.name}</h3>
              
              <p className="mt-2 text-slate-400">
                {isConnecting ? 'Connecting...' : 
                 isConnected ? formatDuration(callDuration) : 'Call ended'}
              </p>
              
              {isConnected && (
                <div className="mt-3 flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm">Voice call active</span>
                </div>
              )}
            </div>
          )}

          {/* Call controls */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-4">
              {/* Mute button */}
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full border-2 ${
                  isMuted 
                    ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' 
                    : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                }`}
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              {/* End call button */}
              <Button
                variant="destructive"
                size="icon"
                className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
              
              {/* Video toggle (only for video calls) */}
              {callType === 'video' && (
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-12 w-12 rounded-full border-2 ${
                    isVideoOff 
                      ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' 
                      : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                  }`}
                  onClick={toggleVideo}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
