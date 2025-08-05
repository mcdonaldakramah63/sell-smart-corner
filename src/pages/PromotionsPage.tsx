
import React from 'react';
import Layout from "@/components/layout/Layout";
import { AdvancedPromotionManager } from '@/components/promotions/AdvancedPromotionManager';

const PromotionsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AdvancedPromotionManager />
      </div>
    </Layout>
  );
};

export default PromotionsPage;
