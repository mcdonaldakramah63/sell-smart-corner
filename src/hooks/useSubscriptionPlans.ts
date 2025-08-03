
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'suspended';
  starts_at: string;
  expires_at: string;
  auto_renewal: boolean;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      if (data) {
        setPlans(data.map(plan => ({
          ...plan,
          status: plan.status as 'active' | 'cancelled' | 'expired' | 'suspended'
        })));
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setUserSubscription({
          ...data,
          status: data.status as 'active' | 'cancelled' | 'expired' | 'suspended'
        });
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planId: string, paymentReference?: string) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    const plan = plans.find(p => p.id === planId);
    if (!plan) return { success: false, error: 'Plan not found' };

    setLoading(true);
    try {
      const startsAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(startsAt.getDate() + plan.duration_days);

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'active',
          starts_at: startsAt.toISOString(),
          expires_at: expiresAt.toISOString(),
          payment_reference: paymentReference,
          auto_renewal: true
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setUserSubscription({
          ...data,
          status: data.status as 'active' | 'cancelled' | 'expired' | 'suspended'
        });
      }

      toast({
        title: 'Subscription activated',
        description: `You have successfully subscribed to the ${plan.name} plan.`,
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

  useEffect(() => {
    fetchPlans();
    if (user?.id) {
      fetchUserSubscription();
    }
  }, [user?.id]);

  return {
    plans,
    userSubscription,
    loading,
    subscribeToPlan,
    refetchPlans: fetchPlans,
    refetchUserSubscription: fetchUserSubscription
  };
};
