-- Test script to mark a specific product as featured
-- Run this in Supabase SQL editor to test featured functionality

-- Mark Alcantara Phone Case as featured (this should show up in featured products)
UPDATE products 
SET featured = true, updated_at = NOW()
WHERE id = '971c4c8c-d805-4b25-b28e-0f65764b795e';

-- Mark iPhone 15 Pro Case as featured  
UPDATE products 
SET featured = true, updated_at = NOW()
WHERE id = '012be068-7a17-4cb4-be12-eb3db8c47222';

-- Verify the update
SELECT id, name, featured, updated_at FROM products WHERE featured = true ORDER BY updated_at DESC;
