-- Create enum for premium ad types
CREATE TYPE public.premium_ad_type AS ENUM ('featured', 'bump', 'vip', 'spotlight');

-- Create premium_ads table to track premium ad purchases
CREATE TABLE public.premium_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    ad_type premium_ad_type NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_reference TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on premium_ads
ALTER TABLE public.premium_ads ENABLE ROW LEVEL SECURITY;

-- Create policies for premium_ads
CREATE POLICY "Users can view their own premium ads"
ON public.premium_ads
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own premium ads"
ON public.premium_ads
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all premium ads"
ON public.premium_ads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all premium ads"
ON public.premium_ads
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create premium_ad_prices table for pricing configuration
CREATE TABLE public.premium_ad_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_type premium_ad_type NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    currency TEXT DEFAULT 'NGN',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on premium_ad_prices
ALTER TABLE public.premium_ad_prices ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to pricing
CREATE POLICY "Anyone can view premium ad prices"
ON public.premium_ad_prices
FOR SELECT
TO authenticated
USING (true);

-- Create policy for admin management
CREATE POLICY "Admins can manage premium ad prices"
ON public.premium_ad_prices
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default pricing
INSERT INTO public.premium_ad_prices (ad_type, price, duration_days, description) VALUES
('featured', 500.00, 7, 'Feature your ad at the top of search results for 7 days'),
('bump', 100.00, 1, 'Bump your ad to the top for 24 hours'),
('vip', 1000.00, 14, 'VIP status with special highlighting for 14 days'),
('spotlight', 1500.00, 30, 'Premium spotlight section placement for 30 days');

-- Create function to check if product has active premium ad
CREATE OR REPLACE FUNCTION public.has_active_premium_ad(product_uuid UUID, ad_type_filter premium_ad_type DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.premium_ads
    WHERE product_id = product_uuid
      AND expires_at > now()
      AND status = 'active'
      AND (ad_type_filter IS NULL OR ad_type = ad_type_filter)
  )
$$;

-- Create function to get premium ad info for product
CREATE OR REPLACE FUNCTION public.get_premium_ad_info(product_uuid UUID)
RETURNS TABLE(ad_type premium_ad_type, expires_at TIMESTAMP WITH TIME ZONE)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
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
$$;

-- Create indexes for better performance
CREATE INDEX idx_premium_ads_product_expires ON public.premium_ads(product_id, expires_at);
CREATE INDEX idx_premium_ads_type_expires ON public.premium_ads(ad_type, expires_at);
CREATE INDEX idx_premium_ads_user_id ON public.premium_ads(user_id);