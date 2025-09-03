-- Fix the phone verification function to use proper pgcrypto syntax
CREATE OR REPLACE FUNCTION public.generate_phone_verification_code(user_uuid uuid, phone_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  verification_code text;
  code_hash text;
BEGIN
  -- Generate 6-digit code
  verification_code := LPAD((RANDOM() * 999999)::int::text, 6, '0');
  
  -- Hash the code using pgcrypto with proper syntax
  code_hash := crypt(verification_code, gen_salt('bf', 8));
  
  -- Update user profile with hashed code and expiration
  UPDATE public.profiles 
  SET 
    phone_verification_code = code_hash,
    phone_verification_expires_at = now() + interval '10 minutes',
    phone_verification_attempts = 0
  WHERE id = user_uuid;
  
  -- In production, send SMS here instead of logging
  -- For development, log the code (remove in production)
  RAISE NOTICE 'Verification code for %: %', phone_number, verification_code;
  
  RETURN true;
END;
$function$;