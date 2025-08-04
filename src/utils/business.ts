
import { supabase } from '@/integrations/supabase/client';

export const hasBusinessAccount = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('business_accounts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error) return false;
    return !!data;
  } catch (error) {
    return false;
  }
};
