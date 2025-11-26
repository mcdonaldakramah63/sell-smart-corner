import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  created_at: string;
  rejection_reason?: string;
  user_id: string;
  location?: string;
  category_id?: string;
  categories?: {
    name: string;
  };
  profiles?: {
    full_name: string;
    email: string;
  };
  product_images?: Array<{
    image_url: string;
    is_primary: boolean;
  }>;
}

export const useProductReview = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async (status?: 'pending' | 'approved' | 'rejected') => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(name),
          profiles(full_name, email),
          product_images(image_url, is_primary)
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product approved successfully',
      });

      fetchProducts();
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve product',
        variant: 'destructive',
      });
    }
  };

  const rejectProduct = async (productId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product rejected successfully',
      });

      fetchProducts();
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject product',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchProducts('pending'); // Default to pending products
  }, []);

  return {
    products,
    loading,
    approveProduct,
    rejectProduct,
    fetchProducts,
  };
};
