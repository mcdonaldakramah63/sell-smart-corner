
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useBusinessAccount } from '@/hooks/useBusinessAccount';
import { useAutoRenewal } from '@/hooks/useAutoRenewal';
import { TrendingUp, Package, Users, DollarSign, Settings, Zap } from 'lucide-react';

const BusinessDashboardPage = () => {
  const { plans, userSubscription, loading: plansLoading } = useSubscriptionPlans();
  const { businessAccount, loading: businessLoading } = useBusinessAccount();
  const { settings: renewalSettings, toggleRenewal, loading: renewalLoading } = useAutoRenewal();

  if (plansLoading || businessLoading || renewalLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          {businessAccount && (
            <Badge variant={businessAccount.verification_status === 'verified' ? 'default' : 'secondary'}>
              {businessAccount.verification_status === 'verified' ? 'Verified Business' : 'Unverified'}
            </Badge>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,840</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHS 1,240</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">+0.4% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="auto-renewal">Auto Renewal</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest business activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">New message received</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Product viewed 15 times</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Premium ad expired</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common business tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Add New Product
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Promote Product
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Business Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Manage your business subscription</CardDescription>
              </CardHeader>
              <CardContent>
                {userSubscription ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Active Subscription</h3>
                        <p className="text-sm text-muted-foreground">
                          Expires: {new Date(userSubscription.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="font-semibold mb-2">No Active Subscription</h3>
                    <p className="text-muted-foreground mb-4">Upgrade to access business features</p>
                    <Button>View Plans</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-4">
                      {plan.currency} {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{plan.duration_days} days
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• Max {plan.max_ads || 'Unlimited'} ads</li>
                      <li>• {plan.max_images_per_ad || 'Unlimited'} images per ad</li>
                      <li>• {plan.featured_ads_included} featured ads</li>
                      {plan.priority_support && <li>• Priority support</li>}
                    </ul>
                    <Button className="w-full mt-4">
                      {userSubscription ? 'Switch Plan' : 'Subscribe'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Track your product inventory and stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Inventory management interface coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="auto-renewal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Renewal Settings</CardTitle>
                <CardDescription>Automatically renew your premium ads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {renewalSettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Product #{setting.product_id.slice(0, 8)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {setting.ad_type} ad • Every {setting.renewal_frequency} days
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Renewed {setting.current_renewals} times
                          {setting.max_renewals && ` (max: ${setting.max_renewals})`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={setting.is_enabled}
                          onCheckedChange={(checked) => toggleRenewal(setting.id, checked)}
                        />
                        <Zap className={`w-4 h-4 ${setting.is_enabled ? 'text-green-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  ))}
                  
                  {renewalSettings.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No auto-renewal settings configured
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>Track your performance and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Detailed analytics coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BusinessDashboardPage;
