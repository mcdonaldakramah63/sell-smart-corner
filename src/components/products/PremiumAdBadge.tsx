import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Crown, Zap } from 'lucide-react';

interface PremiumAdBadgeProps {
  adType: 'featured' | 'bump' | 'vip' | 'spotlight';
  className?: string;
}

export const PremiumAdBadge = ({ adType, className }: PremiumAdBadgeProps) => {
  const getBadgeConfig = (type: string) => {
    switch (type) {
      case 'featured':
        return {
          icon: <Star className="h-3 w-3" />,
          label: 'Featured',
          className: 'bg-blue-500 hover:bg-blue-600 text-white'
        };
      case 'bump':
        return {
          icon: <TrendingUp className="h-3 w-3" />,
          label: 'Bumped',
          className: 'bg-green-500 hover:bg-green-600 text-white'
        };
      case 'vip':
        return {
          icon: <Crown className="h-3 w-3" />,
          label: 'VIP',
          className: 'bg-purple-500 hover:bg-purple-600 text-white'
        };
      case 'spotlight':
        return {
          icon: <Zap className="h-3 w-3" />,
          label: 'Spotlight',
          className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        };
      default:
        return {
          icon: <Star className="h-3 w-3" />,
          label: 'Premium',
          className: 'bg-blue-500 hover:bg-blue-600 text-white'
        };
    }
  };

  const config = getBadgeConfig(adType);

  return (
    <Badge 
      className={`${config.className} ${className} flex items-center gap-1 text-xs font-medium`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};