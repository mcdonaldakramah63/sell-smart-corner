
import { ReactNode } from 'react';
import { ConversationHeader } from '@/components/conversation/ConversationHeader';
import { ProductInfoCard } from '@/components/conversation/ProductInfoCard';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8 flex flex-col h-[calc(100vh-theme(spacing.14))] sm:h-[calc(100vh-theme(spacing.16))]">
        <ConversationHeader otherUser={otherUser} />
        
        {product && <ProductInfoCard product={product} />}
        
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
