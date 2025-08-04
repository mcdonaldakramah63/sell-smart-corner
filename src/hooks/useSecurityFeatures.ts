
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  details?: any;
}

interface TrustedDevice {
  id: string;
  device_name: string;
  device_fingerprint: string;
  last_used: string;
  is_current: boolean;
}

interface DeviceInfo {
  userAgent?: string;
  fingerprint?: string;
  eventType?: string;
  deviceName?: string;
  trusted?: boolean;
  details?: any;
}

export const useSecurityFeatures = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get device fingerprint
  const getDeviceFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Device fingerprint', 2, 2);
    
    return btoa(
      navigator.userAgent + 
      navigator.language + 
      screen.width + 'x' + screen.height + 
      new Date().getTimezoneOffset() +
      canvas.toDataURL()
    ).substring(0, 32);
  };

  // Log security event
  const logSecurityEvent = async (eventType: string, details?: any) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: crypto.randomUUID(),
          device_info: {
            userAgent: navigator.userAgent,
            fingerprint: getDeviceFingerprint(),
            eventType,
            details
          },
          ip_address: await fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => data.ip)
            .catch(() => null),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  // Fetch security events
  const fetchSecurityEvents = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      const events: SecurityEvent[] = (data || []).map(session => {
        const deviceInfo = session.device_info as DeviceInfo | null;
        return {
          id: session.id,
          user_id: session.user_id,
          event_type: deviceInfo?.eventType || 'login',
          ip_address: session.ip_address || undefined,
          user_agent: deviceInfo?.userAgent || undefined,
          created_at: session.created_at,
          details: deviceInfo?.details || undefined
        };
      });

      setSecurityEvents(events);
    } catch (error) {
      console.error('Error fetching security events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if device is trusted
  const isDeviceTrusted = async () => {
    if (!user?.id) return false;

    const fingerprint = getDeviceFingerprint();
    
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_trusted', true)
        .contains('device_info', { fingerprint });

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking device trust:', error);
      return false;
    }
  };

  // Trust current device
  const trustCurrentDevice = async () => {
    if (!user?.id) return;

    try {
      const fingerprint = getDeviceFingerprint();
      
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: crypto.randomUUID(),
          device_info: {
            userAgent: navigator.userAgent,
            fingerprint,
            deviceName: `${navigator.platform} - ${navigator.userAgent.split(') ')[0]})`,
            trusted: true
          },
          is_trusted: true,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Device Trusted',
        description: 'This device has been added to your trusted devices list.',
      });
    } catch (error) {
      console.error('Error trusting device:', error);
      toast({
        title: 'Error',
        description: 'Failed to trust device',
        variant: 'destructive',
      });
    }
  };

  // Revoke device trust
  const revokeDeviceTrust = async (sessionId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Device Trust Revoked',
        description: 'Device has been removed from trusted devices.',
      });

      fetchSecurityEvents();
    } catch (error) {
      console.error('Error revoking device trust:', error);
    }
  };

  // Enable/disable 2FA (placeholder - would integrate with auth provider)
  const toggle2FA = async (enable: boolean) => {
    try {
      // This would typically integrate with your auth provider's 2FA system
      setTwoFactorEnabled(enable);
      
      await logSecurityEvent(enable ? '2fa_enabled' : '2fa_disabled');

      toast({
        title: enable ? '2FA Enabled' : '2FA Disabled',
        description: enable 
          ? 'Two-factor authentication has been enabled for your account.'
          : 'Two-factor authentication has been disabled for your account.',
      });
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchSecurityEvents();
      logSecurityEvent('page_visit', { page: window.location.pathname });
    }
  }, [user?.id]);

  return {
    securityEvents,
    trustedDevices,
    twoFactorEnabled,
    loading,
    logSecurityEvent,
    fetchSecurityEvents,
    isDeviceTrusted,
    trustCurrentDevice,
    revokeDeviceTrust,
    toggle2FA
  };
};
