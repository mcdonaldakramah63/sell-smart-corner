import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCallContext } from '@/contexts/CallContext';
import { useConversationData } from '@/hooks/useConversationData';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useIncomingCall } from '@/hooks/useIncomingCall';
import { ConversationLayout } from '@/components/conversation/ConversationLayout';
import { MessageList } from '@/components/conversation/MessageList';
import { MessageInput } from '@/components/conversation/MessageInput';
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
    startVoiceCall,
    startVideoCall,
    answerIncomingCall
  } = useCallContext();

  const { incomingCall, answerCall } = useIncomingCall();

  useRealtimeMessages({ 
    conversationId: id, 
    setMessages 
  });

  const handleVoiceCall = () => {
    if (otherUser && id && user?.id) {
      startVoiceCall(otherUser, id, user.id);
    }
  };

  const handleVideoCall = () => {
    if (otherUser && id && user?.id) {
      startVideoCall(otherUser, id, user.id);
    }
  };

  const handleAcceptIncomingCall = async () => {
    const callData = await answerCall(true);
    if (callData && user?.id) {
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
