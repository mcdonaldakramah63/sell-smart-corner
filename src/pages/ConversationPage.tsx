
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  read: boolean;
}

interface ProductDetails {
  id: string;
  title: string;
  image?: string;
  price: number;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [otherUser, setOtherUser] = useState<Participant | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation data and messages
  useEffect(() => {
    const fetchConversationData = async () => {
      if (!id || !user?.id) return;
      
      try {
        setLoading(true);
        
        // Check if user is part of this conversation
        const { data: isParticipant, error: participantError } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', id)
          .eq('user_id', user.id);
        
        if (participantError) throw participantError;
        
        if (!isParticipant || isParticipant.length === 0) {
          toast({
            title: 'Access denied',
            description: 'You do not have access to this conversation',
            variant: 'destructive'
          });
          navigate('/messages');
          return;
        }
        
        // Get conversation details
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .select(`
            product_id,
            products:products (
              id,
              title,
              price
            )
          `)
          .eq('id', id)
          .single();
        
        if (conversationError) throw conversationError;
        
        // Get product image
        const { data: productImage } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', conversation.product_id)
          .eq('is_primary', true)
          .single();
        
        // Get other participant
        const { data: otherParticipant, error: participantsError } = await supabase
          .from('conversation_participants')
          .select(`
            user_id,
            profiles:profiles (
              full_name,
              username,
              avatar_url
            )
          `)
          .eq('conversation_id', id)
          .neq('user_id', user.id)
          .single();
        
        if (participantsError) throw participantsError;
        
        setProduct({
          id: conversation.products.id,
          title: conversation.products.title,
          price: conversation.products.price,
          image: productImage?.image_url
        });
        
        setOtherUser({
          id: otherParticipant.user_id,
          name: otherParticipant.profiles.full_name || otherParticipant.profiles.username,
          avatar: otherParticipant.profiles.avatar_url
        });
        
        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', id)
          .order('created_at');
        
        if (messagesError) throw messagesError;
        
        setMessages(messagesData);
        
        // Mark unread messages as read
        const unreadMessages = messagesData.filter(
          msg => !msg.read && msg.sender_id !== user.id
        );
        
        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map(msg => 
              supabase
                .from('messages')
                .update({ read: true })
                .eq('id', msg.id)
            )
          );
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
        toast({
          title: 'Error',
          description: 'Failed to load conversation',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversationData();
  }, [id, user?.id, toast, navigate]);

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!id) return;
    
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${id}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        
        // Add message to state
        setMessages(prev => [...prev, newMessage]);
        
        // Mark as read if from other user
        if (newMessage.sender_id !== user?.id) {
          supabase
            .from('messages')
            .update({ read: true })
            .eq('id', newMessage.id);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !id || !user?.id) return;
    
    try {
      setSending(true);
      
      // Send message
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: id,
          sender_id: user.id,
          content: newMessage.trim(),
          read: false
        });
      
      if (error) throw error;
      
      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);
      
      // Create notification for recipient
      await supabase
        .from('notifications')
        .insert({
          user_id: otherUser?.id,
          type: 'message',
          content: `New message about "${product?.title}"`,
          action_url: `/conversation/${id}`
        });
      
      // Clear input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-theme(spacing.16))]">
        {/* Header */}
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="mr-2" asChild>
            <Link to="/messages">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          
          {otherUser && (
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                {otherUser.avatar ? (
                  <AvatarImage src={otherUser.avatar} />
                ) : (
                  <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                )}
              </Avatar>
              <span className="font-medium">{otherUser.name}</span>
            </div>
          )}
        </div>
        
        {/* Product info card */}
        {product && (
          <Card className="p-3 mb-4 flex items-center">
            <div className="w-12 h-12 rounded overflow-hidden shrink-0 mr-3">
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium line-clamp-1">{product.title}</h3>
              <p className="text-sm font-semibold">${parseFloat(product.price.toString()).toFixed(2)}</p>
            </div>
            <Button size="sm" variant="outline" className="ml-auto shrink-0" asChild>
              <Link to={`/product/${product.id}`}>View</Link>
            </Button>
          </Card>
        )}
        
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto pb-4 space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground">
                    Send a message to start the conversation
                  </p>
                </div>
              ) : (
                messages.map(message => {
                  const isFromUser = message.sender_id === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${isFromUser ? 'bg-primary text-white' : 'bg-muted'} rounded-lg px-4 py-2`}>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${isFromUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {format(new Date(message.created_at), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message input */}
            <form onSubmit={sendMessage} className="mt-4 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={sending}
                className="flex-1"
              />
              <Button type="submit" disabled={!newMessage.trim() || sending}>
                {sending ? (
                  <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
}
