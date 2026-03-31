-- ========================================
-- BULK UPLOAD COLUMNS MIGRATION
-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/your-project-id/sql
-- ========================================

-- 1. Add brand column
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(255);

-- 2. Add short_description column  
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description TEXT;

-- 3. Add sale_price column (for discounted prices)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2) CHECK (sale_price >= 0);

-- 4. Add sku column (Stock Keeping Unit)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(255);

-- 5. Add color column
ALTER TABLE products ADD COLUMN IF NOT EXISTS color VARCHAR(100);

-- 6. Add size column
ALTER TABLE products ADD COLUMN IF NOT EXISTS size VARCHAR(100);

-- 7. Add weight column (in grams)
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2) CHECK (weight >= 0);

-- 8. Add sub_sub_category column (for 3-level categories)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_sub_category VARCHAR(255);

-- 9. Add individual image columns for bulk upload compatibility
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_1 VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_2 VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_3 VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_4 VARCHAR(500);

-- 10. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- 11. Update existing products with default values (optional)
UPDATE products 
SET 
    brand = COALESCE(brand, 'Alcantara'),
    short_description = COALESCE(short_description, LEFT(description, 100)),
    sale_price = COALESCE(sale_price, old_price),
    sku = COALESCE(sku, 'ALC-' || UPPER(SUBSTRING(slug, 1, 10)) || '-' || SUBSTRING(id::text, 1, 8)),
    color = COALESCE(color, 'Standard'),
    size = COALESCE(size, 'One Size'),
    weight = COALESCE(weight, 100)
WHERE brand IS NULL OR short_description IS NULL OR sale_price IS NULL OR sku IS NULL OR color IS NULL OR size IS NULL OR weight IS NULL;

-- 12. Copy existing image to image_1 if it's NULL
UPDATE products SET image_1 = COALESCE(image_1, image) WHERE image_1 IS NULL;

-- 13. Update final_price for existing products that might have NULL values
UPDATE products SET final_price = COALESCE(final_price, price) WHERE final_price IS NULL;

-- 14. Update images array for existing products that might have NULL images
UPDATE products SET images = COALESCE(
    images, 
    ARRAY[COALESCE(image_1, image), COALESCE(image_2, ''), COALESCE(image_3, ''), COALESCE(image_4, '')]
) WHERE images IS NULL;

-- ========================================
-- VERIFICATION QUERIES (run these to verify)
-- ========================================

-- Check if all columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('brand', 'short_description', 'sale_price', 'sku', 'color', 'size', 'weight', 'sub_sub_category', 'image_1', 'image_2', 'image_3', 'image_4')
ORDER BY column_name;

-- Test insert with new columns
INSERT INTO products (
    name, slug, description, short_description, brand, category, subcategory, sub_sub_category,
    price, final_price, sale_price, stock, sku, color, size, weight, 
    image, images, image_1, image_2, image_3, image_4,
    rating, reviews, is_active
) VALUES (
    'Test Product',
    'test-product',
    'Test description for bulk upload verification',
    'Short test description',
    'Test Brand',
    'Test Category',
    'Test Subcategory',
    'Test Sub-Subcategory',
    99.99,
    99.99,  -- Set final_price to match price
    79.99,
    10,
    'TEST-001',
    'Red',
    'Medium',
    200,
    'https://example.com/image.jpg',
    ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg', 'https://example.com/image4.jpg'],  -- Set images array
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg',
    0,
    0,
    true
);

-- Verify test insert
SELECT * FROM products WHERE slug = 'test-product';

-- Clean up test data (optional)
-- DELETE FROM products WHERE slug = 'test-product';
