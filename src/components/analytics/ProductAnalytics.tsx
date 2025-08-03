
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductAnalyticsProps {
  userId: string;
  detailed?: boolean;
}

interface ProductMetrics {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalContacts: number;
  avgViewsPerProduct: number;
  topPerformingProducts: Array<{
    id: string;
    title: string;
    views: number;
    contacts: number;
  }>;
  monthlyData: Array<{
    month: string;
    products: number;
    views: number;
  }>;
}

const chartConfig = {
  products: {
    label: "Products",
    color: "hsl(var(--chart-1))",
  },
  views: {
    label: "Views",
    color: "hsl(var(--chart-2))",
  },
};

export default function ProductAnalytics({ userId, detailed = false }: ProductAnalyticsProps) {
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProductMetrics = async () => {
    try {
      setLoading(true);

      // Fetch user's products with view counts
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, title, view_count, contact_count, created_at, status')
        .eq('user_id', userId);

      if (productsError) throw productsError;

      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.status === 'approved').length || 0;
      const totalViews = products?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
      const totalContacts = products?.reduce((sum, p) => sum + (p.contact_count || 0), 0) || 0;
      const avgViewsPerProduct = totalProducts > 0 ? Math.round(totalViews / totalProducts) : 0;

      // Get top performing products
      const topPerformingProducts = products
        ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          title: p.title,
          views: p.view_count || 0,
          contacts: p.contact_count || 0,
        })) || [];

      // Generate monthly data (last 6 months)
      const monthlyData = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthProducts = products?.filter(p => {
          const createdAt = new Date(p.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }) || [];

        monthlyData.push({
          month: monthName,
          products: monthProducts.length,
          views: monthProducts.reduce((sum, p) => sum + (p.view_count || 0), 0),
        });
      }

      setMetrics({
        totalProducts,
        activeProducts,
        totalViews,
        totalContacts,
        avgViewsPerProduct,
        topPerformingProducts,
        monthlyData,
      });
    } catch (error) {
      console.error('Error fetching product metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load product analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductMetrics();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Analytics</CardTitle>
          <CardDescription>Loading product performance data...</CardDescription>
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
          <CardTitle>Product Analytics</CardTitle>
          <CardDescription>Unable to load analytics data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {detailed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeProducts} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.avgViewsPerProduct} avg per product
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalViews > 0 ? ((metrics.totalContacts / metrics.totalViews) * 100).toFixed(1) : 0}% conversion
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalProducts > 0 ? ((metrics.activeProducts / metrics.totalProducts) * 100).toFixed(0) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Products approved</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Products created and views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="products" fill="var(--color-products)" />
                  <Line yAxisId="right" type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Products with the most views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topPerformingProducts.length > 0 ? (
                metrics.topPerformingProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">{product.title}</p>
                        <p className="text-xs text-muted-foreground">{product.contacts} contacts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.views}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No products found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
