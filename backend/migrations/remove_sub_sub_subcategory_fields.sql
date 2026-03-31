-- Migration: Remove sub-sub-sub-category (Level 4) fields from products table
-- This removes Level 4 category support, keeping only up to Level 3 (sub-subcategories)

-- Remove sub-sub-subcategory column from products table
ALTER TABLE products 
DROP COLUMN IF EXISTS sub_sub_subcategory;

-- Remove index for sub_sub_subcategory if it exists
DROP INDEX IF EXISTS idx_products_sub_sub_subcategory;

-- Update composite index to remove Level 4 reference
DROP INDEX IF EXISTS idx_products_category_hierarchy;
CREATE INDEX IF NOT EXISTS idx_products_category_hierarchy ON products(category, subcategory, sub_subcategory);

-- Add comment to document the change
COMMENT ON COLUMN products.sub_subcategory IS 'Level 3 category name (e.g., "iPhone 15 Pro Cases") - Maximum level supported';

-- Update any existing products that had Level 4 data
-- This is optional - you can keep the data until column is dropped
-- UPDATE products 
-- SET sub_subcategory = COALESCE(sub_subcategory, 'General')
-- WHERE sub_subcategory IS NULL;
