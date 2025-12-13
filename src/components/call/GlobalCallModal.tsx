import { useCallContext } from '@/contexts/CallContext';
import { CallModal } from '@/components/conversation/CallModal';

export const GlobalCallModal = () => {
  const {
    isCallModalOpen,
    callType,
    callUser,
    incomingCallData,
    conversationId,
    endCall
  } = useCallContext();

  const activeConversationId = incomingCallData?.conversationId || conversationId;

  return (
    <CallModal
      isOpen={isCallModalOpen}
      onClose={endCall}
      otherUser={callUser}
      callType={callType}
      conversationId={activeConversationId || undefined}
      incomingOffer={incomingCallData?.offer}
    />
  );
};
