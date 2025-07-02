
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="mt-6 flex gap-3 bg-white p-4 rounded-lg shadow-sm border">
      <Input
        value={newMessage}
        onChange={handleInputChange}
        placeholder="Type your message..."
        disabled={disabled || sending}
        className="flex-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
        onBlur={stopTyping}
      />
      <Button 
        type="submit" 
        disabled={!newMessage.trim() || disabled || sending}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6"
      >
        {sending ? (
          <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};
