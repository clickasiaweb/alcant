-- Temporarily disable RLS for orders table to fix order creation
-- Run this in Supabase SQL Editor

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'orders';

-- Note: Re-enable RLS later with proper policies
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
