
import { supabase } from '@/integrations/supabase/client';

export const hasRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) return false;
    return data?.role === role;
  } catch (error) {
    return false;
  }
};
