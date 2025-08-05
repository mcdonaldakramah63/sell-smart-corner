
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'mobile_money' | 'card' | 'bank';
  provider: string;
  is_active: boolean;
  configuration: any;
}

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment methods',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
    loading,
    refetch: fetchPaymentMethods
  };
};
