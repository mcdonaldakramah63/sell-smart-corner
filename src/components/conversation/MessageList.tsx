
import { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import { TypingIndicator } from '@/components/conversation/TypingIndicator';
import { MessageReactions } from '@/components/conversation/MessageReactions';
import { useMessageReactions } from '@/hooks/useMessageReactions';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  read: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  conversationId?: string;
}

export const MessageList = ({ messages, currentUserId, conversationId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { reactions, addReaction, loadReactions } = useMessageReactions();
  const { isOtherUserTyping } = useTypingIndicator({ conversationId });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load reactions for all messages
    messages.forEach(message => {
      loadReactions(message.id);
    });
  }, [messages, loadReactions]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto pb-4 space-y-4 bg-white rounded-lg p-4 shadow-sm border">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="p-8 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 mb-4">
            <Send className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Start the conversation</h3>
          <p className="text-slate-500">Send a message to get things started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4 space-y-4 bg-white rounded-lg p-4 shadow-sm border">
      {messages.map(message => {
        const isFromUser = message.sender_id === currentUserId;
        
        return (
          <div
            key={message.id}
            className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${
              isFromUser 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800'
            } rounded-2xl px-4 py-3 shadow-sm`}>
              <p className="leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  isFromUser ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  {format(new Date(message.created_at), 'h:mm a')}
                  {message.read && isFromUser && (
                    <span className="ml-2 text-blue-200">✓✓</span>
                  )}
                </p>
              </div>
              {!isFromUser && (
                <MessageReactions
                  messageId={message.id}
                  reactions={reactions[message.id]}
                  onReact={addReaction}
                />
              )}
            </div>
          </div>
        );
      })}
      
      <TypingIndicator isTyping={isOtherUserTyping} userName="Other user" />
      
      <div ref={messagesEndRef} />
    </div>
  );
};
