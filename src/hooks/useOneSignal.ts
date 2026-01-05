import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    OneSignal: any;
  }
}

export const useOneSignal = (userType: 'customer' | 'rider' = 'customer') => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const initRef = useRef(false);

  // Fetch OneSignal App ID from edge function
  const fetchAppId = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-onesignal-config');
      if (error || !data?.configured) {
        console.log('[OneSignal] Not configured');
        return null;
      }
      return data.appId;
    } catch (error) {
      console.error('[OneSignal] Error fetching config:', error);
      return null;
    }
  }, []);

  // Initialize OneSignal
  useEffect(() => {
    if (initRef.current) return;
    
    const initOneSignal = async () => {
      const appId = await fetchAppId();
      if (!appId) {
        console.log('[OneSignal] App ID not available');
        return;
      }

      // Load OneSignal SDK if not already loaded
      if (!window.OneSignal) {
        const script = document.createElement('script');
        script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
        script.async = true;
        
        script.onload = async () => {
          window.OneSignal = window.OneSignal || [];
          await setupOneSignal(appId);
        };
        
        document.head.appendChild(script);
      } else {
        await setupOneSignal(appId);
      }
    };

    const setupOneSignal = async (appId: string) => {
      try {
        await window.OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false,
          },
          welcomeNotification: {
            disable: true,
          },
        });

        setIsInitialized(true);
        initRef.current = true;
        console.log('[OneSignal] Initialized successfully');

        // Check subscription status
        const subscribed = await window.OneSignal.isPushNotificationsEnabled();
        setIsSubscribed(subscribed);

        // Get player ID if subscribed
        if (subscribed) {
          const id = await window.OneSignal.getUserId();
          setPlayerId(id);
          console.log('[OneSignal] Player ID:', id);
        }
      } catch (error) {
        console.error('[OneSignal] Initialization error:', error);
      }
    };

    initOneSignal();
  }, [fetchAppId]);

  // Register player ID when user is authenticated
  const registerPlayerId = useCallback(async (id: string) => {
    if (!user?.id || !id) return;

    try {
      // Check if token already exists
      const { data: existing } = await supabase
        .from('user_push_tokens')
        .select('id')
        .eq('user_id', user.id)
        .eq('player_id', id)
        .maybeSingle();

      if (existing) {
        // Update existing token
        await supabase
          .from('user_push_tokens')
          .update({ is_active: true, user_type: userType, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        // Insert new token
        await supabase
          .from('user_push_tokens')
          .insert({
            user_id: user.id,
            player_id: id,
            user_type: userType,
            device_type: 'web',
            is_active: true,
          });
      }

      console.log('[OneSignal] Player ID registered for user:', user.id);
    } catch (error) {
      console.error('[OneSignal] Error registering player ID:', error);
    }
  }, [user?.id, userType]);

  // Subscribe user to push notifications
  const subscribe = useCallback(async () => {
    if (!window.OneSignal || !isInitialized) {
      toast({
        title: 'Notifications not ready',
        description: 'Please try again in a moment',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Show native permission prompt
      await window.OneSignal.showNativePrompt();
      
      // Wait for subscription
      const subscribed = await window.OneSignal.isPushNotificationsEnabled();
      setIsSubscribed(subscribed);

      if (subscribed) {
        const id = await window.OneSignal.getUserId();
        setPlayerId(id);
        
        // Register with backend
        if (id && user?.id) {
          await registerPlayerId(id);
        }

        toast({
          title: 'Notifications enabled',
          description: 'You will now receive push notifications',
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('[OneSignal] Subscribe error:', error);
      toast({
        title: 'Failed to enable notifications',
        description: 'Please check your browser settings',
        variant: 'destructive',
      });
      return false;
    }
  }, [isInitialized, user?.id, registerPlayerId, toast]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!window.OneSignal || !isInitialized) return false;

    try {
      await window.OneSignal.setSubscription(false);
      setIsSubscribed(false);

      // Deactivate token in database
      if (playerId && user?.id) {
        await supabase
          .from('user_push_tokens')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('player_id', playerId);
      }

      toast({
        title: 'Notifications disabled',
        description: 'You will no longer receive push notifications',
      });
      return true;
    } catch (error) {
      console.error('[OneSignal] Unsubscribe error:', error);
      return false;
    }
  }, [isInitialized, playerId, user?.id, toast]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          title: 'Test Notification',
          message: 'This is a test notification from your app!',
          userIds: [user.id],
        },
      });

      if (error) throw error;

      toast({
        title: 'Test notification sent',
        description: 'You should receive it shortly',
      });
    } catch (error) {
      console.error('[OneSignal] Test notification error:', error);
      toast({
        title: 'Failed to send test notification',
        variant: 'destructive',
      });
    }
  }, [user?.id, toast]);

  // Auto-register when subscribed and logged in
  useEffect(() => {
    if (isSubscribed && playerId && user?.id) {
      registerPlayerId(playerId);
    }
  }, [isSubscribed, playerId, user?.id, registerPlayerId]);

  return {
    isInitialized,
    isSubscribed,
    playerId,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
};
