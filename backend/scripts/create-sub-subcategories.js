// Simple script to create sub-subcategories table and data
// Copy the SQL output and run it in your Supabase SQL Editor

console.log('📱 Sub-Subcategories Database Setup');
console.log('====================================\n');

console.log('📋 STEP 1: Create the table');
console.log('============================');
console.log(`-- Create sub-subcategories table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sub_subcategories_slug ON sub_subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_sub_subcategories_subcategory_id ON sub_subcategories(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_sub_subcategories_is_active ON sub_subcategories(is_active);

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

console.log('\n📋 STEP 2: Insert iPhone Cases category (if not exists)');
console.log('=======================================================');
console.log(`-- Insert iPhone Cases main category
INSERT INTO categories (name, slug, description, is_active) 
VALUES ('iPhone Cases', 'iphone-cases', 'Premium protective cases for all iPhone models', true)
ON CONFLICT (slug) DO NOTHING;`);

console.log('\n📋 STEP 3: Insert iPhone subcategories');
console.log('====================================');
console.log(`-- Insert iPhone subcategories
INSERT INTO subcategories (name, slug, category_id, description, is_active)
SELECT 
  subcat.name,
  subcat.slug,
  cat.id,
  subcat.description,
  true
FROM categories cat
CROSS JOIN (VALUES 
  ('iPhone 17', 'iphone-17', 'Cases for iPhone 17 series'),
  ('iPhone 16', 'iphone-16', 'Cases for iPhone 16 series'),
  ('iPhone 15', 'iphone-15', 'Cases for iPhone 15 series'),
  ('iPhone 14', 'iphone-14', 'Cases for iPhone 14 series'),
  ('iPhone 13', 'iphone-13', 'Cases for iPhone 13 series'),
  ('iPhone 12', 'iphone-12', 'Cases for iPhone 12 series')
) AS subcat(name, slug, description)
WHERE cat.slug = 'iphone-cases'
ON CONFLICT (category_id, slug) DO NOTHING;`);

console.log('\n📋 STEP 4: Insert iPhone sub-subcategories');
console.log('========================================');
console.log(`-- Insert iPhone 17 variants
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('iPhone 17 Pro Max', 'iphone-17-pro-max', 'Cases for iPhone 17 Pro Max'),
  ('iPhone 17 Pro', 'iphone-17-pro', 'Cases for iPhone 17 Pro'),
  ('iPhone 17 Air', 'iphone-17-air', 'Cases for iPhone 17 Air'),
  ('iPhone 17', 'iphone-17-standard', 'Cases for iPhone 17')
) AS variant(name, slug, description)
WHERE sub.slug = 'iphone-17'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Insert iPhone 16 variants
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('iPhone 16 Pro Max', 'iphone-16-pro-max', 'Cases for iPhone 16 Pro Max'),
  ('iPhone 16 Pro', 'iphone-16-pro', 'Cases for iPhone 16 Pro'),
  ('iPhone 16 Plus', 'iphone-16-plus', 'Cases for iPhone 16 Plus'),
  ('iPhone 16e', 'iphone-16e', 'Cases for iPhone 16e'),
  ('iPhone 16', 'iphone-16-standard', 'Cases for iPhone 16')
) AS variant(name, slug, description)
WHERE sub.slug = 'iphone-16'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Insert iPhone 15 variants
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Cases for iPhone 15 Pro Max'),
  ('iPhone 15 Pro', 'iphone-15-pro', 'Cases for iPhone 15 Pro'),
  ('iPhone 15 Plus', 'iphone-15-plus', 'Cases for iPhone 15 Plus'),
  ('iPhone 15', 'iphone-15-standard', 'Cases for iPhone 15')
) AS variant(name, slug, description)
WHERE sub.slug = 'iphone-15'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Insert iPhone 14 variants
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('iPhone 14 Pro Max', 'iphone-14-pro-max', 'Cases for iPhone 14 Pro Max'),
  ('iPhone 14 Pro', 'iphone-14-pro', 'Cases for iPhone 14 Pro'),
  ('iPhone 14 Plus', 'iphone-14-plus', 'Cases for iPhone 14 Plus'),
  ('iPhone 14', 'iphone-14-standard', 'Cases for iPhone 14')
) AS variant(name, slug, description)
WHERE sub.slug = 'iphone-14'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Insert iPhone 13 variants
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('iPhone 13 Pro Max', 'iphone-13-pro-max', 'Cases for iPhone 13 Pro Max'),
  ('iPhone 13 Pro', 'iphone-13-pro', 'Cases for iPhone 13 Pro'),
  ('iPhone 13 Mini', 'iphone-13-mini', 'Cases for iPhone 13 Mini'),
  ('iPhone 13', 'iphone-13-standard', 'Cases for iPhone 13')
) AS variant(name, slug, description)
WHERE sub.slug = 'iphone-13'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Insert iPhone 12 variants
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('iPhone 12 Pro Max', 'iphone-12-pro-max', 'Cases for iPhone 12 Pro Max'),
  ('iPhone 12 Pro', 'iphone-12-pro', 'Cases for iPhone 12 Pro'),
  ('iPhone 12 Mini', 'iphone-12-mini', 'Cases for iPhone 12 Mini'),
  ('iPhone 12', 'iphone-12-standard', 'Cases for iPhone 12')
) AS variant(name, slug, description)
WHERE sub.slug = 'iphone-12'
ON CONFLICT (subcategory_id, slug) DO NOTHING;`);

console.log('\n📋 STEP 5: Create hierarchy view');
console.log('===============================');
console.log(`-- Create view for easy hierarchy access
CREATE OR REPLACE VIEW iphone_categories_hierarchy AS
SELECT 
  c.name as category_name,
  c.slug as category_slug,
  s.name as subcategory_name,
  s.slug as subcategory_slug,
  ss.name as sub_subcategory_name,
  ss.slug as sub_subcategory_slug,
  ss.id as sub_subcategory_id,
  s.id as subcategory_id,
  c.id as category_id
FROM categories c
JOIN subcategories s ON c.id = s.category_id
JOIN sub_subcategories ss ON s.id = ss.subcategory_id
WHERE c.slug = 'iphone-cases' AND c.is_active = true AND s.is_active = true AND ss.is_active = true
ORDER BY c.name, s.name, ss.name;`);

console.log('\n✅ INSTRUCTIONS:');
console.log('================');
console.log('1. Copy each section of SQL code above');
console.log('2. Paste it into your Supabase SQL Editor');
console.log('3. Run each section one by one (Step 1, then Step 2, etc.)');
console.log('4. Check the Table Editor to verify the data was created');
console.log('\n🎯 Result: 1 category, 6 subcategories, 24 sub-subcategories');
