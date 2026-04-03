-- Add missing columns to products table for bulk upload functionality
-- Run this in Supabase SQL editor

-- Add brand column
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(255);

-- Add short_description column  
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Add sale_price column (alias for old_price)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2) CHECK (sale_price >= 0);

-- Add sku column
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(255);

-- Add color column
ALTER TABLE products ADD COLUMN IF NOT EXISTS color VARCHAR(100);

-- Add size column
ALTER TABLE products ADD COLUMN IF NOT EXISTS size VARCHAR(100);

-- Add weight column
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2) CHECK (weight >= 0);

-- Add sub_sub_category column
ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_sub_category VARCHAR(255);

-- Add individual image columns for bulk upload
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_1 VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_2 VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_3 VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_4 VARCHAR(500);

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Update existing products to have default values if they were NULL
UPDATE products 
SET 
    brand = 'Alcantara',
    short_description = COALESCE(short_description, LEFT(description, 100)),
    sale_price = COALESCE(sale_price, old_price),
    sku = COALESCE(sku, 'ALC-' || UPPER(SUBSTRING(slug, 1, 10)) || '-' || id::text),
    color = COALESCE(color, 'Standard'),
    size = COALESCE(size, 'One Size'),
    weight = COALESCE(weight, 100)
WHERE brand IS NULL OR short_description IS NULL OR sale_price IS NULL OR sku IS NULL OR color IS NULL OR size IS NULL OR weight IS NULL;

-- Copy existing image to image_1 if it's NULL
UPDATE products SET image_1 = image WHERE image_1 IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN products.brand IS 'Product brand/manufacturer';
COMMENT ON COLUMN products.short_description IS 'Short product description for listings';
COMMENT ON COLUMN products.sale_price IS 'Sale price (discounted price)';
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique product identifier';
COMMENT ON COLUMN products.color IS 'Product color';
COMMENT ON COLUMN products.size IS 'Product size';
COMMENT ON COLUMN products.weight IS 'Product weight in grams';
COMMENT ON COLUMN products.sub_sub_category IS 'Sub-subcategory for 3-level categorization';
COMMENT ON COLUMN products.image_1 IS 'Primary product image';
COMMENT ON COLUMN products.image_2 IS 'Secondary product image';
COMMENT ON COLUMN products.image_3 IS 'Tertiary product image';
COMMENT ON COLUMN products.image_4 IS 'Quaternary product image';
