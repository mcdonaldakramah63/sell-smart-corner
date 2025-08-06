-- Add phone verification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN phone_verification_code TEXT,
ADD COLUMN phone_verification_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN phone_verification_attempts INTEGER DEFAULT 0;