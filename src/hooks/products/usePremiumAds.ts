import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PremiumAdInfo {
  ad_type: 'featured' | 'bump' | 'vip' | 'spotlight';
  expires_at: string;
}

export const usePremiumAds = (productId?: string) => {
  const [premiumAdInfo, setPremiumAdInfo] = useState<PremiumAdInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkPremiumStatus = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_premium_ad_info', {
        product_uuid: id
      });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setPremiumAdInfo(data[0]);
      } else {
        setPremiumAdInfo(null);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      checkPremiumStatus(productId);
    }
  }, [productId]);

  const refreshPremiumStatus = () => {
    if (productId) {
      checkPremiumStatus(productId);
    }
  };

  return {
    premiumAdInfo,
    loading,
    refreshPremiumStatus,
    isPremium: !!premiumAdInfo,
    adType: premiumAdInfo?.ad_type,
    expiresAt: premiumAdInfo?.expires_at
  };
};