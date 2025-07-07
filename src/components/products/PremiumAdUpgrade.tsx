import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, TrendingUp, Zap, Crown } from 'lucide-react';

interface PremiumAdUpgradeProps {
  productId: string;
  currentAdType?: string;
}

interface PremiumAdPrice {
  id: string;
  ad_type: 'featured' | 'bump' | 'vip' | 'spotlight';
  price: number;
  duration_days: number;
  currency: string;
  description: string;
}

export const PremiumAdUpgrade = ({ productId, currentAdType }: PremiumAdUpgradeProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<PremiumAdPrice[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchPrices = async () => {
    const { data, error } = await supabase
      .from('premium_ad_prices')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load pricing information',
        variant: 'destructive'
      });
    } else {
      setPrices(data || []);
    }
  };

  const handleUpgrade = async (adType: string, price: number) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to upgrade your ad',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // For now, we'll create a payment initiation function
      // This will be replaced with actual payment gateway integration
      const { data, error } = await supabase.functions.invoke('initiate-premium-payment', {
        body: {
          productId,
          adType,
          amount: price
        }
      });

      if (error) throw error;

      if (data.paymentUrl) {
        // Redirect to payment gateway
        window.open(data.paymentUrl, '_blank');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getAdTypeIcon = (adType: string) => {
    switch (adType) {
      case 'featured': return <Star className="h-5 w-5" />;
      case 'bump': return <TrendingUp className="h-5 w-5" />;
      case 'vip': return <Crown className="h-5 w-5" />;
      case 'spotlight': return <Zap className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getAdTypeColor = (adType: string) => {
    switch (adType) {
      case 'featured': return 'bg-blue-500';
      case 'bump': return 'bg-green-500';
      case 'vip': return 'bg-purple-500';
      case 'spotlight': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) fetchPrices();
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Premium Ad Features
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {prices.map((price) => (
            <Card 
              key={price.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                currentAdType === price.ad_type ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getAdTypeColor(price.ad_type)} text-white`}>
                      {getAdTypeIcon(price.ad_type)}
                    </div>
                    <CardTitle className="capitalize">{price.ad_type}</CardTitle>
                  </div>
                  {currentAdType === price.ad_type && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Current
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm">
                  {price.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-marketplace-primary">
                      ₵{price.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      for {price.duration_days} day{price.duration_days > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleUpgrade(price.ad_type, price.price)}
                    disabled={loading || currentAdType === price.ad_type}
                    className={`w-full ${getAdTypeColor(price.ad_type)} hover:opacity-90 text-white`}
                  >
                    {loading ? 'Processing...' : currentAdType === price.ad_type ? 'Active' : 'Upgrade Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Premium Benefits:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Featured: Top placement in search results</li>
            <li>• Bump: Quick 24-hour visibility boost</li>
            <li>• VIP: Special highlighting and priority</li>
            <li>• Spotlight: Premium section placement</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};