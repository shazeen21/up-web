-- ============================================================
-- MARKETING & ANALYTICS DATABASE SCHEMA
-- ============================================================
-- Run this entire file in your Supabase SQL Editor
-- Dashboard → SQL Editor → Paste & Run
--
-- This creates all tables needed for:
--  1. Visitor behavior tracking
--  2. Customer analytics & segmentation
--  3. Newsletter subscriptions
--  4. Marketing email campaigns log
-- ============================================================

-- ─── 1. CUSTOMER BEHAVIOR TRACKING ──────────────────────────
-- Stores all user interactions: page views, product views, cart adds

CREATE TABLE IF NOT EXISTS customer_behavior (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id    TEXT NOT NULL,
  event_type    TEXT NOT NULL CHECK (event_type IN (
                  'product_view', 'add_to_cart', 'purchase',
                  'page_view', 'newsletter_signup'
                )),
  product_id    TEXT,
  product_name  TEXT,
  page_url      TEXT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries by customer and session
CREATE INDEX IF NOT EXISTS idx_behavior_customer ON customer_behavior(customer_id);
CREATE INDEX IF NOT EXISTS idx_behavior_session  ON customer_behavior(session_id);
CREATE INDEX IF NOT EXISTS idx_behavior_event    ON customer_behavior(event_type);
CREATE INDEX IF NOT EXISTS idx_behavior_product  ON customer_behavior(product_id);
CREATE INDEX IF NOT EXISTS idx_behavior_date     ON customer_behavior(created_at DESC);

ALTER TABLE customer_behavior ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated visitors) can insert behavior events
CREATE POLICY "Anyone can insert behavior"
  ON customer_behavior FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read all behavior data
CREATE POLICY "Admins can view all behavior"
  ON customer_behavior FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Users can see their own behavior data
CREATE POLICY "Users can view own behavior"
  ON customer_behavior FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());


-- ─── 2. CUSTOMER ANALYTICS ───────────────────────────────────
-- Aggregated data per customer: segment, last visit, etc.

CREATE TABLE IF NOT EXISTS customer_analytics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_visit      TIMESTAMPTZ,
  segment         TEXT CHECK (segment IN (
                    'new_visitor', 'cart_abandoner', 'one_time_buyer',
                    'repeat_buyer', 'vip', 'newsletter_subscriber'
                  )),
  total_sessions  INTEGER DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE customer_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage customer analytics"
  ON customer_analytics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can upsert own analytics"
  ON customer_analytics FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update own analytics"
  ON customer_analytics FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid());


-- ─── 3. NEWSLETTER SUBSCRIBERS ───────────────────────────────
-- Stores email subscribers (can be non-customers too)

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT UNIQUE NOT NULL,
  name           TEXT,
  subscribed_at  TIMESTAMPTZ DEFAULT NOW(),
  active         BOOLEAN DEFAULT TRUE,
  tags           TEXT[] DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email  ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(active);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can view and manage all subscribers
CREATE POLICY "Admins can manage newsletter subscribers"
  ON newsletter_subscribers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- ─── 4. EMAIL CAMPAIGNS LOG ──────────────────────────────────
-- Tracks which emails were sent to which customers

