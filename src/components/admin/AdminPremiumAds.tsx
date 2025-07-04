import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PremiumAdBadge } from '@/components/products/PremiumAdBadge';
import { Edit, Trash2, DollarSign, Settings } from 'lucide-react';

interface PremiumAd {
  id: string;
  product_id: string;
  user_id: string;
  ad_type: 'featured' | 'bump' | 'vip' | 'spotlight';
  expires_at: string;
  payment_reference: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  products: {
    title: string;
  };
  profiles: {
    full_name: string | null;
    username: string | null;
  } | null;
}

interface PremiumAdPrice {
  id: string;
  ad_type: 'featured' | 'bump' | 'vip' | 'spotlight';
  price: number;
  duration_days: number;
  currency: string;
  description: string;
}

export const AdminPremiumAds = () => {
  const [premiumAds, setPremiumAds] = useState<PremiumAd[]>([]);
  const [prices, setPrices] = useState<PremiumAdPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState<PremiumAdPrice | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPremiumAds();
    fetchPrices();
  }, []);

  const fetchPremiumAds = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_ads')
        .select(`
          *,
          products(title),
          profiles(full_name, username)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPremiumAds((data as any) || []);
    } catch (error) {
      console.error('Error fetching premium ads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load premium ads',
        variant: 'destructive'
      });
    }
  };

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_ad_prices')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      setPrices(data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pricing',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    try {
      const { error } = await supabase
        .from('premium_ads')
        .delete()
        .eq('id', adId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Premium ad deleted successfully'
      });
      
      fetchPremiumAds();
    } catch (error) {
      console.error('Error deleting premium ad:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete premium ad',
        variant: 'destructive'
      });
    }
  };

  const handleUpdatePrice = async (priceData: PremiumAdPrice) => {
    try {
      const { error } = await supabase
        .from('premium_ad_prices')
        .update({
          price: priceData.price,
          duration_days: priceData.duration_days,
          description: priceData.description
        })
        .eq('id', priceData.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Pricing updated successfully'
      });
      
      setIsEditDialogOpen(false);
      setEditingPrice(null);
      fetchPrices();
    } catch (error) {
      console.error('Error updating price:', error);
      toast({
        title: 'Error',
        description: 'Failed to update pricing',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Ad Pricing Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Premium Ad Pricing
          </CardTitle>
          <CardDescription>
            Manage pricing for different premium ad types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {prices.map((price) => (
              <Card key={price.id} className="border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <PremiumAdBadge adType={price.ad_type} />
                    <Dialog open={isEditDialogOpen && editingPrice?.id === price.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setEditingPrice(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => setEditingPrice(price)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit {price.ad_type} Pricing</DialogTitle>
                        </DialogHeader>
                        {editingPrice && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="price">Price (₦)</Label>
                              <Input
                                id="price"
                                type="number"
                                value={editingPrice.price}
                                onChange={(e) => setEditingPrice({
                                  ...editingPrice,
                                  price: parseFloat(e.target.value)
                                })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="duration">Duration (days)</Label>
                              <Input
                                id="duration"
                                type="number"
                                value={editingPrice.duration_days}
                                onChange={(e) => setEditingPrice({
                                  ...editingPrice,
                                  duration_days: parseInt(e.target.value)
                                })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={editingPrice.description || ''}
                                onChange={(e) => setEditingPrice({
                                  ...editingPrice,
                                  description: e.target.value
                                })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleUpdatePrice(editingPrice)}>
                                Save Changes
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setIsEditDialogOpen(false);
                                  setEditingPrice(null);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">₦{price.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {price.duration_days} day{price.duration_days > 1 ? 's' : ''}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {price.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Premium Ads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Active Premium Ads
          </CardTitle>
          <CardDescription>
            Manage all premium ad purchases and activations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {premiumAds.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">
                    {ad.products?.title || 'Unknown Product'}
                  </TableCell>
                  <TableCell>
                    {ad.profiles?.full_name || ad.profiles?.username || 'Unknown User'}
                  </TableCell>
                  <TableCell>
                    <PremiumAdBadge adType={ad.ad_type} />
                  </TableCell>
                  <TableCell>₦{ad.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {getStatusBadge(ad.status)}
                  </TableCell>
                  <TableCell>
                    {new Date(ad.expires_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteAd(ad.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {premiumAds.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No premium ads found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};