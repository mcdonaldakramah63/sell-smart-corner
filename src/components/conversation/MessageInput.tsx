
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile, Paperclip, Mic, X } from 'lucide-react';
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

  const insertAtCursor = (text: string) => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? newMessage.length;
    const end = input.selectionEnd ?? newMessage.length;
    const updated = newMessage.slice(0, start) + text + newMessage.slice(end);
    setNewMessage(updated);
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
    
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please select a file smaller than 10MB.' });
      return;
    }
    
    setSelectedMedia(file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
    
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
    toast({ title: 'Listening...', description: 'Speak and we will transcribe into the message box.' });
  };

  return (
    <div className="z-30 bg-card/95 backdrop-blur-xl border-t border-border/50 mt-auto safe-area-pb">
      <div className="p-3 md:p-4">
        {/* Media preview */}
        {selectedMedia && (
          <div className="mb-3 p-3 bg-muted/50 rounded-2xl border border-border/50 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {mediaPreview ? (
                  <img src={mediaPreview} alt="Preview" className="w-14 h-14 object-cover rounded-xl shadow-sm" />
                ) : (
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Paperclip className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{selectedMedia.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedMedia.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeMedia}
                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-2 md:gap-3">
          <div className="flex-1 relative">
            <div className="flex items-center gap-1 bg-muted/50 rounded-full border border-border/50 pr-1 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <Input
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type a message..."
                disabled={disabled || sending || uploading}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 text-sm md:text-base placeholder:text-muted-foreground/60"
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
              
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-muted transition-colors"
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
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-muted transition-colors"
                      aria-label="Add emoji"
                    >
                      <Smile className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" sideOffset={12} className="w-72 p-3 rounded-2xl">
                    <div className="grid grid-cols-8 gap-1.5">
                      {EMOJIS.map((e) => (
                        <button
                          key={e}
                          type="button"
                          className="text-xl leading-none p-2 hover:bg-muted rounded-xl transition-colors"
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
          </div>

          {newMessage.trim() || selectedMedia ? (
            <Button 
              type="submit" 
              disabled={disabled || sending || uploading}
              size="icon"
              className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              {sending || uploading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          ) : (
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              className={`h-11 w-11 md:h-12 md:w-12 rounded-full transition-all ${
                isDictating 
                  ? 'bg-destructive/10 text-destructive animate-pulse' 
                  : 'hover:bg-muted'
              }`}
              aria-label="Voice dictation"
              aria-pressed={isDictating}
              onClick={handleVoiceClick}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </form>
        
        <div className="flex justify-between items-center mt-2 px-3">
          <span className="text-[10px] md:text-xs text-muted-foreground/60">
            {newMessage.length}/1000
          </span>
          <span className="text-[10px] md:text-xs text-muted-foreground/60">
            Press Enter to send
          </span>
        </div>
      </div>
    </div>
  );
};