CREATE TABLE IF NOT EXISTS email_campaigns (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  customer_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  campaign_type  TEXT NOT NULL CHECK (campaign_type IN (
                   'welcome', 'best_sellers', 'welcome_discount',
                   'abandoned_cart_1h', 'abandoned_cart_24h',
                   'thank_you', 'product_care', 'review_request',
                   'newsletter', 'flash_sale', 'custom'
                 )),
  subject        TEXT,
  status         TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  sent_at        TIMESTAMPTZ DEFAULT NOW(),
  metadata       JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_campaigns_email    ON email_campaigns(recipient_email);
CREATE INDEX IF NOT EXISTS idx_campaigns_type     ON email_campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_customer ON email_campaigns(customer_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_date     ON email_campaigns(sent_at DESC);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email campaigns"
  ON email_campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- ─── 5. NOTIFICATIONS LOG ────────────────────────────────────
-- Tracks push notifications sent via OneSignal

CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  notification_type TEXT DEFAULT 'push' CHECK (notification_type IN ('push', 'in_app', 'whatsapp')),
  target_segment  TEXT,  -- 'all', 'vip', 'cart_abandoner', etc.
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  sent_by         UUID REFERENCES auth.users(id),
  onesignal_id    TEXT,  -- OneSignal notification ID for tracking
  metadata        JSONB DEFAULT '{}'
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- ─── 6. USEFUL DATABASE VIEWS ────────────────────────────────

-- View: Dashboard metrics summary
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
  (SELECT COUNT(*)  FROM orders)                                  AS total_orders,
  (SELECT COALESCE(SUM(total), 0) FROM orders)                    AS total_revenue,
  (SELECT COUNT(DISTINCT session_id) FROM customer_behavior)      AS unique_sessions,
  (SELECT COUNT(*) FROM profiles WHERE role = 'user')             AS total_customers,
  (SELECT COUNT(*) FROM newsletter_subscribers WHERE active = true) AS active_subscribers,
  NOW() AS calculated_at;

-- View: Most viewed products (last 30 days)
CREATE OR REPLACE VIEW top_viewed_products AS
SELECT
  product_id,
  product_name,
  COUNT(*) AS view_count
FROM customer_behavior
WHERE event_type = 'product_view'
  AND created_at >= NOW() - INTERVAL '30 days'
  AND product_id IS NOT NULL
GROUP BY product_id, product_name
ORDER BY view_count DESC
LIMIT 10;

-- View: Cart abandoners (have cart add but no purchase in last 48h)
CREATE OR REPLACE VIEW cart_abandoners AS
SELECT DISTINCT
  cb.customer_id,
  p.email,
  p.name,
  MAX(cb.created_at) AS last_cart_activity
FROM customer_behavior cb
JOIN profiles p ON p.id = cb.customer_id
WHERE cb.event_type = 'add_to_cart'
  AND cb.created_at >= NOW() - INTERVAL '48 hours'
  AND cb.customer_id NOT IN (
    SELECT DISTINCT customer_id FROM customer_behavior
    WHERE event_type = 'purchase'
      AND created_at >= NOW() - INTERVAL '48 hours'
  )
GROUP BY cb.customer_id, p.email, p.name;


-- ─── 7. HELPER FUNCTIONS ─────────────────────────────────────

-- Function: Auto-assign customer segment based on order history
CREATE OR REPLACE FUNCTION compute_customer_segment(p_customer_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_orders INT;
  v_spent  NUMERIC;
BEGIN
  SELECT
    COUNT(*),
    COALESCE(SUM(total), 0)
  INTO v_orders, v_spent
  FROM orders
  WHERE user_id = p_customer_id;

  IF v_spent >= 5000 THEN RETURN 'vip';
  ELSIF v_orders >= 2 THEN RETURN 'repeat_buyer';
  ELSIF v_orders = 1 THEN RETURN 'one_time_buyer';
  ELSE RETURN 'new_visitor';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update all customer segments (run periodically)
CREATE OR REPLACE FUNCTION refresh_all_segments()
RETURNS void AS $$
BEGIN
  INSERT INTO customer_analytics (customer_id, segment, updated_at)
  SELECT
    id,
    compute_customer_segment(id),
    NOW()
  FROM profiles
  WHERE role = 'user'
  ON CONFLICT (customer_id) DO UPDATE
    SET segment = EXCLUDED.segment,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─── 8. GRANTS FOR ANON ACCESS ───────────────────────────────

-- Allow anon to insert behavior events (for tracking non-logged-in visitors)
GRANT INSERT ON customer_behavior TO anon;
GRANT INSERT ON newsletter_subscribers TO anon;


-- ============================================================
-- DONE! Your marketing database is ready.
--
-- NEXT STEPS:
-- 1. Add your API keys to .env.local (see .env.marketing.example)
-- 2. Visit /admin/analytics to see your dashboard
-- 3. The newsletter signup widget tracks subscribers automatically
-- ============================================================
