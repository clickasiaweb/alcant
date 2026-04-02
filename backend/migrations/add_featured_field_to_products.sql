-- Add featured field to products table
-- This migration adds a boolean field to mark products as featured

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Add index for better performance on featured products queries
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = TRUE;

-- Add comment to describe the field
COMMENT ON COLUMN products.featured IS 'Whether the product should be displayed as a featured product on the homepage';

-- Update existing products to have featured = FALSE by default (already handled by DEFAULT)
-- This ensures all existing products are not featured by default
