
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SocialShare {
  id: string;
  product_id?: string;
  blog_post_id?: string;
  user_id?: string;
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'telegram' | 'email' | 'copy_link';
  shared_at: string;
}

export const useSocialSharing = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const shareContent = async (
    platform: SocialShare['platform'],
    url: string,
    title: string,
    description?: string,
    productId?: string,
    blogPostId?: string
  ) => {
    setLoading(true);
    try {
      // Track the share
      await supabase
        .from('social_shares')
        .insert({
          product_id: productId,
          blog_post_id: blogPostId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          platform
        });

      // Generate share URLs
      const encodedUrl = encodeURIComponent(url);
      const encodedTitle = encodeURIComponent(title);
      const encodedDescription = encodeURIComponent(description || '');

      let shareUrl = '';

      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodedTitle} ${encodedUrl}`;
          break;
        case 'telegram':
          shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription} ${encodedUrl}`;
          break;
        case 'copy_link':
          await navigator.clipboard.writeText(url);
          toast({
            title: 'Link copied',
            description: 'The link has been copied to your clipboard',
          });
          return;
      }

      // Open share window
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }

      toast({
        title: 'Content shared',
        description: `Successfully shared on ${platform}`,
      });
    } catch (error) {
      console.error('Error sharing content:', error);
      toast({
        title: 'Share failed',
        description: 'Failed to share content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getShareStats = async (productId?: string, blogPostId?: string) => {
    try {
      let query = supabase
        .from('social_shares')
        .select('platform');

      if (productId) query = query.eq('product_id', productId);
      if (blogPostId) query = query.eq('blog_post_id', blogPostId);

      const { data, error } = await query;
      if (error) throw error;

      // Count shares by platform
      const stats: Record<string, number> = {};
      data?.forEach(share => {
        stats[share.platform] = (stats[share.platform] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching share stats:', error);
      return {};
    }
  };

  return {
    shareContent,
    getShareStats,
    loading
  };
};
