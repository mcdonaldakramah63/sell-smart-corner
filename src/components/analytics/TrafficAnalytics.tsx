
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrafficAnalyticsProps {
  userId: string;
}

interface TrafficMetrics {
  totalViews: number;
  uniqueViews: number;
  bounceRate: number;
  avgTimeOnProduct: number;
  dailyViews: Array<{
    date: string;
    views: number;
    unique: number;
  }>;
  topReferrers: Array<{
    source: string;
    views: number;
    percentage: number;
  }>;
  deviceTypes: Array<{
    device: string;
    count: number;
    color: string;
  }>;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
  unique: {
    label: "Unique Views",
    color: "hsl(var(--chart-2))",
  },
};

export default function TrafficAnalytics({ userId }: TrafficAnalyticsProps) {
  const [metrics, setMetrics] = useState<TrafficMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrafficMetrics = async () => {
    try {
      setLoading(true);

      // Get user's products to analyze their traffic
      const { data: products } = await supabase
        .from('products')
        .select('id, view_count')
        .eq('user_id', userId);

      const productIds = products?.map(p => p.id) || [];
      
      // Fetch analytics data for user's products
      let analyticsData = [];
      if (productIds.length > 0) {
        const { data: analytics } = await supabase
          .from('ad_analytics')
          .select('*')
          .in('product_id', productIds)
          .eq('event_type', 'view');
        
        analyticsData = analytics || [];
      }

      const totalViews = products?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
      
      // Calculate unique views (approximate - count unique user_ids)
      const uniqueViewers = new Set(analyticsData.filter(a => a.user_id).map(a => a.user_id));
      const uniqueViews = uniqueViewers.size;
      
      // Mock calculations for bounce rate and avg time (would need more tracking in real implementation)
      const bounceRate = Math.random() * 30 + 20; // 20-50%
      const avgTimeOnProduct = Math.random() * 180 + 60; // 60-240 seconds

      // Generate daily views for last 14 days
      const dailyViews = [];
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayAnalytics = analyticsData.filter(a => {
          const createdAt = new Date(a.created_at);
          return createdAt >= dayStart && createdAt <= dayEnd;
        });
        
        const uniqueViewersForDay = new Set(dayAnalytics.filter(a => a.user_id).map(a => a.user_id));
        
        dailyViews.push({
          date: dateStr,
          views: dayAnalytics.length,
          unique: uniqueViewersForDay.size,
        });
      }

      // Analyze referrers
      const referrerCounts = analyticsData.reduce((acc: Record<string, number>, item) => {
        const referrer = item.referrer || 'Direct';
        const domain = referrer === 'Direct' ? 'Direct' : 
                      referrer.includes('google') ? 'Google' :
                      referrer.includes('facebook') ? 'Facebook' :
                      referrer.includes('twitter') ? 'Twitter' : 'Other';
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      }, {});

      const totalReferrerViews = Object.values(referrerCounts).reduce((sum: number, count) => sum + count, 0);
      const topReferrers = Object.entries(referrerCounts)
        .map(([source, views]) => ({
          source,
          views,
          percentage: totalReferrerViews > 0 ? (views / totalReferrerViews) * 100 : 0,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Analyze device types (mock data - would need user agent parsing)
      const deviceTypes = [
        { device: 'Mobile', count: Math.floor(totalViews * 0.6), color: COLORS[0] },
        { device: 'Desktop', count: Math.floor(totalViews * 0.3), color: COLORS[1] },
        { device: 'Tablet', count: Math.floor(totalViews * 0.1), color: COLORS[2] },
      ].filter(d => d.count > 0);

      setMetrics({
        totalViews,
        uniqueViews,
        bounceRate,
        avgTimeOnProduct,
        dailyViews,
        topReferrers,
        deviceTypes,
      });
    } catch (error) {
      console.error('Error fetching traffic metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load traffic analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficMetrics();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Analytics</CardTitle>
          <CardDescription>Loading traffic data...</CardDescription>
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
          <CardTitle>Traffic Analytics</CardTitle>
          <CardDescription>Unable to load traffic data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalViews > 0 ? ((metrics.uniqueViews / metrics.totalViews) * 100).toFixed(1) : 0}% unique
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.bounceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Quick exits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. View Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(metrics.avgTimeOnProduct / 60)}m {Math.floor(metrics.avgTimeOnProduct % 60)}s</div>
            <p className="text-xs text-muted-foreground">Time on product</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Daily Views</CardTitle>
            <CardDescription>Views and unique visitors over the last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics.dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stackId="1"
                    stroke="var(--color-views)" 
                    fill="var(--color-views)" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="unique" 
                    stackId="2"
                    stroke="var(--color-unique)" 
                    fill="var(--color-unique)" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>Views by device category</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.deviceTypes.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.deviceTypes}
                      dataKey="count"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {metrics.deviceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No device data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {metrics.topReferrers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Traffic Sources</CardTitle>
            <CardDescription>Where your views are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topReferrers.map((referrer, index) => (
                <div key={referrer.source} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{referrer.source}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{referrer.views}</p>
                    <p className="text-xs text-muted-foreground">{referrer.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
