import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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

interface CallContextType {
  isCallModalOpen: boolean;
  callType: 'voice' | 'video';
  callUser: CallUser | null;
  incomingCallData: IncomingCallData | null;
  conversationId: string | null;
  startVoiceCall: (user: CallUser, conversationId: string) => void;
  startVideoCall: (user: CallUser, conversationId: string) => void;
  answerIncomingCall: (user: CallUser, type: 'voice' | 'video', conversationId: string, offer: RTCSessionDescriptionInit) => void;
  endCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [callUser, setCallUser] = useState<CallUser | null>(null);
  const [incomingCallData, setIncomingCallData] = useState<IncomingCallData | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const startVoiceCall = useCallback((user: CallUser, convId: string) => {
    setCallUser(user);
    setCallType('voice');
    setIncomingCallData(null);
    setConversationId(convId);
    setIsCallModalOpen(true);
  }, []);

  const startVideoCall = useCallback((user: CallUser, convId: string) => {
    setCallUser(user);
    setCallType('video');
    setIncomingCallData(null);
    setConversationId(convId);
    setIsCallModalOpen(true);
  }, []);

  const answerIncomingCall = useCallback((
    user: CallUser, 
    type: 'voice' | 'video',
    convId: string,
    offer: RTCSessionDescriptionInit
  ) => {
    setCallUser(user);
    setCallType(type);
    setIncomingCallData({ conversationId: convId, offer });
    setConversationId(convId);
    setIsCallModalOpen(true);
  }, []);

  const endCall = useCallback(() => {
    setIsCallModalOpen(false);
    setCallUser(null);
    setIncomingCallData(null);
    setConversationId(null);
  }, []);

  return (
    <CallContext.Provider value={{
      isCallModalOpen,
      callType,
      callUser,
      incomingCallData,
      conversationId,
      startVoiceCall,
      startVideoCall,
      answerIncomingCall,
      endCall
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
