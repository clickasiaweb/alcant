-- ========================================
-- FIX NULL CONSTRAINTS ISSUES
-- Run this after the main migration if you get NULL constraint errors
-- ========================================

-- Fix any NULL final_price values by setting them to the regular price
UPDATE products SET final_price = COALESCE(final_price, price) WHERE final_price IS NULL;

-- Fix any NULL images values by creating an array from individual image columns
UPDATE products SET images = COALESCE(
    images, 
    ARRAY[COALESCE(image_1, image), COALESCE(image_2, ''), COALESCE(image_3, ''), COALESCE(image_4, '')]
) WHERE images IS NULL;

-- Verify the fixes
SELECT 
    COUNT(*) FILTER (WHERE final_price IS NULL) as null_final_price_count,
    COUNT(*) FILTER (WHERE images IS NULL) as null_images_count
FROM products;

-- Show sample of fixed products
SELECT id, name, price, final_price, sale_price, 
       CASE WHEN images IS NULL THEN 'NULL' ELSE 'HAS DATA' END as images_status
FROM products 
WHERE final_price = price OR images IS NOT NULL
LIMIT 5;
