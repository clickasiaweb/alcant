-- iPhone Categories Schema Extension
-- Add sub-subcategories table for iPhone cases hierarchy
-- Run this after the main supabase-schema.sql

-- Sub-subcategories table (third level)
CREATE TABLE sub_subcategories (
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

-- Indexes for sub-subcategories
CREATE INDEX idx_sub_subcategories_slug ON sub_subcategories(slug);
CREATE INDEX idx_sub_subcategories_subcategory_id ON sub_subcategories(subcategory_id);
CREATE INDEX idx_sub_subcategories_is_active ON sub_subcategories(is_active);

-- Trigger for updated_at
CREATE TRIGGER update_sub_subcategories_updated_at BEFORE UPDATE ON sub_subcategories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for sub-subcategories
ALTER TABLE sub_subcategories ENABLE ROW LEVEL SECURITY;

-- Public read access for sub-subcategories
CREATE POLICY "Allow public read access to sub_subcategories" ON sub_subcategories
    FOR SELECT USING (is_active = true);

-- Service role can do everything (for admin operations)
CREATE POLICY "Allow service role full access to sub_subcategories" ON sub_subcategories
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Insert iPhone Cases category hierarchy
-- Main category: iPhone Cases
INSERT INTO categories (name, slug, description, is_active) VALUES
('iPhone Cases', 'iphone-cases', 'Premium protective cases for all iPhone models', true);

-- Get the category ID for iPhone Cases (this will be used in the subcategories insert)
DO $$
DECLARE
  iphone_category_id UUID;
BEGIN
  SELECT id INTO iphone_category_id FROM categories WHERE slug = 'iphone-cases';
  
  -- Insert subcategories for each iPhone model
  INSERT INTO subcategories (name, slug, category_id, description, is_active) VALUES
  ('iPhone 17', 'iphone-17', iphone_category_id, 'Cases for iPhone 17 series', true),
  ('iPhone 16', 'iphone-16', iphone_category_id, 'Cases for iPhone 16 series', true),
  ('iPhone 15', 'iphone-15', iphone_category_id, 'Cases for iPhone 15 series', true),
  ('iPhone 14', 'iphone-14', iphone_category_id, 'Cases for iPhone 14 series', true),
  ('iPhone 13', 'iphone-13', iphone_category_id, 'Cases for iPhone 13 series', true),
  ('iPhone 12', 'iphone-12', iphone_category_id, 'Cases for iPhone 12 series', true);
END $$;

-- Insert sub-subcategories for each iPhone model variant
DO $$
DECLARE
  subcat_record RECORD;
BEGIN
  -- iPhone 17 variants
  SELECT id INTO subcat_record FROM subcategories WHERE slug = 'iphone-17';
  INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active) VALUES
  ('iPhone 17 Pro Max', 'iphone-17-pro-max', subcat_record.id, 'Cases for iPhone 17 Pro Max', true),
  ('iPhone 17 Pro', 'iphone-17-pro', subcat_record.id, 'Cases for iPhone 17 Pro', true),
  ('iPhone 17 Air', 'iphone-17-air', subcat_record.id, 'Cases for iPhone 17 Air', true),
  ('iPhone 17', 'iphone-17-standard', subcat_record.id, 'Cases for iPhone 17', true);

  -- iPhone 16 variants
  SELECT id INTO subcat_record FROM subcategories WHERE slug = 'iphone-16';
  INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active) VALUES
  ('iPhone 16 Pro Max', 'iphone-16-pro-max', subcat_record.id, 'Cases for iPhone 16 Pro Max', true),
  ('iPhone 16 Pro', 'iphone-16-pro', subcat_record.id, 'Cases for iPhone 16 Pro', true),
  ('iPhone 16 Plus', 'iphone-16-plus', subcat_record.id, 'Cases for iPhone 16 Plus', true),
  ('iPhone 16e', 'iphone-16e', subcat_record.id, 'Cases for iPhone 16e', true),
  ('iPhone 16', 'iphone-16-standard', subcat_record.id, 'Cases for iPhone 16', true);

  -- iPhone 15 variants
  SELECT id INTO subcat_record FROM subcategories WHERE slug = 'iphone-15';
  INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active) VALUES
  ('iPhone 15 Pro Max', 'iphone-15-pro-max', subcat_record.id, 'Cases for iPhone 15 Pro Max', true),
  ('iPhone 15 Pro', 'iphone-15-pro', subcat_record.id, 'Cases for iPhone 15 Pro', true),
  ('iPhone 15 Plus', 'iphone-15-plus', subcat_record.id, 'Cases for iPhone 15 Plus', true),
  ('iPhone 15', 'iphone-15-standard', subcat_record.id, 'Cases for iPhone 15', true);

  -- iPhone 14 variants
  SELECT id INTO subcat_record FROM subcategories WHERE slug = 'iphone-14';
  INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active) VALUES
  ('iPhone 14 Pro Max', 'iphone-14-pro-max', subcat_record.id, 'Cases for iPhone 14 Pro Max', true),
  ('iPhone 14 Pro', 'iphone-14-pro', subcat_record.id, 'Cases for iPhone 14 Pro', true),
  ('iPhone 14 Plus', 'iphone-14-plus', subcat_record.id, 'Cases for iPhone 14 Plus', true),
  ('iPhone 14', 'iphone-14-standard', subcat_record.id, 'Cases for iPhone 14', true);

  -- iPhone 13 variants
  SELECT id INTO subcat_record FROM subcategories WHERE slug = 'iphone-13';
  INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active) VALUES
  ('iPhone 13 Pro Max', 'iphone-13-pro-max', subcat_record.id, 'Cases for iPhone 13 Pro Max', true),
  ('iPhone 13 Pro', 'iphone-13-pro', subcat_record.id, 'Cases for iPhone 13 Pro', true),
  ('iPhone 13 Mini', 'iphone-13-mini', subcat_record.id, 'Cases for iPhone 13 Mini', true),
  ('iPhone 13', 'iphone-13-standard', subcat_record.id, 'Cases for iPhone 13', true);

  -- iPhone 12 variants
  SELECT id INTO subcat_record FROM subcategories WHERE slug = 'iphone-12';
  INSERT INTO sub_subcategories (name, slug, subcategory_id, description, is_active) VALUES
  ('iPhone 12 Pro Max', 'iphone-12-pro-max', subcat_record.id, 'Cases for iPhone 12 Pro Max', true),
  ('iPhone 12 Pro', 'iphone-12-pro', subcat_record.id, 'Cases for iPhone 12 Pro', true),
  ('iPhone 12 Mini', 'iphone-12-mini', subcat_record.id, 'Cases for iPhone 12 Mini', true),
  ('iPhone 12', 'iphone-12-standard', subcat_record.id, 'Cases for iPhone 12', true);
END $$;

-- Create a view for easy access to the full hierarchy
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
ORDER BY c.name, s.name, ss.name;

COMMENT ON TABLE sub_subcategories IS 'Third level category hierarchy for specific iPhone models';
COMMENT ON VIEW iphone_categories_hierarchy IS 'Complete hierarchy view for iPhone cases categories';
