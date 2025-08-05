
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Zap, TrendingUp, ArrowUp, Crown, Spotlight } from "lucide-react";
import type { PromotionTier } from '@/hooks/usePromotionTiers';

interface PromotionTierCardProps {
  tier: PromotionTier;
  onPurchase: (tier: PromotionTier) => void;
  loading?: boolean;
}

export function PromotionTierCard({ tier, onPurchase, loading }: PromotionTierCardProps) {
  const getTierIcon = (type: string) => {
    switch (type) {
      case 'featured': return <Star className="h-5 w-5" />;
      case 'top': return <TrendingUp className="h-5 w-5" />;
      case 'urgent': return <ArrowUp className="h-5 w-5" />;
      case 'vip': return <Crown className="h-5 w-5" />;
      case 'spotlight': return <Spotlight className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getTierColor = (type: string) => {
    switch (type) {
      case 'featured': return 'bg-blue-500';
      case 'top': return 'bg-orange-500';
      case 'urgent': return 'bg-red-500';
      case 'vip': return 'bg-purple-500';
      case 'spotlight': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getDurationText = (hours: number) => {
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`p-2 rounded-lg text-white ${getTierColor(tier.type)}`}>
            {getTierIcon(tier.type)}
          </div>
          <div>
            <h3 className="text-lg font-bold">{tier.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {tier.boost_multiplier}x boost
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold">
            GHS {tier.price.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            for {getDurationText(tier.duration_hours)}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Features:</h4>
          <ul className="text-sm space-y-1">
            {tier.features.badge && (
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {tier.features.badge}
                </Badge>
                badge
              </li>
            )}
            {tier.features.highlight && (
              <li>✓ Highlighted listing</li>
            )}
            {tier.features.top_search && (
              <li>✓ Top of search results</li>
            )}
            {tier.features.priority_support && (
              <li>✓ Priority customer support</li>
            )}
            {tier.features.homepage_banner && (
              <li>✓ Homepage banner placement</li>
            )}
            {tier.features.social_share && (
              <li>✓ Enhanced social sharing</li>
            )}
          </ul>
        </div>

        <Button 
          onClick={() => onPurchase(tier)}
          disabled={loading}
          className={`w-full ${getTierColor(tier.type)} hover:opacity-90`}
        >
          {loading ? 'Processing...' : `Promote for GHS ${tier.price}`}
        </Button>
      </CardContent>
    </Card>
  );
}
