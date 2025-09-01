
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile, Paperclip, Mic, Image, X } from 'lucide-react';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MessageInputProps {
  onSendMessage: (message: string, mediaUrl?: string, mediaType?: string) => Promise<void>;
  disabled?: boolean;
  conversationId?: string;
  prefillText?: string;
  onPrefillConsumed?: () => void;
}

export const MessageInput = ({ onSendMessage, disabled = false, conversationId, prefillText, onPrefillConsumed }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { startTyping, stopTyping } = useTypingIndicator({ conversationId });
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const [isDictating, setIsDictating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (prefillText && !disabled) {
      setNewMessage(prefillText);
      inputRef.current?.focus();
      startTyping();
      onPrefillConsumed?.();
    }
  }, [prefillText, disabled, startTyping, onPrefillConsumed]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedMedia) || sending) return;
    
    try {
      setSending(true);
      stopTyping();
      
      let mediaUrl = '';
      let mediaType = '';
      
      if (selectedMedia) {
        const uploadResult = await uploadMedia(selectedMedia);
        if (uploadResult) {
          mediaUrl = uploadResult.url;
          mediaType = uploadResult.type;
        }
      }
      
      await onSendMessage(newMessage.trim(), mediaUrl, mediaType);
      setNewMessage('');
      setSelectedMedia(null);
      setMediaPreview(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: 'Error', description: 'Failed to send message. Please try again.' });
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
  // Insert text at the cursor position in the input
  const insertAtCursor = (text: string) => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? newMessage.length;
    const end = input.selectionEnd ?? newMessage.length;
    const updated = newMessage.slice(0, start) + text + newMessage.slice(end);
    setNewMessage(updated);
    // Move caret
    requestAnimationFrame(() => {
      input.focus();
      const newPos = start + text.length;
      input.setSelectionRange(newPos, newPos);
    });
    startTyping();
  };

  const EMOJIS = ['👍','😊','😂','🙏','🎉','❤️','💯','📸','📍','✅','❓','📞','🚗','💸','📦','⏰'];

  const uploadMedia = async (file: File) => {
    if (!user || !conversationId) return null;
    
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${conversationId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('chat-media')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(data.path);
      
      return {
        url: publicUrl,
        type: file.type
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({ title: 'Upload failed', description: 'Failed to upload media. Please try again.' });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please select a file smaller than 10MB.' });
      return;
    }
    
    setSelectedMedia(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
    
    // Reset input so same file can be selected again
    e.currentTarget.value = '';
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    insertAtCursor(emoji);
  };

  const handleVoiceClick = () => {
    // Web Speech API (dictation) fallback
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: 'Voice input unavailable', description: 'Your browser does not support dictation.' });
      return;
    }

    if (isDictating) {
      recognitionRef.current?.stop?.();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript) {
        insertAtCursor(transcript);
      }
    };

    recognition.onend = () => {
      setIsDictating(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setIsDictating(false);
      recognitionRef.current = null;
      toast({ title: 'Dictation error', description: 'Please try again.' });
    };

    recognitionRef.current = recognition;
    setIsDictating(true);
    recognition.start();
    toast({ title: 'Listening…', description: 'Speak and we’ll transcribe into the message box.' });
  };

  return (
    <div className="sticky bottom-0 z-30 border-t border-border bg-background safe-area-pb">
      <div className="p-3">
        {/* Media preview */}
        {selectedMedia && (
          <div className="mb-3 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {mediaPreview ? (
                  <img src={mediaPreview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                    <Paperclip className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{selectedMedia.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedMedia.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeMedia}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={disabled || sending || uploading}
              className="pr-24 py-3 rounded-full"
              ref={inputRef}
              onBlur={stopTyping}
              maxLength={1000}
            />
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 hover:bg-muted tap-target"
                aria-label="Attach file"
                onClick={handleAttachClick}
              >
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 hover:bg-muted tap-target"
                    aria-label="Add emoji"
                  >
                    <Smile className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={8} className="w-64 p-2">
                  <div className="grid grid-cols-8 gap-1">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        className="text-xl leading-none p-1 hover:bg-muted rounded"
                        onClick={() => handleEmojiSelect(e)}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {newMessage.trim() || selectedMedia ? (
            <Button 
              type="submit" 
              disabled={disabled || sending || uploading}
              className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 p-0"
            >
              {sending || uploading ? (
                <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5 text-white" />
              )}
            </Button>
          ) : (
            <Button 
              type="button"
              variant="ghost"
              className="h-12 w-12 rounded-full hover:bg-muted p-0 tap-target"
              aria-label="Voice dictation"
              aria-pressed={isDictating}
              onClick={handleVoiceClick}
            >
              <Mic className={isDictating ? "h-5 w-5 text-destructive animate-pulse" : "h-5 w-5 text-muted-foreground"} />
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
