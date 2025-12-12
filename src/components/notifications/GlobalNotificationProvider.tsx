import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalNotifications } from '@/hooks/useGlobalNotifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useIncomingCall } from '@/hooks/useIncomingCall';
import { useAuth } from '@/contexts/AuthContext';
import { IncomingCallModal } from '@/components/conversation/IncomingCallModal';
import { CallModal } from '@/components/conversation/CallModal';
import { supabase } from '@/integrations/supabase/client';

interface GlobalNotificationProviderProps {
  children: React.ReactNode;
}

interface ActiveCall {
  conversationId: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  callType: 'voice' | 'video';
  incomingOffer: RTCSessionDescriptionInit;
}

export const GlobalNotificationProvider = ({ children }: GlobalNotificationProviderProps) => {
  const { user } = useAuth();
  const { requestPermission, permission } = usePushNotifications();
  const { incomingCall, answerCall, dismissCall } = useIncomingCall();
  const navigate = useNavigate();
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  
  // Set up global notifications
  useGlobalNotifications();

  // Request notification permission on login
  useEffect(() => {
    if (user && permission === 'default') {
      // Small delay to not overwhelm user right after login
      const timer = setTimeout(() => {
        requestPermission();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, permission, requestPermission]);

  const handleAcceptCall = async () => {
    if (!incomingCall) return;

    const callData = await answerCall(true);
    if (callData) {
      // Set up the active call to show the CallModal
      setActiveCall({
        conversationId: callData.conversationId,
        otherUser: {
          id: callData.callerId,
          name: callData.callerName,
          avatar: callData.callerAvatar
        },
        callType: callData.callType,
        incomingOffer: callData.offer
      });
    }
  };

  const handleRejectCall = async () => {
    await answerCall(false);
  };

  const handleCallClose = () => {
    setActiveCall(null);
  };

  return (
    <>
      {children}
      
      {/* Global Incoming Call Modal */}
      {incomingCall && (
        <IncomingCallModal
          isOpen={!!incomingCall}
          callerName={incomingCall.callerName}
          callerAvatar={incomingCall.callerAvatar}
          callType={incomingCall.callType}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {/* Active Call Modal */}
      {activeCall && (
        <CallModal
          isOpen={!!activeCall}
          onClose={handleCallClose}
          otherUser={activeCall.otherUser}
          callType={activeCall.callType}
          conversationId={activeCall.conversationId}
          incomingOffer={activeCall.incomingOffer}
        />
      )}
    </>
  );
};
