import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Package, MessageSquare, Calendar } from 'lucide-react';

interface AnalyticsData {
  userGrowth: {
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  productStats: {
    totalProducts: number;
    pendingProducts: number;
    approvedProducts: number;
    rejectedProducts: number;
  };
  activityStats: {
    totalConversations: number;
    totalMessages: number;
    activeUsersToday: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: { thisMonth: 0, lastMonth: 0, change: 0 },
    productStats: {
      totalProducts: 0,
      pendingProducts: 0,
      approvedProducts: 0,
      rejectedProducts: 0
    },
    activityStats: {
      totalConversations: 0,
      totalMessages: 0,
      activeUsersToday: 0
    },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Calculate user growth
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const { count: thisMonthUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart.toISOString());

      const { count: lastMonthUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString());

      // Product statistics
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const { count: pendingProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: approvedProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: rejectedProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      // Activity statistics
      const { count: totalConversations } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true });

      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Recent activity (simplified)
      const { data: recentProducts } = await supabase
        .from('products')
        .select('id, title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      const recentActivity = (recentProducts || []).map(product => ({
        id: product.id,
        type: 'product',
        description: `New product: ${product.title}`,
        timestamp: product.created_at
      }));

      const userGrowthChange = lastMonthUsers ? 
        ((thisMonthUsers || 0) - lastMonthUsers) / lastMonthUsers * 100 : 0;

      setAnalytics({
        userGrowth: {
          thisMonth: thisMonthUsers || 0,
          lastMonth: lastMonthUsers || 0,
          change: userGrowthChange
        },
        productStats: {
          totalProducts: totalProducts || 0,
          pendingProducts: pendingProducts || 0,
          approvedProducts: approvedProducts || 0,
          rejectedProducts: rejectedProducts || 0
        },
        activityStats: {
          totalConversations: totalConversations || 0,
          totalMessages: totalMessages || 0,
          activeUsersToday: 0 // This would require more complex tracking
        },
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.userGrowth.thisMonth}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {analytics.userGrowth.change > 0 ? '+' : ''}
              {analytics.userGrowth.change.toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activityStats.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activityStats.totalMessages} total messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Approval Rate</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.productStats.totalProducts > 0 
                ? Math.round((analytics.productStats.approvedProducts / analytics.productStats.totalProducts) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.productStats.approvedProducts} approved of {analytics.productStats.totalProducts}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Product Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analytics.productStats.approvedProducts}
              </div>
              <Badge variant="default" className="mt-1">Approved</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {analytics.productStats.pendingProducts}
              </div>
              <Badge variant="secondary" className="mt-1">Pending</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {analytics.productStats.rejectedProducts}
              </div>
              <Badge variant="destructive" className="mt-1">Rejected</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {analytics.productStats.totalProducts}
              </div>
              <Badge variant="outline" className="mt-1">Total</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant="outline">{activity.type}</Badge>
              </div>
            ))}
            {analytics.recentActivity.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};