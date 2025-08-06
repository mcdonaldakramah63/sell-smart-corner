
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  conversationId?: string;
}

export const MessageInput = ({ onSendMessage, disabled = false, conversationId }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { startTyping, stopTyping } = useTypingIndicator({ conversationId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;
    
    try {
      setSending(true);
      stopTyping();
      await onSendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={disabled || sending}
              className="pr-20 py-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-full"
              onBlur={stopTyping}
              maxLength={1000}
            />
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <Paperclip className="h-4 w-4 text-slate-500" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <Smile className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>

          {newMessage.trim() ? (
            <Button 
              type="submit" 
              disabled={disabled || sending}
              className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 p-0"
            >
              {sending ? (
                <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5 text-white" />
              )}
            </Button>
          ) : (
            <Button 
              type="button"
              variant="ghost"
              className="h-12 w-12 rounded-full hover:bg-slate-100 p-0"
            >
              <Mic className="h-5 w-5 text-slate-500" />
            </Button>
          )}
        </form>
        
        <div className="flex justify-between items-center mt-2 px-2">
          <span className="text-xs text-slate-500">
            {newMessage.length}/1000
          </span>
          <span className="text-xs text-slate-500">
            Press Enter to send
          </span>
        </div>
      </div>
    </div>
  );
};
