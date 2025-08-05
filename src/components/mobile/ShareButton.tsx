
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useCapacitorFeatures } from '@/hooks/useCapacitorFeatures';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ShareButton = ({ 
  title, 
  text, 
  url, 
  variant = 'outline', 
  size = 'default' 
}: ShareButtonProps) => {
  const { shareContent } = useCapacitorFeatures();
  const { toast } = useToast();

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const success = await shareContent(title, text, shareUrl);
    
    if (!success) {
      // Fallback already handled in useCapacitorFeatures
      console.log('Share operation completed');
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleShare}
      className="gap-2"
    >
      <Share2 className="h-4 w-4" />
      {size !== 'icon' && 'Share'}
    </Button>
  );
};
