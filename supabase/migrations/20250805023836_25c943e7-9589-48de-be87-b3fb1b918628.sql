
-- Update the premium_ads table to support all ad types
ALTER TABLE public.premium_ads DROP CONSTRAINT IF EXISTS premium_ads_ad_type_check;

-- Create a custom enum type for premium ad types
DO $$ BEGIN
    CREATE TYPE premium_ad_type AS ENUM ('featured', 'top', 'urgent', 'spotlight', 'vip', 'bump');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the column to use the enum
ALTER TABLE public.premium_ads ALTER COLUMN ad_type TYPE premium_ad_type USING ad_type::premium_ad_type;

-- Update payment_transactions to support all transaction types
ALTER TABLE public.payment_transactions DROP CONSTRAINT IF EXISTS payment_transactions_transaction_type_check;
ALTER TABLE public.payment_transactions ALTER COLUMN transaction_type DROP DEFAULT;
ALTER TABLE public.payment_transactions ADD CONSTRAINT payment_transactions_transaction_type_check 
  CHECK (transaction_type IN ('subscription', 'premium_ad', 'featured_ad', 'top_ad', 'urgent_ad', 'spotlight_ad', 'vip_ad', 'bump_ad'));
