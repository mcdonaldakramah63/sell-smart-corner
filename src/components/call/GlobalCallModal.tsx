import { useEffect, useRef, useState } from 'react';
import { useCallContext } from '@/contexts/CallContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneOff, Video, VideoOff, Mic, MicOff, Maximize2, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const isMobile = useIsMobile();
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-minimize on mobile
  useEffect(() => {
    if (isMobile && isCallModalOpen) {
      setIsMinimized(true);
    }
  }, [isMobile, isCallModalOpen]);

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

  // Minimized view - Ultra compact modern floating widget
  if (isMinimized) {
    return (
      <>
        {audioElement}
        <div className="fixed bottom-20 right-3 z-[9999] animate-in slide-in-from-right-2 duration-300">
          {/* Main compact card */}
          <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden">
            {/* Glowing accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400" />
            
            <div className="p-2.5">
              <div className="flex items-center gap-2.5">
                {/* Avatar with status */}
                <div className="relative flex-shrink-0">
                  {callType === 'video' && remoteStream ? (
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-emerald-400/50">
                      <video 
                        ref={remoteVideoRef} 
                        autoPlay 
                        playsInline
                        className="w-full h-full object-cover scale-125"
                      />
                    </div>
                  ) : (
                    <Avatar className="h-11 w-11 ring-2 ring-emerald-400/50">
                      {callUser.avatar ? (
                        <AvatarImage src={callUser.avatar} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold">
                          {callUser.name[0].toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  {/* Live indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center">
                    <span className="relative flex h-3 w-3">
                      <span className={`absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'} opacity-75`} />
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'} ring-2 ring-slate-900`} />
                    </span>
                  </div>
                </div>

                {/* Call info */}
                <div className="flex-1 min-w-0 pr-1">
                  <p className="text-white font-medium text-xs truncate leading-tight">{callUser.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {callType === 'video' ? (
                      <Video className="h-2.5 w-2.5 text-emerald-400" />
                    ) : (
                      <Phone className="h-2.5 w-2.5 text-emerald-400" />
                    )}
                    <p className="text-[10px] font-medium text-slate-400">
                      {isConnecting ? 'Connecting...' : formatDuration(callDuration)}
                    </p>
                  </div>
                </div>

                {/* Compact controls */}
                <div className="flex items-center gap-1">
                  <button
                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isMuted 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  </button>
                  
                  <button
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={handleEndCall}
                  >
                    <PhoneOff className="h-3.5 w-3.5" />
                  </button>
                  
                  <button
                    className="h-8 w-8 rounded-full bg-white/5 text-white/70 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all duration-200"
                    onClick={() => setIsMinimized(false)}
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Full view - Compact modern design for mobile
  return (
    <>
      {audioElement}
      <div className={`fixed z-[9999] animate-in slide-in-from-bottom-4 duration-300 ${
        isMobile 
          ? 'inset-x-3 bottom-20 top-auto' 
          : 'bottom-4 right-4 w-[360px]'
      }`}>
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden backdrop-blur-xl">
          {/* Glowing accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400" />
          
          <div className={`relative ${isMobile ? 'min-h-[320px]' : 'min-h-[420px]'} flex flex-col`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-0">
              <button 
                className="h-9 w-9 rounded-full bg-white/5 text-white/70 flex items-center justify-center hover:bg-white/10 transition-colors"
                onClick={() => setIsMinimized(true)}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14l-7 7-7-7M19 7l-7-7-7 7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
                {callType === 'video' ? (
                  <Video className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                )}
                <span className="text-xs font-medium text-white/70">
                  {callType === 'video' ? 'Video' : 'Voice'} Call
                </span>
              </div>
              
              <button 
                className="h-9 w-9 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              {callType === 'video' && remoteStream ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-800">
                  <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Local video PiP */}
                  {!isVideoOff && (
                    <div className="absolute bottom-3 right-3 w-20 h-28 rounded-xl overflow-hidden shadow-xl ring-2 ring-white/20">
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
                <>
                  {/* Avatar with animated rings */}
                  <div className="relative">
                    {isConnecting && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: '2s' }} />
                        <div className="absolute inset-[-8px] rounded-full border-2 border-emerald-400/30 animate-pulse" />
                      </>
                    )}
                    <Avatar className={`${isMobile ? 'h-20 w-20' : 'h-24 w-24'} ring-4 ring-white/10 shadow-2xl`}>
                      {callUser.avatar ? (
                        <AvatarImage src={callUser.avatar} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white text-2xl font-bold">
                          {callUser.name[0].toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isConnected && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-slate-900 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="mt-4 text-lg font-semibold text-white">{callUser.name}</h3>
                  
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`text-sm ${isConnecting ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {isConnecting ? 'Connecting...' : formatDuration(callDuration)}
                    </span>
                  </div>
                  
                  {isConnected && (
                    <div className="mt-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-medium">Call active</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Controls */}
            <div className="p-5 pt-2">
              <div className="flex items-center justify-center gap-3">
                {/* Mute */}
                <button
                  className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isMuted 
                      ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/30' 
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                
                {/* End call */}
                <button
                  className="h-14 w-14 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/40 hover:shadow-red-500/60 hover:scale-105 active:scale-95 transition-all duration-200"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
                
                {/* Video toggle */}
                {callType === 'video' && (
                  <button
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isVideoOff 
                        ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/30' 
                        : 'bg-white/10 text-white hover:bg-white/15'
                    }`}
                    onClick={toggleVideo}
                  >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};