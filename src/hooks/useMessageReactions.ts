import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useMessageReactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});

  const addReaction = useCallback(async (messageId: string, reactionType: string) => {
    if (!user?.id) return;

    try {
      // For now, store reactions in localStorage since we don't have a reactions table
      // In a real app, you'd want to store this in the database
      const storageKey = `reactions_${messageId}`;
      const existingReactions = JSON.parse(localStorage.getItem(storageKey) || '{}');
      
      // Toggle reaction
      const userReactionKey = `${user.id}_${reactionType}`;
      if (existingReactions[userReactionKey]) {
        delete existingReactions[userReactionKey];
      } else {
        existingReactions[userReactionKey] = true;
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingReactions));
      
      // Count reactions by type
      const reactionCounts: Record<string, number> = {};
      Object.keys(existingReactions).forEach(key => {
        const [, reaction] = key.split('_');
        reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1;
      });
      
      setReactions(prev => ({
        ...prev,
        [messageId]: reactionCounts
      }));
      
      toast({
        title: 'Reaction added',
        description: 'Your reaction has been saved',
      });
      
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reaction',
        variant: 'destructive'
      });
    }
  }, [user?.id, toast]);

  const loadReactions = useCallback((messageId: string) => {
    const storageKey = `reactions_${messageId}`;
    const existingReactions = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    // Count reactions by type
    const reactionCounts: Record<string, number> = {};
    Object.keys(existingReactions).forEach(key => {
      const [, reaction] = key.split('_');
      reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1;
    });
    
    setReactions(prev => ({
      ...prev,
      [messageId]: reactionCounts
    }));
  }, []);

  return {
    reactions,
    addReaction,
    loadReactions
  };
};