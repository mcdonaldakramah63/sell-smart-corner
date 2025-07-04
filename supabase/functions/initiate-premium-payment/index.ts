import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { productId, adType, amount } = await req.json();

    if (!productId || !adType || !amount) {
      throw new Error("Missing required parameters");
    }

    // Get pricing information
    const { data: priceData, error: priceError } = await supabaseClient
      .from('premium_ad_prices')
      .select('*')
      .eq('ad_type', adType)
      .single();

    if (priceError || !priceData) {
      throw new Error("Invalid ad type or pricing not found");
    }

    // Verify the product belongs to the user
    const { data: productData, error: productError } = await supabaseClient
      .from('products')
      .select('user_id')
      .eq('id', productId)
      .single();

    if (productError || productData.user_id !== userData.user.id) {
      throw new Error("Product not found or unauthorized");
    }

    // Generate payment reference
    const paymentReference = `premium_${adType}_${productId}_${Date.now()}`;

    // For demo purposes, return a mock payment URL
    // In production, integrate with Flutterwave, Paystack, or MTN MoMo
    const paymentUrl = `https://checkout.flutterwave.com/v3/hosted/pay/${paymentReference}`;

    // Store pending payment record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + priceData.duration_days);

    const { error: insertError } = await supabaseClient
      .from('premium_ads')
      .insert({
        product_id: productId,
        user_id: userData.user.id,
        ad_type: adType,
        expires_at: expiresAt.toISOString(),
        payment_reference: paymentReference,
        amount: amount,
        status: 'pending'
      });

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        paymentUrl,
        reference: paymentReference,
        amount: amount
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Payment initiation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});