
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  duration_days: number;
  features: any;
  max_ads?: number;
  max_images_per_ad?: number;
  priority_support: boolean;
  featured_ads_included: number;
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'suspended';
  starts_at: string;
  expires_at: string;
  auto_renewal: boolean;
  payment_reference?: string;
  plan?: SubscriptionPlan;
}

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserSubscription(data);
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    }
  };

  const subscribe = async (planId: string, paymentReference?: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + plan.duration_days);

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          starts_at: startDate.toISOString(),
          expires_at: endDate.toISOString(),
          payment_reference: paymentReference,
          status: 'active'
        })
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .single();

      if (error) throw error;

      setUserSubscription(data);
      toast({
        title: 'Subscription activated',
        description: `You have successfully subscribed to ${plan.name}.`,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      toast({
        title: 'Subscription failed',
        description: 'Failed to activate subscription.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!userSubscription) return { success: false, error: 'No active subscription' };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          auto_renewal: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userSubscription.id)
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .single();

      if (error) throw error;

      setUserSubscription(data);
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription has been cancelled.',
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Cancellation failed',
        description: 'Failed to cancel subscription.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchUserSubscription();
  }, []);

  return {
    plans,
    userSubscription,
    loading,
    subscribe,
    cancelSubscription,
    refetch: () => {
      fetchPlans();
      fetchUserSubscription();
    }
  };
};
