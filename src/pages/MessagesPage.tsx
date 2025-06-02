import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { MessageSquare, Send } from 'lucide-react';

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
        
        // Get all conversations with their products
        const { data: allConversations, error: conversationsError } = await supabase
          .from('conversations')
          .select(`
            id,
            product_id,
            updated_at,
            products (
              id,
              title
            )
          `);
        
        if (conversationsError) throw conversationsError;
        
        if (!allConversations.length) {
          setConversations([]);
          return;
        }
        
        // Filter conversations where the user is a participant
        const userConversations = [];
        
        for (const conversation of allConversations) {
          // Check if user is participant in this conversation using the security definer function
          const { data: participants, error: participantsError } = await supabase
            .rpc('get_conversation_participants', { conversation_uuid: conversation.id });
          
          if (participantsError) {
            console.error('Error checking participants:', participantsError);
            continue;
          }
          
          const participantIds = participants?.map(p => p.user_id) || [];
          
          if (participantIds.includes(user.id)) {
            userConversations.push(conversation);
          }
        }
        
        // Process conversation data
        const conversationPreviews = await Promise.all(
          userConversations.map(async (conversation) => {
            // Get the other participant using the security definer function
            const { data: participants } = await supabase
              .rpc('get_conversation_participants', { conversation_uuid: conversation.id });
            
            const participantIds = participants?.map(p => p.user_id) || [];
            const otherParticipantId = participantIds.find(pid => pid !== user.id);
            
            // Get profile data for the other participant
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, username, avatar_url')
              .eq('id', otherParticipantId)
              .maybeSingle();
            
            // Get the most recent message
            const { data: lastMessageData } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conversation.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            // Get product image
            const { data: productImageData } = await supabase
              .from('product_images')
              .select('image_url')
              .eq('product_id', conversation.product_id)
              .eq('is_primary', true)
              .maybeSingle();
            
            const otherUser = otherParticipantId ? {
              id: otherParticipantId,
              name: profileData?.full_name || profileData?.username || 'Unknown User',
              avatar: profileData?.avatar_url
            } : {
              id: '',
              name: 'Unknown User',
              avatar: undefined
            };
            
            const lastMessage = lastMessageData ? {
              content: lastMessageData.content,
              timestamp: lastMessageData.created_at,
              read: lastMessageData.read || false,
              isFromUser: lastMessageData.sender_id === user.id
            } : undefined;
            
            return {
              id: conversation.id,
              product: {
                id: conversation.products?.id || '',
                title: conversation.products?.title || 'Unknown Product',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Messages
              </h1>
            </div>
            <p className="text-slate-600">Stay connected with buyers and sellers</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <Link key={conversation.id} to={`/conversation/${conversation.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-slate-200 hover:border-blue-200">
                    <div className="p-6 flex gap-4">
                      {/* Product image */}
                      <div className="hidden sm:block w-16 h-16 relative rounded-lg overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={conversation.product.image || '/placeholder.svg'}
                          alt={conversation.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Message preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold line-clamp-1 flex-1 text-slate-800">
                            {conversation.product.title}
                          </h3>
                          
                          {conversation.lastMessage && (
                            <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                              {format(new Date(conversation.lastMessage.timestamp), 'MMM d, h:mm a')}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <Avatar className="h-8 w-8 ring-2 ring-slate-100">
                            {conversation.otherUser.avatar ? (
                              <AvatarImage src={conversation.otherUser.avatar} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                                {conversation.otherUser.name[0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="text-sm font-medium text-slate-700 line-clamp-1">
                            {conversation.otherUser.name}
                          </span>
                        </div>
                        
                        {conversation.lastMessage ? (
                          <p className={`text-sm mt-3 line-clamp-2 ${
                            !conversation.lastMessage.read && !conversation.lastMessage.isFromUser 
                              ? 'font-medium text-slate-800' 
                              : 'text-slate-600'
                          }`}>
                            {conversation.lastMessage.isFromUser ? (
                              <span className="text-blue-600 font-medium">You: </span>
                            ) : null}
                            {conversation.lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-sm mt-3 text-slate-500 italic">
                            No messages yet - start the conversation
                          </p>
                        )}
                        
                        {conversation.lastMessage && !conversation.lastMessage.read && !conversation.lastMessage.isFromUser && (
                          <Badge variant="default" className="mt-3 bg-gradient-to-r from-blue-500 to-blue-600">
                            New message
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-6">
                <MessageSquare className="h-16 w-16 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">No messages yet</h2>
              <p className="text-slate-600 max-w-md mb-8 leading-relaxed">
                When you contact sellers or receive messages about your listings, they'll appear here.
              </p>
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Send className="h-4 w-4" />
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
