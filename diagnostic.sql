-- ============================================
-- DIAGNOSTIC - Check what's actually happening
-- Run each section separately in Supabase SQL Editor
-- ============================================

-- Section 1: Check if orders table exists and has data
SELECT 
    COUNT(*) as total_orders,
    MAX(created_at) as last_order_time
FROM orders;

-- Section 2: View actual orders (if they exist)
SELECT 
    id,
    user_id,
    total,
    status,
    created_at,
    customer_details
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Section 3: Check current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('orders', 'profiles', 'products');

-- Section 4: Check current permissions
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('orders', 'profiles')
AND grantee IN ('authenticated', 'anon', 'postgres');

-- Section 5: Check if authenticated role exists
SELECT rolname FROM pg_roles WHERE rolname IN ('authenticated', 'anon', 'postgres');

-- ============================================
-- Based on results, try ONE of these fixes:
-- ============================================

-- FIX A: If RLS is still enabled, disable it
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- FIX B: If permissions are missing, grant them
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;

-- FIX C: Nuclear option - make tables publicly readable (TESTING ONLY)
-- GRANT SELECT ON orders TO anon;
-- GRANT SELECT ON profiles TO anon;
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
