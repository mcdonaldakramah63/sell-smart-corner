
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Zap, Package, TrendingUp, MapPin } from "lucide-react";
import { usePromotionTiers } from '@/hooks/usePromotionTiers';
import { useBulkPromotionPackages } from '@/hooks/useBulkPromotionPackages';
import { usePaymentProcessing } from '@/hooks/usePaymentProcessing';
import { PaymentMethodSelector } from '@/components/payments/PaymentMethodSelector';
import { PromotionTierCard } from './PromotionTierCard';
import { BulkPackageCard } from './BulkPackageCard';
import { useToast } from '@/hooks/use-toast';
import type { PaymentMethod } from '@/hooks/usePaymentMethods';
import type { PromotionTier } from '@/hooks/usePromotionTiers';
import type { BulkPromotionPackage } from '@/hooks/useBulkPromotionPackages';

interface AdvancedPromotionManagerProps {
  productId?: string;
}

export function AdvancedPromotionManager({ productId }: AdvancedPromotionManagerProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionTier | BulkPromotionPackage | null>(null);
  const [promotionType, setPromotionType] = useState<'individual' | 'bulk'>('individual');

  const { promotionTiers, loading: tiersLoading } = usePromotionTiers();
  const { packages, userPackages, loading: packagesLoading } = useBulkPromotionPackages();
  const { processing, initializePayment } = usePaymentProcessing();
  const { toast } = useToast();

  const handlePromotionPurchase = async (item: PromotionTier | BulkPromotionPackage) => {
    if (!selectedPaymentMethod) {
      setSelectedPromotion(item);
      toast({
        title: 'Select payment method',
        description: 'Please choose a payment method to continue',
      });
      return;
    }

    const transactionType = 'premium_ad' as const;
    const amount = 'total_price' in item ? item.total_price : item.price;

    const result = await initializePayment(
      amount,
      selectedPaymentMethod.id,
      transactionType,
      productId
    );

    if (result.success) {
      toast({
        title: 'Payment initiated',
        description: 'Your promotion will be activated once payment is confirmed',
      });
      setSelectedPromotion(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advanced Promotions</h2>
        <p className="text-muted-foreground">
          Boost your listings with powerful promotion tools and packages
        </p>
      </div>

      {/* User's Active Packages */}
      {userPackages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Your Active Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userPackages.map((userPackage) => (
                <div key={userPackage.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">Active</Badge>
                    <span className="text-sm text-muted-foreground">
                      Expires: {new Date(userPackage.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-lg font-semibold">
                    {userPackage.ads_remaining} credits remaining
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={promotionType} onValueChange={(value) => setPromotionType(value as 'individual' | 'bulk')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Promotions</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose Promotion Level</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {promotionTiers.map((tier) => (
                <PromotionTierCard
                  key={tier.id}
                  tier={tier}
                  onPurchase={handlePromotionPurchase}
                  loading={processing}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Bulk Promotion Packages</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <BulkPackageCard
                  key={pkg.id}
                  package={pkg}
                  onPurchase={handlePromotionPurchase}
                  loading={processing}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Method Selection */}
      {selectedPromotion && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Selected:</h4>
              <p className="text-lg font-semibold">
                {'total_price' in selectedPromotion 
                  ? selectedPromotion.name 
                  : selectedPromotion.name
                } - GHS {
                  'total_price' in selectedPromotion 
                    ? selectedPromotion.total_price.toFixed(2)
                    : selectedPromotion.price.toFixed(2)
                }
              </p>
            </div>

            <PaymentMethodSelector
              onSelect={setSelectedPaymentMethod}
              selectedMethodId={selectedPaymentMethod?.id}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedPromotion(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedPromotion && handlePromotionPurchase(selectedPromotion)}
                disabled={!selectedPaymentMethod || processing}
              >
                {processing ? 'Processing...' : 'Complete Purchase'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
