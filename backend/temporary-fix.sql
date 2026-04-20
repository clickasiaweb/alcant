-- Temporary fix: Make order_number nullable to allow orders while we debug
-- Run this in Supabase SQL Editor

-- Drop the NOT NULL constraint temporarily
ALTER TABLE orders ALTER COLUMN order_number DROP NOT NULL;

-- This will allow NULL values in order_number temporarily
-- After we fix the backend deployment, we can make it NOT NULL again

-- Verify the change
\d orders
