
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  description?: string;
  commission_rate: number;
  max_uses?: number;
  current_uses: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReferralTransaction {
  id: string;
  referral_code_id: string;
  referee_id: string;
  referrer_id: string;
  transaction_id?: string;
  commission_amount: number;
  commission_status: 'pending' | 'paid' | 'cancelled';
  paid_at?: string;
  created_at: string;
}

export const useReferral = () => {
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [transactions, setTransactions] = useState<ReferralTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReferralCodes = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setReferralCodes(data as ReferralCode[]);
    } catch (error) {
      console.error('Error fetching referral codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralTransactions = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('referral_transactions')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        const typedData = data.map(transaction => ({
          ...transaction,
          commission_status: transaction.commission_status as 'pending' | 'paid' | 'cancelled'
        })) as ReferralTransaction[];
        setTransactions(typedData);
      }
    } catch (error) {
      console.error('Error fetching referral transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReferralCode = async (description?: string, commissionRate: number = 0.05, maxUses?: number, expiresAt?: string) => {
    if (!user?.id) return null;

    setLoading(true);
    try {
      // Generate unique code
      const code = `REF${user.id.slice(-6).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;

      const { data, error } = await supabase
        .from('referral_codes')
        .insert({
          user_id: user.id,
          code,
          description,
          commission_rate: commissionRate,
          max_uses: maxUses,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setReferralCodes(prev => [data as ReferralCode, ...prev]);
        toast({
          title: 'Referral code created',
          description: `Your referral code "${code}" has been created`,
        });
      }

      return data as ReferralCode;
    } catch (error) {
      console.error('Error creating referral code:', error);
      toast({
        title: 'Creation failed',
        description: 'Failed to create referral code',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateReferralCode = async (codeId: string, updates: Partial<ReferralCode>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .update(updates)
        .eq('id', codeId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setReferralCodes(prev => prev.map(code => code.id === codeId ? data as ReferralCode : code));
        toast({
          title: 'Referral code updated',
          description: 'Your referral code has been updated',
        });
      }

      return data as ReferralCode;
    } catch (error) {
      console.error('Error updating referral code:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update referral code',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validateReferralCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) return null;

      // Check if code is still valid
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return null;
      }

      if (data.max_uses && data.current_uses >= data.max_uses) {
        return null;
      }

      return data as ReferralCode;
    } catch (error) {
      console.error('Error validating referral code:', error);
      return null;
    }
  };

  const getReferralStats = () => {
    const totalCommission = transactions.reduce((sum, transaction) => {
      return sum + (transaction.commission_status === 'paid' ? transaction.commission_amount : 0);
    }, 0);

    const pendingCommission = transactions.reduce((sum, transaction) => {
      return sum + (transaction.commission_status === 'pending' ? transaction.commission_amount : 0);
    }, 0);

    const totalReferrals = transactions.length;
    const activeReferralCodes = referralCodes.filter(code => code.is_active).length;

    return {
      totalCommission,
      pendingCommission,
      totalReferrals,
      activeReferralCodes
    };
  };

  useEffect(() => {
    if (user?.id) {
      fetchReferralCodes();
      fetchReferralTransactions();
    }
  }, [user?.id]);

  return {
    referralCodes,
    transactions,
    loading,
    createReferralCode,
    updateReferralCode,
    validateReferralCode,
    getReferralStats,
    refetch: () => {
      fetchReferralCodes();
      fetchReferralTransactions();
    }
  };
};
