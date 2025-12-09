import { useState, useCallback } from 'react';

interface CallUser {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
}

export const useCall = () => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [callUser, setCallUser] = useState<CallUser | null>(null);

  const startVoiceCall = useCallback((user: CallUser) => {
    setCallUser(user);
    setCallType('voice');
    setIsCallModalOpen(true);
  }, []);

  const startVideoCall = useCallback((user: CallUser) => {
    setCallUser(user);
    setCallType('video');
    setIsCallModalOpen(true);
  }, []);

  const endCall = useCallback(() => {
    setIsCallModalOpen(false);
    setCallUser(null);
  }, []);

  return {
    isCallModalOpen,
    callType,
    callUser,
    startVoiceCall,
    startVideoCall,
    endCall
  };
};
