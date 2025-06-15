
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/lib/types';

/**
 * Loads all product categories from Supabase.
 */
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true }); // Sort alphabetically for UI consistency
      if (error) throw error;
      return data as Category[];
    },
    staleTime: 60 * 60 * 1000, // 1 hr
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
