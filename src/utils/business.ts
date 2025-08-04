
import { supabase } from '@/integrations/supabase/client';

export const hasBusinessAccount = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .single();

    if (error) return false;
    return data?.account_type === 'business';
  } catch (error) {
    return false;
  }
};
