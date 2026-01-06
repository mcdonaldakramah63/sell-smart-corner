
import { ReactNode } from 'react';
import { ConversationHeader } from '@/components/conversation/ConversationHeader';
import { ProductInfoCard } from '@/components/conversation/ProductInfoCard';
import { CommunicationActions } from '@/components/conversation/CommunicationActions';

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
  phone?: string;
  email?: string;
  location?: string;
}

interface ConversationLayoutProps {
  otherUser: Participant | null;
  product: ProductDetails | null;
  loading: boolean;
  children: ReactNode;
  conversationId?: string;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}

export const ConversationLayout = ({ 
  otherUser, 
  product, 
  loading, 
  children,
  conversationId,
  onVoiceCall,
  onVideoCall
}: ConversationLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      <div className="max-w-6xl mx-auto flex-1 flex flex-col w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1">
          {/* Sidebar - Product Info (hidden when no product) */}
          {product && (
            <div className="hidden lg:block lg:col-span-4 bg-card/50 backdrop-blur-sm border-r border-border/50">
              <div className="sticky top-0 p-6 space-y-6">
                <ProductInfoCard product={product} />
                {otherUser && (
                  <CommunicationActions 
                    otherUser={otherUser} 
                    productTitle={product.title}
                    onVoiceCall={onVoiceCall}
                    onVideoCall={onVideoCall}
                  />
                )}
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div className={`flex flex-col ${product ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            <div className="sticky top-0 z-20">
              <ConversationHeader 
                otherUser={otherUser} 
                conversationId={conversationId}
                onVoiceCall={onVoiceCall}
                onVideoCall={onVideoCall}
              />
            </div>
            
            {loading ? (
              <div className="flex-1 flex justify-center items-center bg-gradient-to-b from-muted/20 to-muted/40 min-h-[50vh]">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  </div>
                  <p className="text-muted-foreground font-medium">Loading conversation...</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
