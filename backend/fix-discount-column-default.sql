-- Fix discount column by removing default value constraint
-- This will allow the discount value from the request to be stored properly

-- First, check current column definition
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'discount';

-- Remove default value constraint if it exists
ALTER TABLE orders ALTER COLUMN discount DROP DEFAULT;

-- Set a proper default that won't override insert values
ALTER TABLE orders ALTER COLUMN discount SET DEFAULT 0.00;

-- Make sure the column is nullable
ALTER TABLE orders ALTER COLUMN discount DROP NOT NULL;

-- Verify the fix
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'discount';
