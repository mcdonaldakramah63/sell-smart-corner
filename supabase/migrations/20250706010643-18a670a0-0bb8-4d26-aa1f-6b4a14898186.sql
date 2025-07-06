-- Update default currency from NGN to GHS in premium_ad_prices table
ALTER TABLE public.premium_ad_prices 
ALTER COLUMN currency SET DEFAULT 'GHS';

-- Update existing records to use GHS currency
UPDATE public.premium_ad_prices 
SET currency = 'GHS' 
WHERE currency = 'NGN';

-- Update default currency in premium_ads table as well  
ALTER TABLE public.premium_ads 
ALTER COLUMN currency SET DEFAULT 'GHS';

-- Update existing premium ads to use GHS currency
UPDATE public.premium_ads 
SET currency = 'GHS' 
WHERE currency = 'NGN';