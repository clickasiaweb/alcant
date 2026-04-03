-- Check if specific products are marked as featured
-- Replace these with actual product IDs/slugs you're trying to feature

-- Check all featured products
SELECT id, name, slug, featured, updated_at 
FROM products 
WHERE featured = true 
ORDER BY updated_at DESC;

-- Check specific product (replace with your product's slug)
SELECT id, name, slug, featured, updated_at 
FROM products 
WHERE slug = 'your-product-slug-here';
