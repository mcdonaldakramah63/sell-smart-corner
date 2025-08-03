
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Star, TrendingUp, ArrowUp } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PremiumAdPrice {
  id: string;
  ad_type: 'featured' | 'vip' | 'spotlight' | 'bump';
  price: number;
  duration_days: number;
  description: string;
  currency: string;
}

interface PremiumAdsManagerProps {
  productId: string;
  currentUserId: string;
}

export function PremiumAdsManager({ productId, currentUserId }: PremiumAdsManagerProps) {
  const [premiumPrices, setPremiumPrices] = useState<PremiumAdPrice[]>([]);
  const [currentAds, setCurrentAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPremiumPrices();
    fetchCurrentAds();
  }, [productId]);

  const fetchPremiumPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_ad_prices')
        .select('*')
        .order('price');

      if (error) throw error;
      setPremiumPrices(data || []);
    } catch (error) {
      console.error('Error fetching premium prices:', error);
    }
  };

  const fetchCurrentAds = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_ads')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      setCurrentAds(data || []);
    } catch (error) {
      console.error('Error fetching current ads:', error);
    }
  };

  const handlePurchasePremiumAd = async (adType: string, price: number, durationDays: number) => {
    setLoading(true);
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      const { data, error } = await supabase
        .from('premium_ads')
        .insert({
          product_id: productId,
          user_id: currentUserId,
          ad_type: adType,
          expires_at: expiresAt.toISOString(),
          amount: price,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Premium ad purchased!",
        description: `Your ${adType} ad is now active for ${durationDays} days.`,
      });

      fetchCurrentAds();
    } catch (error) {
      console.error('Error purchasing premium ad:', error);
      toast({
        title: "Purchase failed",
        description: "Failed to purchase premium ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAdTypeIcon = (type: string) => {
    switch (type) {
      case 'featured': return <Star className="h-4 w-4" />;
      case 'vip': return <Zap className="h-4 w-4" />;
      case 'spotlight': return <TrendingUp className="h-4 w-4" />;
      case 'bump': return <ArrowUp className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getAdTypeColor = (type: string) => {
    switch (type) {
      case 'featured': return 'bg-blue-500';
      case 'vip': return 'bg-purple-500';
      case 'spotlight': return 'bg-yellow-500';
      case 'bump': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const hasActiveAd = (adType: string) => {
    return currentAds.some(ad => ad.ad_type === adType);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Boost Your Listing</h2>
        <p className="text-muted-foreground">
          Get more visibility and sell faster with premium ad features
        </p>
      </div>

      {/* Current Active Ads */}
      {currentAds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Active Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {currentAds.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getAdTypeIcon(ad.ad_type)}
                    <span className="font-medium capitalize">{ad.ad_type}</span>
                    <Badge className={getAdTypeColor(ad.ad_type)}>Active</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expires: {new Date(ad.expires_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Premium Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {premiumPrices.map((price) => {
          const isActive = hasActiveAd(price.ad_type);
          
          return (
            <Card key={price.id} className={isActive ? "border-green-200 bg-green-50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getAdTypeIcon(price.ad_type)}
                  <span className="capitalize">{price.ad_type}</span>
                  {isActive && <Badge variant="secondary">Active</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {price.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {price.currency} {price.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      for {price.duration_days} days
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handlePurchasePremiumAd(price.ad_type, price.price, price.duration_days)}
                    disabled={loading || isActive}
                    className={`${getAdTypeColor(price.ad_type)} hover:opacity-90`}
                  >
                    {isActive ? 'Active' : `Boost for ${price.currency} ${price.price}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {premiumPrices.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No premium options available</h3>
            <p className="text-muted-foreground">
              Premium ad options are currently being set up. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
