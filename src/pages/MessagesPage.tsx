
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';

interface ConversationPreview {
  id: string;
  product: {
    id: string;
    title: string;
    image?: string;
  };
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    read: boolean;
    isFromUser: boolean;
  };
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Get conversations the user is part of
        const { data: userConversations, error: conversationsError } = await supabase
          .from('conversation_participants')
          .select(`
            conversation:conversations (
              id,
              product_id,
              updated_at,
              products:products (
                id,
                title
              )
            )
          `)
          .eq('user_id', user.id);
        
        if (conversationsError) throw conversationsError;
        
        if (!userConversations.length) {
          setConversations([]);
          return;
        }
        
        // Process conversation data
        const conversationPreviews = await Promise.all(
          userConversations.map(async ({ conversation }) => {
            // Get the other participant
            const { data: participants } = await supabase
              .from('conversation_participants')
              .select(`
                user_id,
                profiles:profiles (
                  full_name,
                  username,
                  avatar_url
                )
              `)
              .eq('conversation_id', conversation.id)
              .neq('user_id', user.id)
              .single();
            
            // Get the most recent message
            const { data: lastMessageData } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conversation.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            
            // Get product image
            const { data: productImageData } = await supabase
              .from('product_images')
              .select('image_url')
              .eq('product_id', conversation.product_id)
              .eq('is_primary', true)
              .single();
            
            const otherUser = participants ? {
              id: participants.user_id,
              name: participants.profiles.full_name || participants.profiles.username,
              avatar: participants.profiles.avatar_url
            } : {
              id: '',
              name: 'Unknown User',
              avatar: undefined
            };
            
            const lastMessage = lastMessageData ? {
              content: lastMessageData.content,
              timestamp: lastMessageData.created_at,
              read: lastMessageData.read,
              isFromUser: lastMessageData.sender_id === user.id
            } : undefined;
            
            return {
              id: conversation.id,
              product: {
                id: conversation.products.id,
                title: conversation.products.title,
                image: productImageData?.image_url
              },
              otherUser,
              lastMessage
            };
          })
        );
        
        // Sort by most recent message
        conversationPreviews.sort((a, b) => {
          if (!a.lastMessage && !b.lastMessage) return 0;
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;
          return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
        
        setConversations(conversationPreviews);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [user?.id]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link key={conversation.id} to={`/conversation/${conversation.id}`}>
                <Card className="hover:bg-accent/30 transition-colors cursor-pointer">
                  <div className="p-4 flex gap-4">
                    {/* Product image */}
                    <div className="hidden sm:block w-16 h-16 relative rounded overflow-hidden shrink-0">
                      <img
                        src={conversation.product.image || '/placeholder.svg'}
                        alt={conversation.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Message preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium line-clamp-1 flex-1">
                          {conversation.product.title}
                        </h3>
                        
                        {conversation.lastMessage && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(conversation.lastMessage.timestamp), 'MMM d, h:mm a')}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          {conversation.otherUser.avatar ? (
                            <AvatarImage src={conversation.otherUser.avatar} />
                          ) : (
                            <AvatarFallback>{conversation.otherUser.name[0]}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm line-clamp-1">{conversation.otherUser.name}</span>
                      </div>
                      
                      {conversation.lastMessage ? (
                        <p className={`text-sm mt-1 line-clamp-1 ${
                          !conversation.lastMessage.read && !conversation.lastMessage.isFromUser 
                            ? 'font-medium' 
                            : 'text-muted-foreground'
                        }`}>
                          {conversation.lastMessage.isFromUser ? 'You: ' : ''}
                          {conversation.lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-sm mt-1 text-muted-foreground italic">
                          No messages yet
                        </p>
                      )}
                      
                      {conversation.lastMessage && !conversation.lastMessage.read && !conversation.lastMessage.isFromUser && (
                        <Badge variant="default" className="mt-2">New</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-20 w-20 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              When you contact sellers or receive messages about your listings, they'll appear here.
            </p>
            <Link 
              to="/products" 
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
