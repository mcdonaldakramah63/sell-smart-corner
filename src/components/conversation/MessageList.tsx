
import { useRef, useEffect } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Send, Check, CheckCheck, Paperclip } from 'lucide-react';
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
  media_url?: string;
  media_type?: string;
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-muted/20 to-muted/40">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/10">
            <Send className="h-9 w-9 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Start your conversation</h3>
          <p className="text-muted-foreground leading-relaxed">
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
    <div className="flex-1 overflow-y-auto min-h-0 bg-gradient-to-b from-muted/20 via-muted/30 to-muted/40">
      <div className="p-3 md:p-6 space-y-6 pb-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-3 md:space-y-4">
            {/* Date separator */}
            <div className="flex items-center justify-center py-2">
              <div className="bg-card/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-border/50">
                <span className="text-xs font-medium text-muted-foreground">
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
              const isLastInGroup = index === dateMessages.length - 1 || dateMessages[index + 1]?.sender_id !== message.sender_id;
              
              return (
                <div key={message.id} className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} group`}>
                  <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${isFromUser ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar for other user */}
                    {!isFromUser && (
                      <div className="flex-shrink-0 self-end">
                        {showAvatar ? (
                          <Avatar className="h-7 w-7 md:h-8 md:w-8 shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/60 text-secondary-foreground text-xs font-medium">
                              U
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-7 w-7 md:h-8 md:w-8" />
                        )}
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className={`relative px-3.5 py-2.5 md:px-4 md:py-3 shadow-sm transition-all ${
                      isFromUser 
                        ? `bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ${isLastInGroup ? 'rounded-2xl rounded-br-md' : 'rounded-2xl'}` 
                        : `bg-card border border-border/50 text-card-foreground ${isLastInGroup ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl'}`
                    }`}>
                      {/* Media content */}
                      {message.media_url && (
                        <div className="mb-2">
                          {message.media_type?.startsWith('image/') ? (
                            <img 
                              src={message.media_url} 
                              alt="Shared image" 
                              className="max-w-[200px] md:max-w-[280px] max-h-[200px] md:max-h-[280px] w-auto h-auto rounded-xl cursor-pointer object-cover shadow-md hover:shadow-lg transition-shadow"
                              onClick={() => window.open(message.media_url, '_blank')}
                              loading="lazy"
                            />
                          ) : message.media_type?.startsWith('video/') ? (
                            <video 
                              src={message.media_url} 
                              controls 
                              className="max-w-[220px] md:max-w-[300px] max-h-[200px] md:max-h-[250px] rounded-xl shadow-md"
                              preload="metadata"
                            />
                          ) : message.media_type?.startsWith('audio/') ? (
                            <audio 
                              src={message.media_url} 
                              controls 
                              className="max-w-[180px] md:max-w-[240px]"
                              preload="metadata"
                            />
                          ) : (
                            <a 
                              href={message.media_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 p-3 rounded-xl text-sm transition-colors max-w-[180px] md:max-w-[220px] ${
                                isFromUser 
                                  ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20' 
                                  : 'bg-muted/50 hover:bg-muted/80'
                              }`}
                            >
                              <Paperclip className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate font-medium">Document</span>
                            </a>
                          )}
                        </div>
                      )}
                      
                      {/* Text content */}
                      {message.content && (
                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      )}
                      
                      {/* Message metadata */}
                      <div className={`flex items-center justify-end gap-1.5 mt-1.5 ${
                        isFromUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <span className="text-[10px] md:text-xs">
                          {formatMessageTime(message.created_at)}
                        </span>
                        
                        {isFromUser && (
                          <div className="flex items-center">
                            {message.read ? (
                              <CheckCheck className="h-3.5 w-3.5 text-sky-300" />
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
