-- Fix remaining security issues

-- 1. Fix remaining functions to include search_path
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conversation_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM conversation_participants 
    WHERE conversation_id = conversation_uuid 
    AND user_id = user_uuid
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_conversation_participants(conversation_uuid uuid)
RETURNS TABLE(user_id uuid)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT cp.user_id
  FROM conversation_participants cp
  WHERE cp.conversation_id = conversation_uuid;
END;
$function$;

CREATE OR REPLACE FUNCTION public.make_user_admin(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_active_premium_ad(product_uuid uuid, ad_type_filter premium_ad_type DEFAULT NULL::premium_ad_type)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.premium_ads
    WHERE product_id = product_uuid
      AND expires_at > now()
      AND status = 'active'
      AND (ad_type_filter IS NULL OR ad_type = ad_type_filter)
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_user_banned(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_bans 
    WHERE user_id = user_uuid 
    AND (is_permanent = true OR expires_at > now())
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_premium_ad_info(product_uuid uuid)
RETURNS TABLE(ad_type premium_ad_type, expires_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT pa.ad_type, pa.expires_at
  FROM public.premium_ads pa
  WHERE pa.product_id = product_uuid
    AND pa.expires_at > now()
    AND pa.status = 'active'
  ORDER BY 
    CASE pa.ad_type 
      WHEN 'spotlight' THEN 1
      WHEN 'vip' THEN 2  
      WHEN 'featured' THEN 3
      WHEN 'bump' THEN 4
    END
  LIMIT 1
$function$;

CREATE OR REPLACE FUNCTION public.is_user_blocked(blocker_uuid uuid, blocked_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_blocks
    WHERE blocker_id = blocker_uuid AND blocked_id = blocked_uuid
  );
$function$;

CREATE OR REPLACE FUNCTION public.find_conversation_for_product(product_uuid uuid, user_one uuid, user_two uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  found_id uuid;
BEGIN
  SELECT c.id INTO found_id
  FROM conversations c
  JOIN conversation_participants p1 ON p1.conversation_id = c.id AND p1.user_id = user_one
  JOIN conversation_participants p2 ON p2.conversation_id = c.id AND p2.user_id = user_two
  WHERE c.product_id = product_uuid
  LIMIT 1;
  RETURN found_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_current_user_participant(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT p_user_id = auth.uid();
$function$;

-- 2. Add missing RLS policies for tables without any policies
-- Add basic policy for user_sessions table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can manage own sessions" ON user_sessions;
    EXECUTE 'CREATE POLICY "Users can manage own sessions" ON user_sessions FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())';
  END IF;
END $$;