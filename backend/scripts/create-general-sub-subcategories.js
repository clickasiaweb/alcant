// General sub-subcategories database setup
// Copy the SQL output and run it in your Supabase SQL Editor

console.log('🗂️ General Sub-Subcategories Database Setup');
console.log('============================================\n');

console.log('📋 STEP 1: Create the sub-subcategories table');
console.log('==============================================');
console.log(`-- Create general sub-subcategories table
CREATE TABLE IF NOT EXISTS sub_subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  description TEXT,
  image VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subcategory_id, slug)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sub_subcategories_slug ON sub_subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_sub_subcategories_subcategory_id ON sub_subcategories(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_sub_subcategories_is_active ON sub_subcategories(is_active);
CREATE INDEX IF NOT EXISTS idx_sub_subcategories_sort_order ON sub_subcategories(sort_order);

-- Create trigger for updated_at
CREATE TRIGGER IF NOT EXISTS update_sub_subcategories_updated_at 
BEFORE UPDATE ON sub_subcategories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE sub_subcategories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Allow public read access to sub_subcategories" ON sub_subcategories
FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "Allow service role full access to sub_subcategories" ON sub_subcategories
FOR ALL USING (auth.jwt()->>'role' = 'service_role');`);

console.log('\n📋 STEP 2: Create general hierarchy view');
console.log('==========================================');
console.log(`-- Create view for complete category hierarchy
CREATE OR REPLACE VIEW full_categories_hierarchy AS
SELECT 
  c.name as category_name,
  c.slug as category_slug,
  c.description as category_description,
  c.image as category_image,
  s.name as subcategory_name,
  s.slug as subcategory_slug,
  s.description as subcategory_description,
  s.image as subcategory_image,
  ss.name as sub_subcategory_name,
  ss.slug as sub_subcategory_slug,
  ss.description as sub_subcategory_description,
  ss.image as sub_subcategory_image,
  ss.sort_order as sub_subcategory_sort_order,
  ss.id as sub_subcategory_id,
  s.id as subcategory_id,
  c.id as category_id
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id AND s.is_active = true
LEFT JOIN sub_subcategories ss ON s.id = ss.subcategory_id AND ss.is_active = true
WHERE c.is_active = true
ORDER BY c.name, s.sort_order, s.name, ss.sort_order, ss.name;

-- Create view for categories with their subcategories
CREATE OR REPLACE VIEW categories_with_subcategories AS
SELECT 
  c.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', s.id,
        'name', s.name,
        'slug', s.slug,
        'description', s.description,
        'image', s.image,
        'sort_order', s.sort_order,
        'is_active', s.is_active,
        'sub_subcategories', (
          SELECT json_agg(
            json_build_object(
              'id', ss.id,
              'name', ss.name,
              'slug', ss.slug,
              'description', ss.description,
              'image', ss.image,
              'sort_order', ss.sort_order,
              'is_active', ss.is_active
            ) ORDER BY ss.sort_order, ss.name
          )
          FROM sub_subcategories ss
          WHERE ss.subcategory_id = s.id AND ss.is_active = true
        )
      ) ORDER BY s.sort_order, s.name
    ), '[]'::json
  ) as subcategories
FROM categories c
WHERE c.is_active = true
GROUP BY c.id, c.name, c.slug, c.description, c.image, c.is_active, c.created_at, c.updated_at
ORDER BY c.name;`);

