
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RevenueAnalyticsProps {
  userId: string;
}

interface RevenueMetrics {
  totalRevenue: number;
  totalAds: number;
  avgAdValue: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    ads: number;
  }>;
  revenueByAdType: Array<{
    type: string;
    revenue: number;
    count: number;
  }>;
}

const chartConfig = {
  revenue: {
    label: "Revenue (GHS)",
    color: "hsl(var(--chart-1))",
  },
  ads: {
    label: "Ads",
    color: "hsl(var(--chart-2))",
  },
};

export default function RevenueAnalytics({ userId }: RevenueAnalyticsProps) {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRevenueMetrics = async () => {
    try {
      setLoading(true);

      // Fetch premium ads data
      const { data: premiumAds, error } = await supabase
        .from('premium_ads')
        .select('ad_type, amount, created_at, currency')
        .eq('user_id', userId);

      if (error) throw error;

      const totalRevenue = premiumAds?.reduce((sum, ad) => sum + (ad.amount || 0), 0) || 0;
      const totalAds = premiumAds?.length || 0;
      const avgAdValue = totalAds > 0 ? totalRevenue / totalAds : 0;

      // Revenue by ad type
      const revenueByType = (premiumAds || []).reduce((acc: Record<string, { revenue: number; count: number }>, ad) => {
        const type = ad.ad_type || 'unknown';
        if (!acc[type]) {
          acc[type] = { revenue: 0, count: 0 };
        }
        acc[type].revenue += ad.amount || 0;
        acc[type].count += 1;
        return acc;
      }, {});

      const revenueByAdType = Object.entries(revenueByType).map(([type, data]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        revenue: data.revenue,
        count: data.count,
      }));

      // Generate monthly revenue data
      const monthlyRevenue = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthAds = premiumAds?.filter(ad => {
          const createdAt = new Date(ad.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }) || [];

        monthlyRevenue.push({
          month: monthName,
          revenue: monthAds.reduce((sum, ad) => sum + (ad.amount || 0), 0),
          ads: monthAds.length,
        });
      }

      setMetrics({
        totalRevenue,
        totalAds,
        avgAdValue,
        monthlyRevenue,
        revenueByAdType,
      });
    } catch (error) {
      console.error('Error fetching revenue metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load revenue analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueMetrics();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Loading revenue data...</CardDescription>
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
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Unable to load revenue data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {metrics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {metrics.totalAds} premium ads
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalAds}</div>
            <p className="text-xs text-muted-foreground">Premium advertisements</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Ad Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {metrics.avgAdValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per advertisement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue and ad count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-revenue)" 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="ads" 
                    stroke="var(--color-ads)" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Ad Type</CardTitle>
            <CardDescription>Performance of different ad types</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.revenueByAdType.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.revenueByAdType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No premium ads data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {metrics.revenueByAdType.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ad Type Performance</CardTitle>
            <CardDescription>Detailed breakdown by advertisement type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.revenueByAdType.map((adType) => (
                <div key={adType.type} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{adType.type}</p>
                    <p className="text-sm text-muted-foreground">{adType.count} ads</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">GHS {adType.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      GHS {(adType.revenue / adType.count).toFixed(2)} avg
                    </p>
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
