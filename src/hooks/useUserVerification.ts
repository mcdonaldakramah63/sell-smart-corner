
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserVerification = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitPhoneVerification = async (phoneNumber: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          verification_type: 'phone',
          verification_data: { phone_number: phoneNumber },
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Phone verification submitted',
        description: 'Your phone verification request has been submitted for review.',
      });

      return { success: true };
    } catch (error) {
      console.error('Phone verification error:', error);
      toast({
        title: 'Verification failed',
        description: 'Failed to submit phone verification request.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const submitIDVerification = async (documentType: string, documentNumber: string, documentImages: string[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          verification_type: 'id_document',
          verification_data: { 
            document_type: documentType,
            document_number: documentNumber,
            document_images: documentImages
          },
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'ID verification submitted',
        description: 'Your ID verification has been submitted for review.',
      });

      return { success: true };
    } catch (error) {
      console.error('ID verification error:', error);
      toast({
        title: 'Verification failed',
        description: 'Failed to submit ID verification request.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching verification status:', error);
      return [];
    }
  };

  return {
    loading,
    submitPhoneVerification,
    submitIDVerification,
    getVerificationStatus
  };
};
