
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
        
        // Check if user is part of this conversation using security definer function
        console.log('Checking if user is participant using security definer function');
        const { data: participants, error: participantError } = await supabase
          .rpc('get_conversation_participants', { conversation_uuid: id });
        
        if (participantError) {
          console.error('Error checking participants:', participantError);
          throw participantError;
        }
        
        const participantIds = participants?.map(p => p.user_id) || [];
        const isParticipant = participantIds.includes(user.id);
        
        if (!isParticipant) {
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
        
        // Get other participant (not current user)
        const otherParticipantId = participantIds.find(pid => pid !== user.id);
        
        if (!otherParticipantId) {
          throw new Error('Could not find other participant');
        }
        
        // Get profile data for other participant
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url')
          .eq('id', otherParticipantId)
          .single();
        
        setProduct({
          id: conversation.products.id,
          title: conversation.products.title,
          price: conversation.products.price,
          image: productImage?.image_url
        });
        
        setOtherUser({
          id: otherParticipantId,
          name: profileData?.full_name || profileData?.username || 'Unknown User',
          avatar: profileData?.avatar_url
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
      if (otherUser?.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: otherUser.id,
            type: 'message',
            content: `New message about "${product?.title}"`,
            action_url: `/conversation/${id}`
          });
      }
      
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-theme(spacing.16))]">
          {/* Header */}
          <div className="flex items-center mb-6 p-4 bg-white rounded-lg shadow-sm border">
            <Button variant="ghost" size="sm" className="mr-3 hover:bg-slate-100" asChild>
              <Link to="/messages">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Messages
              </Link>
            </Button>
            
            {otherUser && (
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 ring-2 ring-slate-200">
                  {otherUser.avatar ? (
                    <AvatarImage src={otherUser.avatar} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {otherUser.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="font-semibold text-slate-800">{otherUser.name}</span>
              </div>
            )}
          </div>
          
          {/* Product info card */}
          {product && (
            <Card className="p-4 mb-6 flex items-center bg-gradient-to-r from-white to-slate-50 border shadow-sm">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 mr-4 shadow-sm">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold line-clamp-1 text-slate-800">{product.title}</h3>
                <p className="text-lg font-bold text-green-600">${parseFloat(product.price.toString()).toFixed(2)}</p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto shrink-0 hover:bg-blue-50 border-blue-200" asChild>
                <Link to={`/product/${product.id}`}>View Product</Link>
              </Button>
            </Card>
          )}
          
          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto pb-4 space-y-4 bg-white rounded-lg p-4 shadow-sm border">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="p-8 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 mb-4">
                      <Send className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Start the conversation</h3>
                    <p className="text-slate-500">Send a message to get things started</p>
                  </div>
                ) : (
                  messages.map(message => {
                    const isFromUser = message.sender_id === user?.id;
                    
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
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message input */}
              <form onSubmit={sendMessage} className="mt-6 flex gap-3 bg-white p-4 rounded-lg shadow-sm border">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="flex-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || sending}
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
