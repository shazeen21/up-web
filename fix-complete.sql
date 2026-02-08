-- ============================================
-- COMPREHENSIVE FIX FOR ORDERS TABLE ACCESS
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- Step 1: Grant schema-level permissions
-- This fixes the "permission denied for schema public" error
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Step 2: Disable RLS on orders table (simplest fix)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Step 3: Also disable RLS on profiles table (so admin check can work)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Verify the tables exist
-- (This will error if tables don't exist, which tells us the problem)
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM profiles;

-- ============================================
-- VERIFICATION QUERIES
-- Run these to check if the fix worked:
-- ============================================

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('orders', 'profiles');

-- View all orders (should return data if any exists)
SELECT * FROM orders ORDER BY created_at DESC;

-- ============================================
-- IF NOTHING WORKS, RUN THIS NUCLEAR OPTION:
-- ============================================
-- This completely opens up the database (ONLY for testing)
-- Uncomment the lines below if the above doesn't work:

-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
