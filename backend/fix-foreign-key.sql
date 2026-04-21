-- Fix foreign key constraint issue
-- Run this in Supabase SQL Editor

-- Option 1: Remove the foreign key constraint (RECOMMENDED)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Verify constraint is removed
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_name = 'orders' 
    AND tc.constraint_type = 'FOREIGN KEY';

-- This will allow orders with any user_id (including null or system UUID)
