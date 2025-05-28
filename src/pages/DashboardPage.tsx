
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product, Notification } from '@/lib/types';
import { PlusCircle, ShoppingBag, MessageSquare, Bell, Settings } from 'lucide-react';
import DashboardProductCard from '@/components/dashboard/DashboardProductCard';
import NotificationList from '@/components/notifications/NotificationList';

export default function DashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch user's products with category information
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            )
          `)
          .eq('seller_id', user?.id)
          .order('created_at', { ascending: false });
        
        if (productError) throw productError;
        
        // Fetch product images for each product
        const productsWithImages = await Promise.all(
          (productData || []).map(async (product) => {
            const { data: imageData } = await supabase
              .from('product_images')
              .select('image_url')
              .eq('product_id', product.id)
              .eq('is_primary', true)
              .single();
            
            return {
              ...product,
              images: imageData ? [imageData.image_url] : [],
              seller: {
                id: user?.id || '',
                name: user?.name || '',
                avatar: user?.avatar || ''
              },
              createdAt: product.created_at,
              category: product.categories?.name || 'Uncategorized',
              condition: product.condition || 'good'
            };
          })
        );
        
        // Fetch notifications
        const { data: notificationData, error: notificationError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (notificationError) throw notificationError;
        
        setProducts(productsWithImages);
        setNotifications(
          (notificationData || []).map(notif => ({
            id: notif.id,
            userId: notif.user_id,
            type: notif.type,
            content: notif.content,
            createdAt: notif.created_at,
            read: notif.read || false,
            actionUrl: notif.action_url
          }))
        );
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id, user?.name, user?.avatar]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your marketplace activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/create-product" className="flex items-center gap-1">
                <PlusCircle size={18} />
                <span>List Item</span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/profile">
                <Settings size={18} />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <ShoppingBag size={16} />
              <span>My Listings</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <DashboardProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No listings yet</CardTitle>
                  <CardDescription>
                    You haven't listed any items for sale yet.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link to="/create-product">Create your first listing</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  View and respond to messages from buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/messages" className="block w-full">
                  <Button variant="outline" className="w-full">
                    Go to Messages
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <NotificationList notifications={notifications} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
