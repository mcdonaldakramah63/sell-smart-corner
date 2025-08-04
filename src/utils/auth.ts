
import { supabase } from '@/integrations/supabase/client';

export const hasRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', role as 'admin' | 'moderator' | 'user')
      .single();

    if (error) return false;
    return !!data;
  } catch (error) {
    return false;
  }
};
