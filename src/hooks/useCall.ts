import { useState, useCallback } from 'react';

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

export const useCall = () => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [callUser, setCallUser] = useState<CallUser | null>(null);
  const [incomingCallData, setIncomingCallData] = useState<IncomingCallData | null>(null);

  const startVoiceCall = useCallback((user: CallUser) => {
    setCallUser(user);
    setCallType('voice');
    setIncomingCallData(null);
    setIsCallModalOpen(true);
  }, []);

  const startVideoCall = useCallback((user: CallUser) => {
    setCallUser(user);
    setCallType('video');
    setIncomingCallData(null);
    setIsCallModalOpen(true);
  }, []);

  const answerIncomingCall = useCallback((
    user: CallUser, 
    type: 'voice' | 'video',
    conversationId: string,
    offer: RTCSessionDescriptionInit
  ) => {
    setCallUser(user);
    setCallType(type);
    setIncomingCallData({ conversationId, offer });
    setIsCallModalOpen(true);
  }, []);

  const endCall = useCallback(() => {
    setIsCallModalOpen(false);
    setCallUser(null);
    setIncomingCallData(null);
  }, []);

  return {
    isCallModalOpen,
    callType,
    callUser,
    incomingCallData,
    startVoiceCall,
    startVideoCall,
    answerIncomingCall,
    endCall
  };
};
