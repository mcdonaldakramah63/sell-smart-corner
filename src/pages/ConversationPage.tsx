
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversationData } from '@/hooks/useConversationData';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useCall } from '@/hooks/useCall';
import { useIncomingCall } from '@/hooks/useIncomingCall';
import { ConversationLayout } from '@/components/conversation/ConversationLayout';
import { MessageList } from '@/components/conversation/MessageList';
import { MessageInput } from '@/components/conversation/MessageInput';
import { CallModal } from '@/components/conversation/CallModal';
import { IncomingCallModal } from '@/components/conversation/IncomingCallModal';
import QuickReplies from '@/components/conversation/QuickReplies';

export default function ConversationPage() {
  const { user } = useAuth();
  const { 
    id, 
    messages, 
    setMessages, 
    loading, 
    product, 
    otherUser 
  } = useConversationData();

  const [prefillText, setPrefillText] = useState<string | undefined>(undefined);

  const { sendMessage } = useSendMessage({ 
    conversationId: id, 
    product, 
    otherUser 
  });

  const {
    isCallModalOpen,
    callType,
    callUser,
    startVoiceCall,
    startVideoCall,
    endCall
  } = useCall();

  const { incomingCall, answerCall } = useIncomingCall();

  useRealtimeMessages({ 
    conversationId: id, 
    setMessages 
  });

  const handleVoiceCall = () => {
    if (otherUser) {
      startVoiceCall(otherUser);
    }
  };

  const handleVideoCall = () => {
    if (otherUser) {
      startVideoCall(otherUser);
    }
  };

  const handleAcceptIncomingCall = async () => {
    const callData = await answerCall(true);
    if (callData) {
      // Start the call modal with the incoming call data
      if (callData.callType === 'video') {
        startVideoCall({
          id: callData.callerId,
          name: callData.callerName,
          avatar: callData.callerAvatar
        });
      } else {
        startVoiceCall({
          id: callData.callerId,
          name: callData.callerName,
          avatar: callData.callerAvatar
        });
      }
    }
  };

  const handleRejectIncomingCall = async () => {
    await answerCall(false);
  };

  return (
    <>
      <ConversationLayout 
        otherUser={otherUser} 
        product={null} 
        loading={loading}
        conversationId={id}
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
      >
        <MessageList 
          messages={messages} 
          currentUserId={user?.id} 
          conversationId={id}
        />
        <QuickReplies onSelect={setPrefillText} />
        <MessageInput 
          onSendMessage={sendMessage} 
          conversationId={id}
          prefillText={prefillText}
          onPrefillConsumed={() => setPrefillText(undefined)}
        />
      </ConversationLayout>

      <CallModal
        isOpen={isCallModalOpen}
        onClose={endCall}
        otherUser={callUser}
        callType={callType}
        conversationId={id}
      />

      {incomingCall && (
        <IncomingCallModal
          isOpen={true}
          callerName={incomingCall.callerName}
          callerAvatar={incomingCall.callerAvatar}
          callType={incomingCall.callType}
          onAccept={handleAcceptIncomingCall}
          onReject={handleRejectIncomingCall}
        />
      )}
    </>
  );
}
