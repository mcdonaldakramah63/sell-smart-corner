
import { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
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
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-theme(spacing.16))]">
          <ConversationHeader otherUser={otherUser} />
          
          {product && <ProductInfoCard product={product} />}
          
          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </Layout>
  );
};
