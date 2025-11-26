
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

      // Fetch total revenue from payment transactions
      const { data: revenueData } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'completed');
      
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

      // Fetch real monthly revenue data (last 6 months)
      const { data: monthlyRevenueData } = await supabase
        .from('payment_transactions')
        .select('amount, created_at')
        .eq('status', 'completed')
        .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString());

      const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthName = date.toLocaleString('default', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const amount = monthlyRevenueData
          ?.filter(item => {
            const itemDate = new Date(item.created_at);
            return itemDate >= monthStart && itemDate <= monthEnd;
          })
          .reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        
        return { month: monthName, amount };
      });

      // Fetch real top categories
      const { data: categoryData } = await supabase
        .from('products')
        .select('category_id, categories(name)')
        .eq('status', 'approved');

      const categoryCounts = categoryData?.reduce((acc: any, item) => {
        const categoryName = (item.categories as any)?.name || 'Uncategorized';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {});

      const topCategories = Object.entries(categoryCounts || {})
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Fetch real user growth data (last 6 months)
      const { data: userGrowthData } = await supabase
        .from('profiles')
        .select('created_at');

      const userGrowth = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthStr = date.toISOString().slice(0, 7);
        
        const users = userGrowthData?.filter(item => 
          item.created_at.startsWith(monthStr)
        ).length || 0;
        
        return { date: monthStr, users };
      });

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
