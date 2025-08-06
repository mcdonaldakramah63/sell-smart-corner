
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ConversationCard } from '@/components/messages/ConversationCard';
import { EmptyMessagesState } from '@/components/messages/EmptyMessagesState';
import { MessageSquare, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);

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
          `)
          .order('updated_at', { ascending: false });
        
        if (conversationsError) throw conversationsError;
        
        if (!allConversations.length) {
          setConversations([]);
          return;
        }
        
        // Filter conversations where the user is a participant
        const userConversations = [];
        
        for (const conversation of allConversations) {
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
            const { data: participants } = await supabase
              .rpc('get_conversation_participants', { conversation_uuid: conversation.id });
            
            const participantIds = participants?.map(p => p.user_id) || [];
            const otherParticipantId = participantIds.find(pid => pid !== user.id);
            
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, username, avatar_url')
              .eq('id', otherParticipantId)
              .maybeSingle();
            
            const { data: lastMessageData } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conversation.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
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
        
        setConversations(conversationPreviews);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [user?.id]);

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = !searchQuery || 
      conversation.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conversation.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = !filterUnread || 
      (conversation.lastMessage && !conversation.lastMessage.read && !conversation.lastMessage.isFromUser);
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = conversations.filter(c => 
    c.lastMessage && !c.lastMessage.read && !c.lastMessage.isFromUser
  ).length;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto py-6 px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                  <p className="text-slate-600">
                    {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                    {unreadCount > 0 && (
                      <Badge variant="default" className="ml-2 bg-blue-500">
                        {unreadCount} unread
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Search and Filter */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant={filterUnread ? "default" : "outline"}
                onClick={() => setFilterUnread(!filterUnread)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Unread
                {unreadCount > 0 && (
                  <Badge variant={filterUnread ? "secondary" : "default"} className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-slate-500">Loading conversations...</p>
              </div>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="space-y-3">
              {filteredConversations.map((conversation) => (
                <ConversationCard key={conversation.id} conversation={conversation} />
              ))}
            </div>
          ) : searchQuery || filterUnread ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No conversations found</h3>
              <p className="text-slate-500">
                {searchQuery ? 'Try adjusting your search query' : 'No unread conversations'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilterUnread(false);
                }}
                className="mt-4"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <EmptyMessagesState />
          )}
        </div>
      </div>
    </Layout>
  );
}
