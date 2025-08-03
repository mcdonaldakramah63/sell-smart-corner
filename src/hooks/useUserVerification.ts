
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface UserVerification {
  id: string;
  verification_type: 'phone' | 'email' | 'id_document';
  verification_data?: any;
  status: 'pending' | 'verified' | 'rejected';
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export const useUserVerification = () => {
  const [verifications, setVerifications] = useState<UserVerification[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchVerifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setVerifications(data.map(item => ({
          ...item,
          verification_type: item.verification_type as 'phone' | 'email' | 'id_document',
          status: item.status as 'pending' | 'verified' | 'rejected'
        })));
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitVerification = async (verificationType: 'phone' | 'email' | 'id_document', verificationData?: any) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .insert({
          user_id: user.id,
          verification_type: verificationType,
          verification_data: verificationData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const formattedData = {
          ...data,
          verification_type: data.verification_type as 'phone' | 'email' | 'id_document',
          status: data.status as 'pending' | 'verified' | 'rejected'
        };
        setVerifications(prev => [formattedData, ...prev]);
      }

      toast({
        title: 'Verification submitted',
        description: `Your ${verificationType} verification has been submitted for review.`,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: 'Submission failed',
        description: 'Failed to submit verification.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = (verificationType: 'phone' | 'email' | 'id_document') => {
    return verifications.find(v => v.verification_type === verificationType)?.status || null;
  };

  useEffect(() => {
    fetchVerifications();
  }, [user?.id]);

  return {
    verifications,
    loading,
    submitVerification,
    getVerificationStatus,
    refetch: fetchVerifications
  };
};
