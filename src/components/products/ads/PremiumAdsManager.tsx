
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Star, TrendingUp, ArrowUp, Crown, Search, Package } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePromotionTiers } from '@/hooks/usePromotionTiers';
import { useBulkPromotionPackages } from '@/hooks/useBulkPromotionPackages';
import { usePaymentProcessing } from '@/hooks/usePaymentProcessing';
import { PaymentMethodSelector } from '@/components/payments/PaymentMethodSelector';
import type { PaymentMethod } from '@/hooks/usePaymentMethods';
import type { PromotionTier } from '@/hooks/usePromotionTiers';

type PremiumAdType = 'featured' | 'vip' | 'spotlight' | 'bump' | 'top' | 'urgent';

interface PremiumAdsManagerProps {
  productId: string;
  currentUserId: string;
}

export function PremiumAdsManager({ productId, currentUserId }: PremiumAdsManagerProps) {
  const [currentAds, setCurrentAds] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedTier, setSelectedTier] = useState<PromotionTier | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const { promotionTiers } = usePromotionTiers();
  const { userPackages } = useBulkPromotionPackages();
  const { processing, initializePayment } = usePaymentProcessing();

  useEffect(() => {
    fetchCurrentAds();
  }, [productId]);

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

  const handleDirectPurchase = async (tier: PromotionTier) => {
    if (!selectedPaymentMethod) {
      setSelectedTier(tier);
      toast({
        title: 'Select payment method',
        description: 'Please choose a payment method to continue',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await initializePayment(
        tier.price,
        selectedPaymentMethod.id,
        'premium_ad',
        productId
      );

      if (result.success) {
        // Create the premium ad record
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + tier.duration_hours);

        await supabase
          .from('premium_ads')
          .insert({
            product_id: productId,
            user_id: currentUserId,
            ad_type: tier.type,
            expires_at: expiresAt.toISOString(),
            amount: tier.price,
            status: 'active'
          });

        toast({
          title: "Premium ad activated!",
          description: `Your ${tier.name} is now active for ${tier.duration_hours} hours.`,
        });

        fetchCurrentAds();
        setSelectedTier(null);
      }
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

  const handlePackageCredit = async (tier: PromotionTier) => {
    // Use credits from user's package
    const availablePackage = userPackages.find(p => p.ads_remaining > 0);
    if (!availablePackage) {
      toast({
        title: "No credits available",
        description: "Purchase a bulk package to use promotion credits",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create the premium ad
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + tier.duration_hours);

      await supabase
        .from('premium_ads')
        .insert({
          product_id: productId,
          user_id: currentUserId,
          ad_type: tier.type,
          expires_at: expiresAt.toISOString(),
          amount: 0, // Using package credit
          status: 'active'
        });

      // Deduct one credit from the package
      await supabase
        .from('user_package_purchases')
        .update({ ads_remaining: availablePackage.ads_remaining - 1 })
        .eq('id', availablePackage.id);

      toast({
        title: "Premium ad activated!",
        description: `Used 1 package credit. ${availablePackage.ads_remaining - 1} credits remaining.`,
      });

      fetchCurrentAds();
    } catch (error) {
      console.error('Error using package credit:', error);
      toast({
        title: "Activation failed",
        description: "Failed to activate premium ad with package credit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAdTypeIcon = (type: string) => {
    switch (type) {
      case 'featured': return <Star className="h-4 w-4" />;
      case 'vip': return <Crown className="h-4 w-4" />;
      case 'spotlight': return <Search className="h-4 w-4" />;
      case 'top': return <TrendingUp className="h-4 w-4" />;
      case 'urgent': return <ArrowUp className="h-4 w-4" />;
      case 'bump': return <Zap className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getAdTypeColor = (type: string) => {
    switch (type) {
      case 'featured': return 'bg-blue-500';
      case 'vip': return 'bg-purple-500';
      case 'spotlight': return 'bg-yellow-500';
      case 'top': return 'bg-orange-500';
      case 'urgent': return 'bg-red-500';
      case 'bump': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const hasActiveAd = (adType: string) => {
    return currentAds.some(ad => ad.ad_type === adType);
  };

  const availableCredits = userPackages.reduce((sum, pkg) => sum + pkg.ads_remaining, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Boost Your Listing</h2>
        <p className="text-muted-foreground">
          Get more visibility and sell faster with premium ad features
        </p>
        {availableCredits > 0 && (
          <Badge variant="secondary" className="mt-2">
            {availableCredits} promotion credits available
          </Badge>
        )}
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
        {promotionTiers.map((tier) => {
          const isActive = hasActiveAd(tier.type);
          
          return (
            <Card key={tier.id} className={isActive ? "border-green-200 bg-green-50/50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getAdTypeIcon(tier.type)}
                  <span className="capitalize">{tier.name}</span>
                  {isActive && <Badge variant="secondary">Active</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Features:</h4>
                  <ul className="text-sm space-y-1">
                    {tier.features.badge && <li>✓ {tier.features.badge} badge</li>}
                    {tier.features.highlight && <li>✓ Highlighted listing</li>}
                    {tier.features.top_search && <li>✓ Top of search results</li>}
                    {tier.features.priority_support && <li>✓ Priority support</li>}
                    {tier.features.homepage_banner && <li>✓ Homepage banner</li>}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      GHS {tier.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      for {Math.floor(tier.duration_hours / 24)} days
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => handleDirectPurchase(tier)}
                    disabled={loading || isActive}
                    className={`w-full ${getAdTypeColor(tier.type)} hover:opacity-90`}
                  >
                    {isActive ? 'Active' : `Buy for GHS ${tier.price}`}
                  </Button>
                  
                  {availableCredits > 0 && !isActive && (
                    <Button 
                      onClick={() => handlePackageCredit(tier)}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Use Package Credit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Method Selection */}
      {selectedTier && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Selected:</h4>
              <p className="text-lg font-semibold">
                {selectedTier.name} - GHS {selectedTier.price.toFixed(2)}
              </p>
            </div>

            <PaymentMethodSelector
              onSelect={setSelectedPaymentMethod}
              selectedMethodId={selectedPaymentMethod?.id}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedTier(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedTier && handleDirectPurchase(selectedTier)}
                disabled={!selectedPaymentMethod || processing}
              >
                {processing ? 'Processing...' : 'Complete Purchase'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {promotionTiers.length === 0 && (
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
