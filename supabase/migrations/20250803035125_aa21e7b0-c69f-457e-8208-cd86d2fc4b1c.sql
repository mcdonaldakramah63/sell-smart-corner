
-- Create user verification tables
CREATE TABLE public.user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('phone', 'email', 'id_document')),
  verification_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, verification_type)
);

-- Create business accounts table
CREATE TABLE public.business_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  registration_number TEXT,
  tax_id TEXT,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  website_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  subscription_plan TEXT DEFAULT 'basic',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create saved searches table
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  search_name TEXT NOT NULL,
  search_query TEXT,
  filters JSONB,
  location_filters JSONB,
  price_range_min NUMERIC,
  price_range_max NUMERIC,
  category_id UUID REFERENCES categories(id),
  alert_enabled BOOLEAN DEFAULT true,
  alert_frequency TEXT DEFAULT 'daily' CHECK (alert_frequency IN ('immediate', 'daily', 'weekly')),
  last_alerted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user sessions for 2FA
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  device_info JSONB,
  ip_address INET,
  is_trusted BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create seller ratings table (enhanced)
CREATE TABLE public.seller_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_content TEXT,
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  response_from_seller TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(seller_id, buyer_id, product_id)
);

-- Create locations/regions table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES locations(id),
  location_type TEXT NOT NULL CHECK (location_type IN ('country', 'region', 'city', 'district')),
  coordinates POINT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ad analytics table
CREATE TABLE public.ad_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'contact', 'share', 'save')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  location_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GHS',
  duration_days INTEGER NOT NULL,
  features JSONB NOT NULL,
  max_ads INTEGER,
  max_images_per_ad INTEGER,
  priority_support BOOLEAN DEFAULT false,
  featured_ads_included INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renewal BOOLEAN DEFAULT true,
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update profiles table with additional fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_level INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_business_account BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trust_score NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS average_rating NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS response_rate NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS response_time_hours NUMERIC DEFAULT 24;

-- Update products table with additional fields
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS year_manufactured INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS contact_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS save_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES locations(id);

-- Enable RLS on all new tables
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_verifications
CREATE POLICY "Users can view own verifications" ON user_verifications
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create own verifications" ON user_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage verifications" ON user_verifications
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for business_accounts
CREATE POLICY "Users can view own business account" ON business_accounts
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can manage own business account" ON business_accounts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage business accounts" ON business_accounts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for saved_searches
CREATE POLICY "Users can manage own saved searches" ON saved_searches
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for seller_ratings
CREATE POLICY "Anyone can view ratings" ON seller_ratings
  FOR SELECT USING (true);
  
CREATE POLICY "Users can create ratings" ON seller_ratings
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);
  
CREATE POLICY "Users can update own ratings" ON seller_ratings
  FOR UPDATE USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can respond to ratings" ON seller_ratings
  FOR UPDATE USING (auth.uid() = seller_id);

-- Create RLS policies for locations
CREATE POLICY "Anyone can view locations" ON locations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage locations" ON locations
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for subscription_plans
CREATE POLICY "Anyone can view active plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON subscription_plans
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for user_subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage subscriptions" ON user_subscriptions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_user_verifications_user_id ON user_verifications(user_id);
CREATE INDEX idx_business_accounts_user_id ON business_accounts(user_id);
CREATE INDEX idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX idx_seller_ratings_seller_id ON seller_ratings(seller_id);
CREATE INDEX idx_seller_ratings_buyer_id ON seller_ratings(buyer_id);
CREATE INDEX idx_ad_analytics_product_id ON ad_analytics(product_id);
CREATE INDEX idx_ad_analytics_created_at ON ad_analytics(created_at);
CREATE INDEX idx_locations_parent_id ON locations(parent_id);
CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_products_location_id ON products(location_id);
CREATE INDEX idx_products_expires_at ON products(expires_at);

-- Insert some default locations
INSERT INTO locations (name, slug, location_type) VALUES 
  ('Ghana', 'ghana', 'country'),
  ('Greater Accra', 'greater-accra', 'region'),
  ('Ashanti', 'ashanti', 'region'),
  ('Central', 'central', 'region'),
  ('Eastern', 'eastern', 'region'),
  ('Northern', 'northern', 'region'),
  ('Upper East', 'upper-east', 'region'),
  ('Upper West', 'upper-west', 'region'),
  ('Volta', 'volta', 'region'),
  ('Western', 'western', 'region'),
  ('Western North', 'western-north', 'region'),
  ('Brong Ahafo', 'brong-ahafo', 'region'),
  ('Savannah', 'savannah', 'region'),
  ('Bono East', 'bono-east', 'region'),
  ('Ahafo', 'ahafo', 'region'),
  ('Oti', 'oti', 'region');

-- Insert some default subscription plans
INSERT INTO subscription_plans (name, description, price, duration_days, features, max_ads, max_images_per_ad, featured_ads_included) VALUES 
  ('Basic', 'Perfect for occasional sellers', 0, 30, '{"basic_support": true, "standard_listing": true}', 5, 5, 0),
  ('Premium', 'Great for regular sellers', 50, 30, '{"priority_support": true, "featured_listing": true, "analytics": true}', 20, 10, 2),
  ('Business', 'Best for businesses and power sellers', 150, 30, '{"priority_support": true, "featured_listing": true, "analytics": true, "bulk_upload": true, "custom_branding": true}', 100, 15, 10);
