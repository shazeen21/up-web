-- ==================================================
-- FIX ADMIN ACCESS AND ORDERS VIEW
-- Run this in Supabase SQL Editor
-- ==================================================

-- The issue is that the existing RLS policy on profiles table only allows
-- reading when auth.uid() = id, but this check happens AFTER trying to read.
-- We need to allow authenticated users to read their own profile without restrictions.

-- Step 1: Drop the existing restrictive policy (if it exists)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Step 2: Create a policy that allows users to SELECT their own profile
-- This will allow the admin check to work properly
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Step 3: Ensure orders table exists with proper structure
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  customer_details JSONB,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'placed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing order policies if they exist
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Step 6: Recreate orders policies
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Step 7: IMPORTANT - Set your current user as admin
-- First, find your user ID by running this query:
-- SELECT id, email FROM auth.users WHERE email = 'shazzzzooop@gmail.com';
-- 
-- Then update the profile:
-- INSERT INTO profiles (id, email, role)
-- VALUES ('YOUR-USER-ID-HERE', 'shazzzzooop@gmail.com', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Uncomment and run this after getting your user ID:
-- UPDATE profiles SET role = 'admin' WHERE email = 'shazzzzooop@gmail.com';
