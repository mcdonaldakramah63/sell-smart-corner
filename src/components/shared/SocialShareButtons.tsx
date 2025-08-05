
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, MessageSquare, Send, Mail, Copy } from 'lucide-react';
import { useSocialSharing } from '@/hooks/useSocialSharing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  productId?: string;
  blogPostId?: string;
  variant?: 'default' | 'compact';
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  description,
  productId,
  blogPostId,
  variant = 'default'
}) => {
  const { shareContent, loading } = useSocialSharing();

  const handleShare = async (platform: any) => {
    await shareContent(platform, url, title, description, productId, blogPostId);
  };

  const shareOptions = [
    { platform: 'facebook' as const, label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { platform: 'twitter' as const, label: 'Twitter', icon: Twitter, color: 'text-sky-500' },
    { platform: 'linkedin' as const, label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { platform: 'whatsapp' as const, label: 'WhatsApp', icon: MessageSquare, color: 'text-green-600' },
    { platform: 'telegram' as const, label: 'Telegram', icon: Send, color: 'text-sky-600' },
    { platform: 'email' as const, label: 'Email', icon: Mail, color: 'text-gray-600' },
    { platform: 'copy_link' as const, label: 'Copy Link', icon: Copy, color: 'text-gray-600' }
  ];

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {shareOptions.map(({ platform, label, icon: Icon, color }) => (
            <DropdownMenuItem
              key={platform}
              onClick={() => handleShare(platform)}
              className="cursor-pointer"
            >
              <Icon className={`h-4 w-4 mr-2 ${color}`} />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {shareOptions.map(({ platform, label, icon: Icon, color }) => (
        <Button
          key={platform}
          variant="outline"
          size="sm"
          onClick={() => handleShare(platform)}
          disabled={loading}
          className="gap-2"
        >
          <Icon className={`h-4 w-4 ${color}`} />
          {label}
        </Button>
      ))}
    </div>
  );
};
