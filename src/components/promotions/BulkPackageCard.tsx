
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Star, TrendingUp, Crown } from "lucide-react";
import type { BulkPromotionPackage } from '@/hooks/useBulkPromotionPackages';

interface BulkPackageCardProps {
  package: BulkPromotionPackage;
  onPurchase: (pkg: BulkPromotionPackage) => void;
  loading?: boolean;
}

export function BulkPackageCard({ package: pkg, onPurchase, loading }: BulkPackageCardProps) {
  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'featured': return <Star className="h-6 w-6" />;
      case 'mixed': return <TrendingUp className="h-6 w-6" />;
      case 'premium': return <Crown className="h-6 w-6" />;
      default: return <Package className="h-6 w-6" />;
    }
  };

  const getPackageColor = (type: string) => {
    switch (type) {
      case 'featured': return 'bg-blue-500';
      case 'mixed': return 'bg-orange-500';
      case 'premium': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const originalPrice = pkg.total_price / (1 - pkg.discount_percentage / 100);
  const savings = originalPrice - pkg.total_price;

  return (
    <Card className="relative h-full">
      {pkg.discount_percentage > 0 && (
        <Badge 
          className="absolute top-4 right-4 bg-red-500 text-white"
        >
          {pkg.discount_percentage}% OFF
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-3 rounded-lg text-white ${getPackageColor(pkg.package_type)}`}>
            {getPackageIcon(pkg.package_type)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{pkg.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {pkg.package_type} package
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="space-y-1">
            <div className="text-3xl font-bold">
              GHS {pkg.total_price.toFixed(2)}
            </div>
            {pkg.discount_percentage > 0 && (
              <>
                <div className="text-lg text-muted-foreground line-through">
                  GHS {originalPrice.toFixed(2)}
                </div>
                <div className="text-green-600 font-medium">
                  Save GHS {savings.toFixed(2)}
                </div>
              </>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Valid for {pkg.duration_days} days
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {pkg.ad_count} Ads
            </div>
            <div className="text-sm text-muted-foreground">
              Promotion credits included
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Package includes:</h4>
            <ul className="text-sm space-y-1">
              {pkg.features.featured && (
                <li>✓ {pkg.features.featured} Featured ads</li>
              )}
              {pkg.features.top && (
                <li>✓ {pkg.features.top} Top ads</li>
              )}
              {pkg.features.vip && (
                <li>✓ {pkg.features.vip} VIP ads</li>
              )}
              {pkg.features.spotlight && (
                <li>✓ {pkg.features.spotlight} Spotlight ads</li>
              )}
              {pkg.features.support && (
                <li>✓ {pkg.features.support} support</li>
              )}
              {pkg.features.ads_per_month && (
                <li>✓ {pkg.features.ads_per_month} ads per month</li>
              )}
            </ul>
          </div>
        </div>

        <Button 
          onClick={() => onPurchase(pkg)}
          disabled={loading}
          className={`w-full ${getPackageColor(pkg.package_type)} hover:opacity-90`}
          size="lg"
        >
          {loading ? 'Processing...' : `Purchase Package`}
        </Button>
      </CardContent>
    </Card>
  );
}
