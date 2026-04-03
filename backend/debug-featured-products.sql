-- Direct test to check if admin panel changes are reflected
-- Run this in Supabase SQL editor to see if your featured products are actually saved

-- Check if your specific product is marked as featured
SELECT id, name, slug, featured, updated_at 
FROM products 
WHERE slug = 'your-product-slug-here'  -- Replace with your actual product slug
ORDER BY updated_at DESC;

-- Check all featured products
SELECT id, name, slug, featured, updated_at 
FROM products 
WHERE featured = true 
ORDER BY updated_at DESC;

-- Check if the featured field exists in the database
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'featured';
