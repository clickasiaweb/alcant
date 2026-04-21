-- Fix RLS policies to allow orders with null user_id
-- Run this in Supabase SQL Editor

-- Drop existing insert policies
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Admins can insert any order" ON orders;

-- Create new policy that allows both user orders and system orders (null user_id)
CREATE POLICY "Users can insert own orders" ON orders
FOR INSERT WITH CHECK (
    (auth.uid()::text = user_id::text) OR 
    (user_id IS NULL AND auth.uid() IS NULL)
);

-- Admin policy remains the same
CREATE POLICY "Admins can insert any order" ON orders
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'orders';
