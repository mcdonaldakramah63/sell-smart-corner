
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  pendingReports: number;
  activeSubscriptions: number;
  monthlyRevenue: Array<{ month: string; amount: number }>;
  topCategories: Array<{ name: string; count: number }>;
  userGrowth: Array<{ date: string; users: number }>;
}

export const useAdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch total revenue
      const { data: revenueData } = await supabase
        .from('revenue_tracking')
        .select('amount');
      
      const totalRevenue = revenueData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

      // Fetch pending reports
      const { count: pendingReports } = await supabase
        .from('moderation_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch active subscriptions
      const { count: activeSubscriptions } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // For demo purposes, create mock monthly revenue data
      const monthlyRevenue = [
        { month: 'Jan', amount: 1200 },
        { month: 'Feb', amount: 1800 },
        { month: 'Mar', amount: 2400 },
        { month: 'Apr', amount: 2100 },
        { month: 'May', amount: 2800 },
        { month: 'Jun', amount: 3200 },
      ];

      const topCategories = [
        { name: 'Electronics', count: 45 },
        { name: 'Fashion', count: 38 },
        { name: 'Home & Garden', count: 32 },
        { name: 'Vehicles', count: 28 },
      ];

      const userGrowth = [
        { date: '2024-01', users: 100 },
        { date: '2024-02', users: 150 },
        { date: '2024-03', users: 200 },
        { date: '2024-04', users: 280 },
        { date: '2024-05', users: 350 },
        { date: '2024-06', users: 420 },
      ];

      setData({
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        totalRevenue,
        pendingReports: pendingReports || 0,
        activeSubscriptions: activeSubscriptions || 0,
        monthlyRevenue,
        topCategories,
        userGrowth,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { data, loading, refetch: fetchAnalytics };
};
