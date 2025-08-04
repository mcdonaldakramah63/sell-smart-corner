
-- Create admin dashboard tables and business features

-- Admin settings table
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content moderation queue
CREATE TABLE public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL, -- 'product', 'user', 'review'
  item_id UUID NOT NULL,
  reporter_id UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  moderator_id UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Revenue tracking table
CREATE TABLE public.revenue_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT NOT NULL, -- 'subscription', 'premium_ad', 'commission'
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GHS',
  user_id UUID REFERENCES auth.users(id),
  product_id UUID,
  subscription_id UUID,
  premium_ad_id UUID,
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CMS pages table
CREATE TABLE public.cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Business inventory table
CREATE TABLE public.business_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_accounts(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  auto_renewal_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto renewal settings
CREATE TABLE public.auto_renewal_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  ad_type premium_ad_type NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  renewal_frequency INTEGER NOT NULL DEFAULT 30, -- days
  max_renewals INTEGER, -- null for unlimited
  current_renewals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, ad_type)
);

-- Enable RLS on all new tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_renewal_settings ENABLE ROW LEVEL SECURITY;

-- Admin settings policies
CREATE POLICY "Admins can manage settings" ON public.admin_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Moderation queue policies
CREATE POLICY "Admins can manage moderation queue" ON public.moderation_queue
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create reports" ON public.moderation_queue
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their reports" ON public.moderation_queue
  FOR SELECT USING (auth.uid() = reporter_id);

-- Revenue tracking policies
CREATE POLICY "Admins can view all revenue" ON public.revenue_tracking
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert revenue records" ON public.revenue_tracking
  FOR INSERT WITH CHECK (true);

-- CMS pages policies
CREATE POLICY "Admins can manage CMS pages" ON public.cms_pages
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Published pages are publicly readable" ON public.cms_pages
  FOR SELECT USING (is_published = true);

-- Business inventory policies
CREATE POLICY "Business owners can manage inventory" ON public.business_inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM business_accounts 
      WHERE id = business_inventory.business_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all inventory" ON public.business_inventory
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Auto renewal settings policies
CREATE POLICY "Users can manage own renewal settings" ON public.auto_renewal_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all renewal settings" ON public.auto_renewal_settings
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_moderation_queue_status ON public.moderation_queue(status);
CREATE INDEX idx_moderation_queue_item_type ON public.moderation_queue(item_type);
CREATE INDEX idx_revenue_tracking_created_at ON public.revenue_tracking(created_at);
CREATE INDEX idx_revenue_tracking_user_id ON public.revenue_tracking(user_id);
CREATE INDEX idx_cms_pages_slug ON public.cms_pages(slug);
CREATE INDEX idx_business_inventory_business_id ON public.business_inventory(business_id);
CREATE INDEX idx_auto_renewal_settings_user_id ON public.auto_renewal_settings(user_id);
