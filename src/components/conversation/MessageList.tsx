
import { useRef, useEffect } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Send, Check, CheckCheck } from 'lucide-react';
import { TypingIndicator } from '@/components/conversation/TypingIndicator';
import { MessageReactions } from '@/components/conversation/MessageReactions';
import { useMessageReactions } from '@/hooks/useMessageReactions';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

const formatMessageTime = (date: string) => {
  const messageDate = new Date(date);
  
  if (isToday(messageDate)) {
    return format(messageDate, 'h:mm a');
  } else if (isYesterday(messageDate)) {
    return `Yesterday ${format(messageDate, 'h:mm a')}`;
  } else {
    return format(messageDate, 'MMM d, h:mm a');
  }
};

export const MessageList = ({ messages, currentUserId, conversationId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { reactions, addReaction, loadReactions } = useMessageReactions();
  const { isOtherUserTyping } = useTypingIndicator({ conversationId });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    messages.forEach(message => {
      loadReactions(message.id);
    });
  }, [messages, loadReactions]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Start your conversation</h3>
          <p className="text-slate-600">
            Send a message to connect with the seller and discuss the product details.
          </p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = format(new Date(message.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-4 space-y-6">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            {/* Date separator */}
            <div className="flex items-center justify-center">
              <div className="bg-white px-3 py-1 rounded-full shadow-sm border">
                <span className="text-xs font-medium text-slate-600">
                  {isToday(new Date(date)) ? 'Today' : 
                   isYesterday(new Date(date)) ? 'Yesterday' : 
                   format(new Date(date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message, index) => {
              const isFromUser = message.sender_id === currentUserId;
              const showAvatar = !isFromUser && (index === 0 || dateMessages[index - 1]?.sender_id !== message.sender_id);
              
              return (
                <div key={message.id} className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} group`}>
                  <div className={`flex max-w-[70%] space-x-2 ${isFromUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar for other user */}
                    {!isFromUser && (
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                              U
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8" />
                        )}
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                      isFromUser 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-slate-800 border border-slate-200'
                    }`}>
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      
                      {/* Message metadata */}
                      <div className={`flex items-center justify-between mt-2 space-x-2 ${
                        isFromUser ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        <span className="text-xs">
                          {formatMessageTime(message.created_at)}
                        </span>
                        
                        {isFromUser && (
                          <div className="flex items-center">
                            {message.read ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Message reactions */}
                      {!isFromUser && (
                        <MessageReactions
                          messageId={message.id}
                          reactions={reactions[message.id]}
                          onReact={addReaction}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        <TypingIndicator isTyping={isOtherUserTyping} userName="Seller" />
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
