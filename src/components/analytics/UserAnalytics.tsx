
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserAnalyticsProps {
  userId: string;
}

interface UserMetrics {
  profileViews: number;
  messagesSent: number;
  messagesReceived: number;
  responseRate: number;
  avgResponseTime: number;
  productsByCategory: Array<{
    category: string;
    count: number;
    color: string;
  }>;
  monthlyActivity: Array<{
    month: string;
    messages: number;
    products: number;
  }>;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const chartConfig = {
  messages: {
    label: "Messages",
    color: "hsl(var(--chart-1))",
  },
  products: {
    label: "Products",
    color: "hsl(var(--chart-2))",
  },
};

export default function UserAnalytics({ userId }: UserAnalyticsProps) {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserMetrics = async () => {
    try {
      setLoading(true);

      // Fetch user profile for response rate and time
      const { data: profile } = await supabase
        .from('profiles')
        .select('response_rate, response_time_hours')
        .eq('id', userId)
        .single();

      // Fetch messages sent by user
      const { data: sentMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('sender_id', userId);

      // Fetch conversations where user is a participant to count received messages
      const { data: conversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);

      const conversationIds = conversations?.map(c => c.conversation_id) || [];
      
      let receivedMessagesCount = 0;
      if (conversationIds.length > 0) {
        const { data: receivedMessages } = await supabase
          .from('messages')
          .select('id')
          .in('conversation_id', conversationIds)
          .neq('sender_id', userId);
        
        receivedMessagesCount = receivedMessages?.length || 0;
      }

      // Fetch products by category
      const { data: products } = await supabase
        .from('products')
        .select(`
          id,
          created_at,
          categories (
            name
          )
        `)
        .eq('user_id', userId);

      const productsByCategory = (products || []).reduce((acc: Record<string, number>, product: any) => {
        const category = product.categories?.name || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const categoryData = Object.entries(productsByCategory)
        .map(([category, count], index) => ({
          category,
          count,
          color: COLORS[index % COLORS.length],
        }))
        .sort((a, b) => b.count - a.count);

      // Generate monthly activity data
      const monthlyActivity = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // Count messages sent in this month
        const { data: monthMessages } = await supabase
          .from('messages')
          .select('id')
          .eq('sender_id', userId)
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        // Count products created in this month
        const monthProducts = products?.filter(p => {
          const createdAt = new Date(p.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }) || [];

        monthlyActivity.push({
          month: monthName,
          messages: monthMessages?.length || 0,
          products: monthProducts.length,
        });
      }

      setMetrics({
        profileViews: 0, // This would require additional tracking
        messagesSent: sentMessages?.length || 0,
        messagesReceived: receivedMessagesCount,
        responseRate: profile?.response_rate || 0,
        avgResponseTime: profile?.response_time_hours || 24,
        productsByCategory: categoryData,
        monthlyActivity,
      });
    } catch (error) {
      console.error('Error fetching user metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load user analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMetrics();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Analytics</CardTitle>
          <CardDescription>Loading user activity data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Analytics</CardTitle>
          <CardDescription>Unable to load analytics data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Communication Stats</CardTitle>
            <CardDescription>Your messaging activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Messages Sent</span>
              <span className="font-medium">{metrics.messagesSent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Messages Received</span>
              <span className="font-medium">{metrics.messagesReceived}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Response Rate</span>
              <span className="font-medium">{metrics.responseRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Response Time</span>
              <span className="font-medium">{metrics.avgResponseTime.toFixed(1)}h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <CardDescription>Distribution of your listings</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.productsByCategory.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={metrics.productsByCategory}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {metrics.productsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No products found
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
          <CardDescription>Your activity over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="messages" fill="var(--color-messages)" />
                <Bar dataKey="products" fill="var(--color-products)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
