
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversationData } from '@/hooks/useConversationData';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { ConversationLayout } from '@/components/conversation/ConversationLayout';
import { MessageList } from '@/components/conversation/MessageList';
import { MessageInput } from '@/components/conversation/MessageInput';
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

  useRealtimeMessages({ 
    conversationId: id, 
    setMessages 
  });

  return (
    <ConversationLayout 
      otherUser={otherUser} 
      product={null} 
      loading={loading}
      conversationId={id}
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
  );
}
