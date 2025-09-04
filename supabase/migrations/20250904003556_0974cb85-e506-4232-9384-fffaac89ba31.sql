-- Simplify the phone verification function without complex hashing
CREATE OR REPLACE FUNCTION public.generate_phone_verification_code(user_uuid uuid, phone_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  verification_code text;
BEGIN
  -- Generate 6-digit code
  verification_code := LPAD((RANDOM() * 999999)::int::text, 6, '0');
  
  -- Store the code directly (in production, you'd hash this)
  UPDATE public.profiles 
  SET 
    phone_verification_code = verification_code,
    phone_verification_expires_at = now() + interval '10 minutes',
    phone_verification_attempts = 0
  WHERE id = user_uuid;
  
  -- For development, log the code (remove in production)
  RAISE NOTICE 'Verification code for %: %', phone_number, verification_code;
  
  RETURN true;
END;
$function$;

-- Also update the verify function to work with plaintext comparison
CREATE OR REPLACE FUNCTION public.verify_phone_code(user_uuid uuid, input_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  stored_code text;
  expires_at timestamp with time zone;
  attempts int;
BEGIN
  -- Get stored data
  SELECT 
    phone_verification_code,
    phone_verification_expires_at,
    phone_verification_attempts
  INTO stored_code, expires_at, attempts
  FROM public.profiles 
  WHERE id = user_uuid;
  
  -- Check if too many attempts
  IF attempts >= 5 THEN
    RAISE EXCEPTION 'Too many verification attempts. Please request a new code.';
  END IF;
  
  -- Check if code expired
  IF expires_at < now() THEN
    RAISE EXCEPTION 'Verification code has expired. Please request a new code.';
  END IF;
  
  -- Increment attempts
  UPDATE public.profiles 
  SET phone_verification_attempts = attempts + 1
  WHERE id = user_uuid;
  
  -- Verify code (simple comparison for development)
  IF stored_code IS NULL OR stored_code != input_code THEN
    RETURN false;
  END IF;
  
  -- Code is valid - mark phone as verified and clear verification data
  UPDATE public.profiles 
  SET 
    phone_verified = true,
    phone_verification_code = NULL,
    phone_verification_expires_at = NULL,
    phone_verification_attempts = 0
  WHERE id = user_uuid;
  
  RETURN true;
END;
$function$;