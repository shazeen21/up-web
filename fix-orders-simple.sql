-- SIMPLE FIX FOR ORDERS TABLE RLS
-- Run this in Supabase SQL Editor

-- Option 1: Temporarily disable RLS (QUICKEST FIX)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, run these instead:
-- DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
-- DROP POLICY IF EXISTS "Users can view own orders" ON orders;
-- DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
-- DROP POLICY IF EXISTS "Admins can update orders" ON orders;
-- 
-- CREATE POLICY "Allow all authenticated users to do everything on orders"
-- ON orders FOR ALL
-- TO authenticated
-- USING (true)
-- WITH CHECK (true);
