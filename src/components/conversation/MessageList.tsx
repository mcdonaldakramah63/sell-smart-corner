
import { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Send } from 'lucide-react';

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
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              <p className={`text-xs mt-2 ${
                isFromUser ? 'text-blue-100' : 'text-slate-500'
              }`}>
                {format(new Date(message.created_at), 'h:mm a')}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
