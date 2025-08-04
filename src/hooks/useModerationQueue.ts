
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ModerationItem {
  id: string;
  item_type: string;
  item_id: string;
  reporter_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  moderator_id?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
}

export const useModerationQueue = () => {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchModerationQueue = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('moderation_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure status matches our union type
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setItems(typedData);
    } catch (error) {
      console.error('Error fetching moderation queue:', error);
      toast({
        title: 'Error',
        description: 'Failed to load moderation queue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const moderateItem = async (itemId: string, action: 'approved' | 'rejected', notes?: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('moderation_queue')
        .update({
          status: action,
          moderator_id: user.id,
          reviewed_at: new Date().toISOString(),
          notes: notes || null,
        })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Item ${action} successfully`,
      });

      fetchModerationQueue();
    } catch (error) {
      console.error('Error moderating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to moderate item',
        variant: 'destructive',
      });
    }
  };

  const createReport = async (itemType: string, itemId: string, reason: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('moderation_queue')
        .insert({
          item_type: itemType,
          item_id: itemId,
          reporter_id: user.id,
          reason: reason,
        });

      if (error) throw error;

      toast({
        title: 'Report submitted',
        description: 'Your report has been submitted for review',
      });
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit report',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchModerationQueue();
  }, []);

  return {
    items,
    loading,
    moderateItem,
    createReport,
    refetch: fetchModerationQueue,
  };
};
