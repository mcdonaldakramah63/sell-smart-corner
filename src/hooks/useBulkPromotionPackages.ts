
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface BulkPromotionPackage {
  id: string;
  name: string;
  package_type: string;
  ad_count: number;
  total_price: number;
  discount_percentage: number;
  duration_days: number;
  features: any;
  is_active: boolean;
}

export interface UserPackagePurchase {
  id: string;
  user_id: string;
  package_id: string;
  ads_remaining: number;
  expires_at: string;
  created_at: string;
}

export const useBulkPromotionPackages = () => {
  const [packages, setPackages] = useState<BulkPromotionPackage[]>([]);
  const [userPackages, setUserPackages] = useState<UserPackagePurchase[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bulk_promotion_packages')
        .select('*')
        .eq('is_active', true)
        .order('total_price');

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load promotion packages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPackages = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_package_purchases')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .gt('ads_remaining', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPackages(data || []);
    } catch (error) {
      console.error('Error fetching user packages:', error);
    }
  };

  const purchasePackage = async (packageId: string, transactionId: string) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    const selectedPackage = packages.find(p => p.id === packageId);
    if (!selectedPackage) return { success: false, error: 'Package not found' };

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + selectedPackage.duration_days);

      const { data, error } = await supabase
        .from('user_package_purchases')
        .insert({
          user_id: user.id,
          package_id: packageId,
          transaction_id: transactionId,
          ads_remaining: selectedPackage.ad_count,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Package purchased!',
        description: `You now have ${selectedPackage.ad_count} promotion credits`,
      });

      fetchUserPackages();
      return { success: true, data };
    } catch (error) {
      console.error('Error purchasing package:', error);
      toast({
        title: 'Purchase failed',
        description: 'Failed to purchase package',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchPackages();
    if (user?.id) {
      fetchUserPackages();
    }
  }, [user?.id]);

  return {
    packages,
    userPackages,
    loading,
    purchasePackage,
    refetch: fetchPackages,
    refetchUserPackages: fetchUserPackages
  };
};
