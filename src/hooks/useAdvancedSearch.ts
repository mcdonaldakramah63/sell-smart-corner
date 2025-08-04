
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdvancedSearchFilters {
  query?: string;
  categoryId?: string;
  locationId?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'price' | 'created_at' | 'title' | 'view_count';
  sortOrder?: 'asc' | 'desc';
  hasImages?: boolean;
  isVerifiedSeller?: boolean;
  hasPremiumAd?: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  condition: string;
  created_at: string;
  view_count: number;
  user_id: string;
  category_id: string;
  category_name?: string;
  seller_name?: string;
  seller_avatar?: string;
  is_sold?: boolean;
  images: Array<{ image_url: string; is_primary: boolean }>;
  premium_ad_type?: string;
  seller_rating?: number;
  is_verified_seller?: boolean;
}

export const useAdvancedSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<AdvancedSearchFilters>({});
  const { toast } = useToast();

  const searchProducts = async (searchFilters: AdvancedSearchFilters, page: number = 0, pageSize: number = 20) => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          price,
          location,
          condition,
          created_at,
          view_count,
          user_id,
          category_id,
          is_sold,
          product_images!inner(image_url, is_primary),
          premium_ads(ad_type, expires_at),
          profiles!inner(average_rating, verification_level, full_name, avatar_url),
          categories(name)
        `, { count: 'exact' })
        .eq('status', 'approved');

      // Apply text search
      if (searchFilters.query) {
        query = query.or(`title.ilike.%${searchFilters.query}%,description.ilike.%${searchFilters.query}%`);
      }

      // Apply category filter
      if (searchFilters.categoryId) {
        query = query.eq('category_id', searchFilters.categoryId);
      }

      // Apply location filter
      if (searchFilters.locationId) {
        query = query.eq('location_id', searchFilters.locationId);
      }

      // Apply price range
      if (searchFilters.priceMin !== undefined) {
        query = query.gte('price', searchFilters.priceMin);
      }
      if (searchFilters.priceMax !== undefined) {
        query = query.lte('price', searchFilters.priceMax);
      }

      // Apply condition filter
      if (searchFilters.condition) {
        query = query.eq('condition', searchFilters.condition);
      }

      // Apply date range
      if (searchFilters.dateFrom) {
        query = query.gte('created_at', searchFilters.dateFrom);
      }
      if (searchFilters.dateTo) {
        query = query.lte('created_at', searchFilters.dateTo);
      }

      // Apply verified seller filter
      if (searchFilters.isVerifiedSeller) {
        query = query.gt('profiles.verification_level', 0);
      }

      // Apply sorting
      const sortField = searchFilters.sortBy || 'created_at';
      const sortOrder = searchFilters.sortOrder || 'desc';
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      // Apply pagination
      query = query.range(page * pageSize, (page + 1) * pageSize - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      // Transform the data
      const transformedResults: SearchResult[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: Number(item.price),
        location: item.location || '',
        condition: item.condition || '',
        created_at: item.created_at,
        view_count: item.view_count || 0,
        user_id: item.user_id,
        category_id: item.category_id || '',
        category_name: (item.categories as any)?.name,
        seller_name: (item.profiles as any)?.full_name,
        seller_avatar: (item.profiles as any)?.avatar_url,
        is_sold: item.is_sold,
        images: item.product_images || [],
        premium_ad_type: (item.premium_ads as any)?.[0]?.ad_type,
        seller_rating: (item.profiles as any)?.average_rating,
        is_verified_seller: ((item.profiles as any)?.verification_level || 0) > 0
      }));

      setResults(transformedResults);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (searchFilters: AdvancedSearchFilters) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setFilters(searchFilters);
        searchProducts(searchFilters);
      }, 300);
    };
  }, []);

  return {
    results,
    loading,
    totalCount,
    filters,
    searchProducts,
    debouncedSearch,
    setFilters
  };
};
