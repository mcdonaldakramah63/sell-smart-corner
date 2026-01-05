import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  message: string;
  userIds?: string[];
  userType?: 'customer' | 'rider' | 'all';
  data?: Record<string, string>;
  url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID');
    const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      console.error('OneSignal credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'OneSignal not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: NotificationPayload = await req.json();
    const { title, message, userIds, userType = 'all', data, url } = payload;

    console.log('[OneSignal] Sending notification:', { title, userType, userIds: userIds?.length });

    // Create Supabase client to get player IDs
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    let playerIds: string[] = [];

    if (userIds && userIds.length > 0) {
      // Get player IDs for specific users
      const { data: tokens, error } = await supabase
        .from('user_push_tokens')
        .select('player_id')
        .in('user_id', userIds)
        .eq('is_active', true);

      if (error) {
        console.error('[OneSignal] Error fetching tokens:', error);
      } else {
        playerIds = tokens?.map(t => t.player_id) || [];
      }
    } else if (userType !== 'all') {
      // Get player IDs by user type (customer or rider)
      const { data: tokens, error } = await supabase
        .from('user_push_tokens')
        .select('player_id')
        .eq('user_type', userType)
        .eq('is_active', true);

      if (error) {
        console.error('[OneSignal] Error fetching tokens by type:', error);
      } else {
        playerIds = tokens?.map(t => t.player_id) || [];
      }
    }

    // Build OneSignal notification payload
    const notificationPayload: Record<string, unknown> = {
      app_id: ONESIGNAL_APP_ID,
      headings: { en: title },
      contents: { en: message },
    };

    // Add targeting
    if (playerIds.length > 0) {
      notificationPayload.include_player_ids = playerIds;
    } else if (userType === 'all' && (!userIds || userIds.length === 0)) {
      // Send to all subscribed users
      notificationPayload.included_segments = ['Subscribed Users'];
    } else {
      console.log('[OneSignal] No player IDs found, skipping notification');
      return new Response(
        JSON.stringify({ success: false, error: 'No recipients found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add additional data
    if (data) {
      notificationPayload.data = data;
    }

    // Add URL for web push
    if (url) {
      notificationPayload.url = url;
      notificationPayload.web_url = url;
    }

    console.log('[OneSignal] Sending to OneSignal API:', JSON.stringify(notificationPayload, null, 2));

    // Send to OneSignal
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(notificationPayload),
    });

    const result = await response.json();
    console.log('[OneSignal] Response:', result);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: result.errors || 'Failed to send notification' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[OneSignal] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
