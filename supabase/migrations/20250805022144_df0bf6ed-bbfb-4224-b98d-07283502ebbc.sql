
-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mobile_money', 'card', 'bank')),
  provider TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  configuration JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment transactions table
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GHS',
  payment_method_id UUID REFERENCES payment_methods(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('subscription', 'premium_ad', 'featured_ad', 'top_ad', 'urgent_ad')),
  reference_id UUID, -- Links to subscription_id or premium_ad_id
  external_reference TEXT, -- Payment gateway transaction ID
  payment_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create promotion tiers table
CREATE TABLE public.promotion_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('featured', 'top', 'urgent', 'spotlight', 'vip', 'bump')),
  price DECIMAL(10,2) NOT NULL,
  duration_hours INTEGER NOT NULL,
  boost_multiplier DECIMAL(3,2) DEFAULT 1.0,
  priority_score INTEGER DEFAULT 0,
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create geographic targeting table
CREATE TABLE public.ad_geographic_targeting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  premium_ad_id UUID REFERENCES premium_ads(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  city TEXT,
  radius_km INTEGER,
  coordinates POINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create seasonal campaigns table
CREATE TABLE public.seasonal_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  target_categories JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bulk promotion packages table
CREATE TABLE public.bulk_promotion_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  package_type TEXT NOT NULL,
  ad_count INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  duration_days INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user package purchases table
CREATE TABLE public.user_package_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  package_id UUID REFERENCES bulk_promotion_packages(id),
  transaction_id UUID REFERENCES payment_transactions(id),
  ads_remaining INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create revenue sharing table
CREATE TABLE public.revenue_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES payment_transactions(id),
  platform_share DECIMAL(10,2) NOT NULL,
  advertiser_share DECIMAL(10,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_geographic_targeting ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_promotion_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_package_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_methods
CREATE POLICY "Anyone can view active payment methods" ON payment_methods
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage payment methods" ON payment_methods
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view own transactions" ON payment_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions" ON payment_transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all transactions" ON payment_transactions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for promotion_tiers
CREATE POLICY "Anyone can view active promotion tiers" ON promotion_tiers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage promotion tiers" ON promotion_tiers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for ad_geographic_targeting
CREATE POLICY "Users can manage targeting for own ads" ON ad_geographic_targeting
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM premium_ads 
      WHERE premium_ads.id = ad_geographic_targeting.premium_ad_id 
      AND premium_ads.user_id = auth.uid()
    )
  );

-- RLS Policies for seasonal_campaigns
CREATE POLICY "Anyone can view active campaigns" ON seasonal_campaigns
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage campaigns" ON seasonal_campaigns
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for bulk_promotion_packages
CREATE POLICY "Anyone can view active packages" ON bulk_promotion_packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage packages" ON bulk_promotion_packages
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_package_purchases
CREATE POLICY "Users can view own packages" ON user_package_purchases
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own package purchases" ON user_package_purchases
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all package purchases" ON user_package_purchases
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for revenue_shares
CREATE POLICY "Admins can view revenue shares" ON revenue_shares
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert revenue shares" ON revenue_shares
  FOR INSERT WITH CHECK (true);

-- Insert default payment methods
INSERT INTO payment_methods (name, type, provider, configuration) VALUES
('MTN Mobile Money', 'mobile_money', 'mtn', '{"prefix": "024,054,055,059", "currency": "GHS"}'),
('Vodafone Cash', 'mobile_money', 'vodafone', '{"prefix": "020,050", "currency": "GHS"}'),
('AirtelTigo Money', 'mobile_money', 'airteltigo', '{"prefix": "027,057,026,056", "currency": "GHS"}'),
('Credit/Debit Card', 'card', 'paystack', '{"supported_cards": ["visa", "mastercard"], "currency": "GHS"}');

-- Insert default promotion tiers
INSERT INTO promotion_tiers (name, type, price, duration_hours, boost_multiplier, priority_score, features) VALUES
('Featured Ad', 'featured', 10.00, 168, 2.0, 100, '{"badge": "Featured", "highlight": true, "top_search": false}'),
('Top Ad', 'top', 25.00, 168, 3.0, 200, '{"badge": "Top", "highlight": true, "top_search": true, "border": "gold"}'),
('Urgent Ad', 'urgent', 15.00, 72, 2.5, 150, '{"badge": "Urgent", "highlight": true, "blink": true, "color": "red"}'),
('VIP Ad', 'vip', 50.00, 336, 5.0, 300, '{"badge": "VIP", "highlight": true, "top_search": true, "border": "purple", "priority_support": true}'),
('Spotlight', 'spotlight', 35.00, 168, 4.0, 250, '{"badge": "Spotlight", "highlight": true, "homepage_banner": true, "social_share": true}');

-- Insert default bulk packages
INSERT INTO bulk_promotion_packages (name, package_type, ad_count, total_price, discount_percentage, duration_days, features) VALUES
('Starter Pack', 'featured', 5, 40.00, 20, 30, '{"ads_per_month": 5, "support": "email"}'),
('Business Pack', 'mixed', 15, 150.00, 25, 60, '{"featured": 10, "top": 5, "support": "priority"}'),
('Enterprise Pack', 'premium', 50, 400.00, 35, 90, '{"featured": 20, "top": 15, "vip": 10, "spotlight": 5, "support": "dedicated"}');
