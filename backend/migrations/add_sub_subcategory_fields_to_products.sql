-- Migration: Add sub-subcategory fields to products table
-- This enables proper filtering by sub-subcategories

-- Add sub-subcategory fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sub_subcategory VARCHAR(255),
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sub_subcategory_id UUID REFERENCES sub_subcategories(id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sub_subcategory ON products(sub_subcategory);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_sub_subcategory_id ON products(sub_subcategory_id);

-- Composite index for hierarchical queries
CREATE INDEX IF NOT EXISTS idx_products_category_hierarchy ON products(category, subcategory, sub_subcategory);

-- Update existing products to set default values based on current data
UPDATE products 
SET 
  sub_subcategory = 'General'
WHERE sub_subcategory IS NULL;

-- Add comment to document the new fields
COMMENT ON COLUMN products.sub_subcategory IS 'Level 3 category name (e.g., "iPhone 15 Pro Cases")';
COMMENT ON COLUMN products.subcategory_id IS 'Foreign key to subcategories table';
COMMENT ON COLUMN products.sub_subcategory_id IS 'Foreign key to sub_subcategories table';
