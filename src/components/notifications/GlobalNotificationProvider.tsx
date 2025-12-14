import { useEffect } from 'react';
import { useGlobalNotifications } from '@/hooks/useGlobalNotifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useIncomingCall } from '@/hooks/useIncomingCall';
import { useAuth } from '@/contexts/AuthContext';
import { IncomingCallModal } from '@/components/conversation/IncomingCallModal';
import { useCallContext } from '@/contexts/CallContext';

interface GlobalNotificationProviderProps {
  children: React.ReactNode;
}

export const GlobalNotificationProvider = ({ children }: GlobalNotificationProviderProps) => {
  const { user } = useAuth();
  const { requestPermission, permission } = usePushNotifications();
  const { incomingCall, answerCall, dismissCall } = useIncomingCall();
  const { answerIncomingCall } = useCallContext();
  
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
    if (!incomingCall || !user) return;

    const callData = await answerCall(true);
    if (callData) {
      // Use the global CallContext to handle the call
      // This will open the GlobalCallModal which supports minimization
      answerIncomingCall(
        {
          id: callData.callerId,
          name: callData.callerName,
          avatar: callData.callerAvatar
        },
        callData.callType,
        callData.conversationId,
        callData.offer,
        user.id
      );
    }
  };

  const handleRejectCall = async () => {
    await answerCall(false);
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
    </>
  );
};
