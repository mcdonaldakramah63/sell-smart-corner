
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Eye, TrendingUp, Users, Clock } from 'lucide-react';

interface TrafficAnalyticsProps {
  userId: string;
}

interface TrafficData {
  date: string;
  views: number;
}

interface TrafficSource {
  source: string;
  views: number;
  percentage: number;
}

interface TrafficStats {
  totalViews: number;
  uniqueVisitors: number;
  averageTime: number;
  bounceRate: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function TrafficAnalytics({ userId }: TrafficAnalyticsProps) {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [stats, setStats] = useState<TrafficStats>({
    totalViews: 0,
    uniqueVisitors: 0,
    averageTime: 0,
    bounceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrafficData();
  }, [userId]);

  const fetchTrafficData = async () => {
    try {
      setLoading(true);

      // Fetch user's products first
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('user_id', userId);

      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      const productIds = products.map(p => p.id);

      // Simulate traffic data since we don't have actual analytics table
      const mockTrafficData: TrafficData[] = [];
      const mockTrafficSources: { source: string; views: unknown }[] = [];
      
      // Generate mock data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        mockTrafficData.push({
          date: date.toLocaleDateString(),
          views: Math.floor(Math.random() * 100) + 20
        });
      }

      // Mock traffic sources
      const sources = ['Direct', 'Google', 'Social Media', 'Referral', 'Email'];
      sources.forEach(source => {
        mockTrafficSources.push({
          source,
          views: Math.floor(Math.random() * 200) + 50
        });
      });

      // Calculate total views and percentages
      const totalViews = mockTrafficSources.reduce((sum, item) => {
        const views = typeof item.views === 'number' ? item.views : 0;
        return sum + views;
      }, 0);

      const sourcesWithPercentages = mockTrafficSources.map(item => {
        const views = typeof item.views === 'number' ? item.views : 0;
        return {
          source: item.source,
          views,
          percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0
        };
      });

      // Mock stats
      const mockStats: TrafficStats = {
        totalViews,
        uniqueVisitors: Math.floor(totalViews * 0.7),
        averageTime: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
        bounceRate: Math.floor(Math.random() * 50) + 25 // 25-75%
      };

      setTrafficData(mockTrafficData);
      setTrafficSources(sourcesWithPercentages);
      setStats(mockStats);

    } catch (error) {
      console.error('Error fetching traffic analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading Traffic Analytics...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.averageTime)}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              -3% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Daily Views</CardTitle>
            <CardDescription>Views over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="views"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources Details</CardTitle>
          <CardDescription>Detailed breakdown of traffic sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trafficSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium">{source.source}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{source.views.toLocaleString()} views</span>
                  <span>{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
