
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface BusinessAccount {
  id: string;
  business_name: string;
  business_type: string;
  registration_number?: string;
  tax_id?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  website_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  subscription_plan: string;
  subscription_expires_at?: string;
}

export const useBusinessAccount = () => {
  const [businessAccount, setBusinessAccount] = useState<BusinessAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchBusinessAccount = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setBusinessAccount({
          ...data,
          verification_status: data.verification_status as 'pending' | 'verified' | 'rejected'
        });
      }
    } catch (error) {
      console.error('Error fetching business account:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBusinessAccount = async (accountData: Partial<BusinessAccount>) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_accounts')
        .insert({
          user_id: user.id,
          business_name: accountData.business_name || '',
          business_type: accountData.business_type || '',
          registration_number: accountData.registration_number,
          tax_id: accountData.tax_id,
          business_address: accountData.business_address,
          business_phone: accountData.business_phone,
          business_email: accountData.business_email,
          website_url: accountData.website_url,
          verification_status: accountData.verification_status || 'pending',
          subscription_plan: accountData.subscription_plan || 'basic'
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setBusinessAccount({
          ...data,
          verification_status: data.verification_status as 'pending' | 'verified' | 'rejected'
        });
      }

      toast({
        title: 'Business account created',
        description: 'Your business account has been created successfully.',
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error creating business account:', error);
      toast({
        title: 'Creation failed',
        description: 'Failed to create business account.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessAccount = async (accountData: Partial<BusinessAccount>) => {
    if (!user?.id || !businessAccount) return { success: false, error: 'No business account found' };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_accounts')
        .update({
          business_name: accountData.business_name,
          business_type: accountData.business_type,
          registration_number: accountData.registration_number,
          tax_id: accountData.tax_id,
          business_address: accountData.business_address,
          business_phone: accountData.business_phone,
          business_email: accountData.business_email,
          website_url: accountData.website_url,
          verification_status: accountData.verification_status,
          subscription_plan: accountData.subscription_plan,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setBusinessAccount({
          ...data,
          verification_status: data.verification_status as 'pending' | 'verified' | 'rejected'
        });
      }

      toast({
        title: 'Business account updated',
        description: 'Your business account has been updated successfully.',
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error updating business account:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update business account.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessAccount();
  }, [user?.id]);

  return {
    businessAccount,
    loading,
    createBusinessAccount,
    updateBusinessAccount,
    refetch: fetchBusinessAccount
  };
};
