-- Test script to set some products as featured
-- Run this in Supabase SQL editor to test the featured functionality

-- Update a few existing products to be featured
UPDATE products 
SET featured = true 
WHERE id IN (
  '971c4c8c-d805-4b25-b28e-0f65764b795e',  -- Premium Alcantara Phone Case
  '012be068-7a17-4cb4-be12-eb3db8c47222'   -- iPhone 15 Pro Case - Blue
);

-- Verify the update
SELECT id, name, featured FROM products WHERE featured = true;

-- Reset all products to not featured (if needed)
-- UPDATE products SET featured = false;
