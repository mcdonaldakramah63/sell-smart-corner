
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface SavedSearch {
  id: string;
  search_name: string;
  search_query?: string;
  filters?: any;
  location_filters?: any;
  price_range_min?: number;
  price_range_max?: number;
  category_id?: string;
  alert_enabled: boolean;
  alert_frequency: 'immediate' | 'daily' | 'weekly';
  last_alerted_at?: string;
  created_at: string;
}

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSavedSearches = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setSavedSearches(data.map(item => ({
          ...item,
          alert_frequency: item.alert_frequency as 'immediate' | 'daily' | 'weekly'
        })));
      }
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async (searchData: Partial<SavedSearch>) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user.id,
          search_name: searchData.search_name || '',
          search_query: searchData.search_query,
          filters: searchData.filters,
          location_filters: searchData.location_filters,
          price_range_min: searchData.price_range_min,
          price_range_max: searchData.price_range_max,
          category_id: searchData.category_id,
          alert_enabled: searchData.alert_enabled ?? true,
          alert_frequency: searchData.alert_frequency || 'daily'
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const formattedData = {
          ...data,
          alert_frequency: data.alert_frequency as 'immediate' | 'daily' | 'weekly'
        };
        setSavedSearches(prev => [formattedData, ...prev]);
      }

      toast({
        title: 'Search saved',
        description: 'Your search has been saved successfully.',
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error saving search:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save search.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteSavedSearch = async (searchId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) throw error;

      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
      toast({
        title: 'Search deleted',
        description: 'Your saved search has been deleted.',
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting saved search:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete saved search.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateAlertSettings = async (searchId: string, alertEnabled: boolean, alertFrequency: 'immediate' | 'daily' | 'weekly') => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .update({
          alert_enabled: alertEnabled,
          alert_frequency: alertFrequency,
          updated_at: new Date().toISOString()
        })
        .eq('id', searchId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const formattedData = {
          ...data,
          alert_frequency: data.alert_frequency as 'immediate' | 'daily' | 'weekly'
        };
        setSavedSearches(prev => prev.map(search => 
          search.id === searchId ? formattedData : search
        ));
      }

      toast({
        title: 'Alert settings updated',
        description: 'Your search alert settings have been updated.',
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error updating alert settings:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update alert settings.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedSearches();
  }, [user?.id]);

  return {
    savedSearches,
    loading,
    saveSearch,
    deleteSavedSearch,
    updateAlertSettings,
    refetch: fetchSavedSearches
  };
};
