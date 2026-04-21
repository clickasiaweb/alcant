-- Fix order_number NULL values
-- Run this in Supabase SQL Editor to fix existing NULL values

-- First, check if there are NULL values
SELECT COUNT(*) as null_count 
FROM orders 
WHERE order_number IS NULL OR order_number = '';

-- If count > 0, update them
UPDATE orders 
SET order_number = COALESCE(order_number, order_id)
WHERE order_number IS NULL OR order_number = '';

-- Verify the fix
SELECT order_id, order_number, created_at 
FROM orders 
WHERE order_number IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 5;
