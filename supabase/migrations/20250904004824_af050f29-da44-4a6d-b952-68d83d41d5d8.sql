-- Update the phone verification function to call the SMS edge function
CREATE OR REPLACE FUNCTION public.generate_phone_verification_code(user_uuid uuid, phone_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  verification_code text;
  sms_result jsonb;
BEGIN
  -- Generate 6-digit code
  verification_code := LPAD((RANDOM() * 999999)::int::text, 6, '0');
  
  -- Store the code in the database
  UPDATE public.profiles 
  SET 
    phone_verification_code = verification_code,
    phone_verification_expires_at = now() + interval '10 minutes',
    phone_verification_attempts = 0
  WHERE id = user_uuid;
  
  -- Call the SMS edge function to send the code
  SELECT content::jsonb INTO sms_result
  FROM http((
    'POST',
    'https://fksknsaxzmnajlsrrmyg.supabase.co/functions/v1/send-sms',
    ARRAY[
      http_header('Authorization', 'Bearer ' || current_setting('request.jwt.claims', true)::json->>'token'),
      http_header('Content-Type', 'application/json'),
      http_header('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2tuc2F4em1uYWpsc3JybXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDQ5NjksImV4cCI6MjA2MzQ4MDk2OX0.a-up-sfFxdIO8zygMo0UU-D0utjVaw5E13hPheHW10o')
    ],
    'application/json',
    json_build_object(
      'phoneNumber', phone_number,
      'message', 'Your verification code is: ' || verification_code || '. This code expires in 10 minutes.'
    )::text
  ));
  
  -- Check if SMS was sent successfully
  IF sms_result->>'success' = 'true' THEN
    RAISE NOTICE 'Verification code sent to %: %', phone_number, verification_code;
  ELSE
    RAISE NOTICE 'Failed to send SMS, but code generated: %', verification_code;
  END IF;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    -- If SMS fails, still log the code for development
    RAISE NOTICE 'SMS failed, verification code for %: %', phone_number, verification_code;
    RETURN true;
END;
$function$;