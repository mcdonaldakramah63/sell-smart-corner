
-- Enhanced user verification system
CREATE TABLE IF NOT EXISTS public.user_verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('national_id', 'passport', 'drivers_license', 'utility_bill')),
  document_url TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced business account settings
CREATE TABLE IF NOT EXISTS public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business_accounts(id) ON DELETE CASCADE NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, setting_key)
);

-- Search alerts and notifications
CREATE TABLE IF NOT EXISTS public.search_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_search_id UUID REFERENCES public.saved_searches(id) ON DELETE CASCADE NOT NULL,
  last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_results_count INTEGER DEFAULT 0,
  new_results_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced payment transactions with more details
ALTER TABLE public.payment_transactions ADD COLUMN IF NOT EXISTS gateway_response JSONB;
ALTER TABLE public.payment_transactions ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0;
ALTER TABLE public.payment_transactions ADD COLUMN IF NOT EXISTS refund_reason TEXT;
ALTER TABLE public.payment_transactions ADD COLUMN IF NOT EXISTS fees NUMERIC DEFAULT 0;
ALTER TABLE public.payment_transactions ADD COLUMN IF NOT EXISTS net_amount NUMERIC;

-- Subscription usage tracking
CREATE TABLE IF NOT EXISTS public.subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE CASCADE NOT NULL,
  usage_type TEXT NOT NULL CHECK (usage_type IN ('ad_post', 'image_upload', 'featured_ad', 'support_ticket')),
  usage_count INTEGER DEFAULT 1,
  usage_date DATE DEFAULT CURRENT_DATE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscription_id, usage_type, usage_date)
);

-- Enhanced ad analytics with more tracking
ALTER TABLE public.ad_analytics ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.ad_analytics ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE public.ad_analytics ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE public.ad_analytics ADD COLUMN IF NOT EXISTS conversion_type TEXT;
ALTER TABLE public.ad_analytics ADD COLUMN IF NOT EXISTS conversion_value NUMERIC;

-- Location hierarchy for better organization
CREATE TABLE IF NOT EXISTS public.location_hierarchy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_location_id UUID REFERENCES public.locations(id),
  child_location_id UUID REFERENCES public.locations(id) NOT NULL,
  hierarchy_level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_location_id, child_location_id)
);

-- Multi-language content support
CREATE TABLE IF NOT EXISTS public.content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('category', 'location', 'cms_page', 'product')),
  content_id UUID NOT NULL,
  language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'zh', 'ja', 'tw')),
  field_name TEXT NOT NULL,
  translated_content TEXT NOT NULL,
  translator_id UUID REFERENCES auth.users(id),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_type, content_id, language_code, field_name)
);

-- Blog/news system
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_enabled BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES public.blog_comments(id),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral/affiliate system
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  commission_rate NUMERIC DEFAULT 0.05 CHECK (commission_rate >= 0 AND commission_rate <= 1),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referral_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID REFERENCES public.referral_codes(id) NOT NULL,
  referee_id UUID REFERENCES auth.users(id) NOT NULL,
  referrer_id UUID REFERENCES auth.users(id) NOT NULL,
  transaction_id UUID REFERENCES public.payment_transactions(id),
  commission_amount NUMERIC NOT NULL,
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR codes for ads
CREATE TABLE IF NOT EXISTS public.product_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  qr_code_data TEXT NOT NULL,
  qr_image_url TEXT,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Social sharing tracking
CREATE TABLE IF NOT EXISTS public.social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'email', 'copy_link')),
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Currency rates for multi-currency support
CREATE TABLE IF NOT EXISTS public.currency_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL DEFAULT 'GHS',
  target_currency TEXT NOT NULL,
  exchange_rate NUMERIC NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(base_currency, target_currency)
);

-- Enable RLS on new tables
ALTER TABLE public.user_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User verification documents
CREATE POLICY "Users can view own verification documents" ON public.user_verification_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own verification documents" ON public.user_verification_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage verification documents" ON public.user_verification_documents FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Business settings
CREATE POLICY "Business owners can manage settings" ON public.business_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM business_accounts WHERE id = business_id AND user_id = auth.uid())
);

-- Search alerts
CREATE POLICY "Users can manage own search alerts" ON public.search_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM saved_searches WHERE id = saved_search_id AND user_id = auth.uid())
);

-- Subscription usage
CREATE POLICY "Users can view own subscription usage" ON public.subscription_usage FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_subscriptions WHERE id = subscription_id AND user_id = auth.uid())
);
CREATE POLICY "System can insert subscription usage" ON public.subscription_usage FOR INSERT WITH CHECK (true);

-- Location hierarchy
CREATE POLICY "Anyone can view location hierarchy" ON public.location_hierarchy FOR SELECT USING (true);
CREATE POLICY "Admins can manage location hierarchy" ON public.location_hierarchy FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Content translations
CREATE POLICY "Anyone can view approved translations" ON public.content_translations FOR SELECT USING (is_approved = true);
CREATE POLICY "Translators can create translations" ON public.content_translations FOR INSERT WITH CHECK (auth.uid() = translator_id);
CREATE POLICY "Admins can manage translations" ON public.content_translations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Blog posts
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can manage own posts" ON public.blog_posts FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Blog comments
CREATE POLICY "Anyone can view approved comments" ON public.blog_comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.blog_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage comments" ON public.blog_comments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Referral codes
CREATE POLICY "Users can view own referral codes" ON public.referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own referral codes" ON public.referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own referral codes" ON public.referral_codes FOR UPDATE USING (auth.uid() = user_id);

-- Referral transactions
CREATE POLICY "Users can view own referral transactions" ON public.referral_transactions FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);
CREATE POLICY "System can create referral transactions" ON public.referral_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage referral transactions" ON public.referral_transactions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Product QR codes
CREATE POLICY "Anyone can view QR codes" ON public.product_qr_codes FOR SELECT USING (true);
CREATE POLICY "Product owners can manage QR codes" ON public.product_qr_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM products WHERE id = product_id AND user_id = auth.uid())
);

-- Social shares
CREATE POLICY "Anyone can create social shares" ON public.social_shares FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view social shares" ON public.social_shares FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Currency rates
CREATE POLICY "Anyone can view currency rates" ON public.currency_rates FOR SELECT USING (true);
CREATE POLICY "Admins can manage currency rates" ON public.currency_rates FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default currency rates
INSERT INTO public.currency_rates (base_currency, target_currency, exchange_rate) VALUES
  ('GHS', 'USD', 0.063),
  ('GHS', 'EUR', 0.058),
  ('GHS', 'GBP', 0.050),
  ('GHS', 'NGN', 102.50),
  ('USD', 'GHS', 15.87),
  ('EUR', 'GHS', 17.24),
  ('GBP', 'GHS', 20.00),
  ('NGN', 'GHS', 0.0098)
ON CONFLICT (base_currency, target_currency) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_verification_documents_user_id ON public.user_verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_business_settings_business_id ON public.business_settings(business_id);
CREATE INDEX IF NOT EXISTS idx_search_alerts_saved_search_id ON public.search_alerts(saved_search_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription_id ON public.subscription_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_content_translations_lookup ON public.content_translations(content_type, content_id, language_code);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts(status, published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_social_shares_product_id ON public.social_shares(product_id);
CREATE INDEX IF NOT EXISTS idx_currency_rates_lookup ON public.currency_rates(base_currency, target_currency);
