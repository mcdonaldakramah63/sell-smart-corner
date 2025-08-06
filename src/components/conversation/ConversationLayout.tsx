
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
}

interface ConversationLayoutProps {
  otherUser: Participant | null;
  product: ProductDetails | null;
  loading: boolean;
  children: ReactNode;
}

export const ConversationLayout = ({ 
  otherUser, 
  product, 
  loading, 
  children 
}: ConversationLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-screen">
          {/* Sidebar - Product Info */}
          <div className="lg:col-span-4 bg-white border-r border-slate-200">
            <div className="sticky top-0 p-4 space-y-4">
              {product && (
                <div className="space-y-4">
                  <ProductInfoCard product={product} />
                  {otherUser && (
                    <CommunicationActions 
                      otherUser={otherUser} 
                      productTitle={product.title} 
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-8 bg-white flex flex-col">
            <ConversationHeader otherUser={otherUser} />
            
            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="text-slate-500">Loading conversation...</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
