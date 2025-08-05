
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface BlogPost {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  view_count: number;
  likes_count: number;
  comments_enabled: boolean;
  meta_title?: string;
  meta_description?: string;
  tags: string[];
  reading_time?: number;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPosts = async (filters?: { status?: string; authorId?: string; tags?: string[]; limit?: number }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.eq('status', 'published');
      }

      if (filters?.authorId) {
        query = query.eq('author_id', filters.authorId);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPost = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  };

  const createPost = async (postData: Partial<BlogPost>) => {
    if (!user?.id) return null;

    setLoading(true);
    try {
      // Generate slug from title
      const slug = postData.title?.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim() || '';

      // Calculate reading time (average 200 words per minute)
      const wordCount = postData.content?.split(/\s+/).length || 0;
      const readingTime = Math.ceil(wordCount / 200);

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          author_id: user.id,
          slug: `${slug}-${Date.now()}`,
          reading_time: readingTime,
          published_at: postData.status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPosts(prev => [data, ...prev]);
        toast({
          title: 'Blog post created',
          description: `Your blog post "${data.title}" has been created`,
        });
      }

      return data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({
        title: 'Creation failed',
        description: 'Failed to create blog post',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId: string, updates: Partial<BlogPost>) => {
    setLoading(true);
    try {
      // Update reading time if content changed
      if (updates.content) {
        const wordCount = updates.content.split(/\s+/).length;
        updates.reading_time = Math.ceil(wordCount / 200);
      }

      // Set published_at if status changed to published
      if (updates.status === 'published' && !updates.published_at) {
        updates.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPosts(prev => prev.map(post => post.id === postId ? data : post));
        toast({
          title: 'Blog post updated',
          description: 'Your blog post has been updated',
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update blog post',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: 'Blog post deleted',
        description: 'The blog post has been deleted',
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ view_count: supabase.rpc('increment') })
        .eq('id', postId);

      if (error) console.error('Error incrementing view count:', error);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  return {
    posts,
    loading,
    fetchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    incrementViewCount
  };
};
