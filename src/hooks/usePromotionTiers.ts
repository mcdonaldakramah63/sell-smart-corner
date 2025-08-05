
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PromotionTier {
  id: string;
  name: string;
  type: 'featured' | 'top' | 'urgent' | 'spotlight' | 'vip' | 'bump';
  price: number;
  duration_hours: number;
  boost_multiplier: number;
  priority_score: number;
  features: any;
  is_active: boolean;
}

export const usePromotionTiers = () => {
  const [promotionTiers, setPromotionTiers] = useState<PromotionTier[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPromotionTiers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('promotion_tiers')
        .select('*')
        .eq('is_active', true)
        .order('priority_score', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to match our interface
      const typedData = (data || []).map(tier => ({
        ...tier,
        type: tier.type as PromotionTier['type']
      }));
      
      setPromotionTiers(typedData);
    } catch (error) {
      console.error('Error fetching promotion tiers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load promotion tiers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotionTiers();
  }, []);

  return {
    promotionTiers,
    loading,
    refetch: fetchPromotionTiers
  };
};