console.log('\n📋 STEP 3: Create helper functions');
console.log('==================================');
console.log(`-- Function to get category path
CREATE OR REPLACE FUNCTION get_category_path(category_slug TEXT)
RETURNS TABLE (
  level INTEGER,
  name VARCHAR(255),
  slug VARCHAR(255),
  id UUID,
  parent_id UUID
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE category_tree AS (
    -- Base case: get the main category
    SELECT 
      1 as level,
      c.name,
      c.slug,
      c.id,
      NULL::UUID as parent_id
    FROM categories c
    WHERE c.slug = category_slug AND c.is_active = true
    
    UNION ALL
    
    -- Get subcategories
    SELECT 
      2 as level,
      s.name,
      s.slug,
      s.id,
      c.id as parent_id
    FROM categories c
    JOIN subcategories s ON c.id = s.category_id
    WHERE c.slug = category_slug AND c.is_active = true AND s.is_active = true
    
    UNION ALL
    
    -- Get sub-subcategories
    SELECT 
      3 as level,
      ss.name,
      ss.slug,
      ss.id,
      s.id as parent_id
    FROM categories c
    JOIN subcategories s ON c.id = s.category_id
    JOIN sub_subcategories ss ON s.id = ss.subcategory_id
    WHERE c.slug = category_slug AND c.is_active = true AND s.is_active = true AND ss.is_active = true
  )
  SELECT * FROM category_tree ORDER BY level, name;
END;
$$ LANGUAGE plpgsql;

-- Function to count items in each level
CREATE OR REPLACE FUNCTION count_category_levels()
RETURNS TABLE (
  category_name VARCHAR(255),
  category_slug VARCHAR(255),
  subcategory_count INTEGER,
  sub_subcategory_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.name,
    c.slug,
    COUNT(DISTINCT s.id) as subcategory_count,
    COUNT(DISTINCT ss.id) as sub_subcategory_count
  FROM categories c
  LEFT JOIN subcategories s ON c.id = s.category_id AND s.is_active = true
  LEFT JOIN sub_subcategories ss ON s.id = ss.subcategory_id AND ss.is_active = true
  WHERE c.is_active = true
  GROUP BY c.id, c.name, c.slug
  ORDER BY c.name;
END;
$$ LANGUAGE plpgsql;`);

console.log('\n📋 STEP 4: Sample data insertion (optional)');
console.log('==========================================');
console.log(`-- Example: Insert sample data for Electronics category
-- First, let's see if we have an Electronics category
-- You can modify this section for your specific needs

-- Insert sample Electronics category (if not exists)
INSERT INTO categories (name, slug, description, is_active) 
VALUES ('Electronics', 'electronics', 'Electronic devices and accessories', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample subcategories for Electronics
INSERT INTO subcategories (name, slug, category_id, description, sort_order, is_active)
SELECT 
  subcat.name,
  subcat.slug,
  cat.id,
  subcat.description,
  subcat.sort_order,
  true
FROM categories cat
CROSS JOIN (VALUES 
  ('Phones', 'phones', 'Smartphones and mobile phones', 1),
  ('Laptops', 'laptops', 'Laptop computers and notebooks', 2),
  ('Tablets', 'tablets', 'Tablet computers and e-readers', 3),
  ('Accessories', 'accessories', 'Electronic accessories and peripherals', 4)
) AS subcat(name, slug, description, sort_order)
WHERE cat.slug = 'electronics'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert sample sub-subcategories for Phones
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, sort_order, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  variant.sort_order,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('Smartphones', 'smartphones', 'Modern smartphones with advanced features', 1),
  ('Feature Phones', 'feature-phones', 'Basic mobile phones with essential features', 2),
  ('Phone Cases', 'phone-cases', 'Protective cases and covers', 3),
  ('Phone Accessories', 'phone-accessories', 'Chargers, cables, and other accessories', 4)
) AS variant(name, slug, description, sort_order)
WHERE sub.slug = 'phones'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Insert sample sub-subcategories for Laptops
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, sort_order, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  variant.sort_order,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('Gaming Laptops', 'gaming-laptops', 'High-performance laptops for gaming', 1),
  ('Business Laptops', 'business-laptops', 'Professional laptops for work', 2),
  ('Ultrabooks', 'ultrabooks', 'Thin and lightweight laptops', 3),
  ('Laptop Accessories', 'laptop-accessories', 'Bags, mice, and laptop accessories', 4)
) AS variant(name, slug, description, sort_order)
WHERE sub.slug = 'laptops'
ON CONFLICT (subcategory_id, slug) DO NOTHING;`);

console.log('\n✅ INSTRUCTIONS:');
console.log('================');
console.log('1. Copy each STEP section into your Supabase SQL Editor');
console.log('2. Run each step one by one');
console.log('3. STEP 1 creates the table structure');
console.log('4. STEP 2 creates helpful views');
console.log('5. STEP 3 creates utility functions');
console.log('6. STEP 4 adds sample data (optional)');
console.log('\n🎯 This creates a flexible 3-level category system for ANY products!');
console.log('📊 Use the views to easily query your complete category hierarchy');
