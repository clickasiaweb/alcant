-- Final comprehensive fix for orders table
-- Run this in Supabase SQL Editor

-- Make user_id nullable (since backend doesn't send it)
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Also ensure order_number is nullable (for safety)
ALTER TABLE orders ALTER COLUMN order_number DROP NOT NULL;

-- Verify changes
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('user_id', 'order_number');
