
import { useAuth } from '@/contexts/AuthContext';
import { useConversationData } from '@/hooks/useConversationData';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { ConversationLayout } from '@/components/conversation/ConversationLayout';
import { MessageList } from '@/components/conversation/MessageList';
import { MessageInput } from '@/components/conversation/MessageInput';

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

  const { sendMessage } = useSendMessage({ 
    conversationId: id, 
    product, 
    otherUser 
  });

  useRealtimeMessages({ 
    conversationId: id, 
    setMessages 
  });

  return (
    <ConversationLayout 
      otherUser={otherUser} 
      product={product} 
      loading={loading}
    >
      <MessageList messages={messages} currentUserId={user?.id} />
      <MessageInput onSendMessage={sendMessage} />
    </ConversationLayout>
  );
}
