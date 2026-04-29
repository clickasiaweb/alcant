-- Migration to add category ID fields to products table
-- Run this SQL in your Supabase SQL editor

-- Add category ID fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id),
ADD COLUMN IF NOT EXISTS sub_subcategory_id UUID;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_sub_subcategory_id ON products(sub_subcategory_id);

-- Create sub-subcategories table if it doesn't exist
CREATE TABLE IF NOT EXISTS sub_subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subcategory_id, slug)
);

-- Add foreign key constraint for sub_subcategory_id
ALTER TABLE products 
ADD CONSTRAINT fk_products_sub_subcategory_id 
FOREIGN KEY (sub_subcategory_id) REFERENCES sub_subcategories(id);
