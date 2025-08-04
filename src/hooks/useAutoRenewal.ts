
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AutoRenewalSetting {
  id: string;
  user_id: string;
  product_id: string;
  ad_type: 'featured' | 'vip' | 'spotlight' | 'bump';
  is_enabled: boolean;
  renewal_frequency: number;
  max_renewals?: number;
  current_renewals: number;
  created_at: string;
}

export const useAutoRenewal = () => {
  const [settings, setSettings] = useState<AutoRenewalSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRenewalSettings = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('auto_renewal_settings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching renewal settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load auto-renewal settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createRenewalSetting = async (
    productId: string,
    adType: 'featured' | 'vip' | 'spotlight' | 'bump',
    renewalFrequency: number = 30,
    maxRenewals?: number
  ) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('auto_renewal_settings')
        .insert({
          user_id: user.id,
          product_id: productId,
          ad_type: adType,
          renewal_frequency: renewalFrequency,
          max_renewals: maxRenewals,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Auto-renewal setting created',
      });

      fetchRenewalSettings();
    } catch (error) {
      console.error('Error creating renewal setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to create auto-renewal setting',
        variant: 'destructive',
      });
    }
  };

  const updateRenewalSetting = async (
    settingId: string,
    updates: Partial<AutoRenewalSetting>
  ) => {
    try {
      const { error } = await supabase
        .from('auto_renewal_settings')
        .update(updates)
        .eq('id', settingId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Auto-renewal setting updated',
      });

      fetchRenewalSettings();
    } catch (error) {
      console.error('Error updating renewal setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update auto-renewal setting',
        variant: 'destructive',
      });
    }
  };

  const toggleRenewal = async (settingId: string, enabled: boolean) => {
    await updateRenewalSetting(settingId, { is_enabled: enabled });
  };

  useEffect(() => {
    fetchRenewalSettings();
  }, [user?.id]);

  return {
    settings,
    loading,
    createRenewalSetting,
    updateRenewalSetting,
    toggleRenewal,
    refetch: fetchRenewalSettings,
  };
};
