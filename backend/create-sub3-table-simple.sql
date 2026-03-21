-- Create sub3_categories table (Level 4 categories)
CREATE TABLE IF NOT EXISTS sub3_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  sub_subcategory_id UUID REFERENCES sub_subcategories(id) ON DELETE CASCADE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sub3_categories_slug ON sub3_categories(slug);
CREATE INDEX IF NOT EXISTS idx_sub3_categories_sub_subcategory_id ON sub3_categories(sub_subcategory_id);
CREATE INDEX IF NOT EXISTS idx_sub3_categories_is_active ON sub3_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_sub3_categories_sort_order ON sub3_categories(sort_order);

-- Enable Row Level Security
ALTER TABLE sub3_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow read access to all active sub3 categories
CREATE POLICY "Allow read access to active sub3 categories" ON sub3_categories
  FOR SELECT USING (is_active = true);

-- Allow full access to service role (for admin operations)
CREATE POLICY "Allow full access to service role" ON sub3_categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sub3_categories_updated_at 
  BEFORE UPDATE ON sub3_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing using actual sub-subcategory IDs
INSERT INTO sub3_categories (name, slug, sub_subcategory_id, description, sort_order) VALUES
('iPhone 15 Pro Max Premium', 'iphone-15-pro-max-premium', 
 'fcaf6758-aa36-46d9-9fa5-58fa16119fd4',
 'Premium cases for iPhone 15 Pro Max', 1),
('iPhone 15 Pro Standard', 'iphone-15-pro-standard', 
 'fcaf6758-aa36-46d9-9fa5-58fa16119fd4',
 'Standard cases for iPhone 15 Pro', 2),
('iPhone 15 Pro Ultra', 'iphone-15-pro-ultra', 
 '13b11eda-ea20-45bf-8c8c-b6edebda1227',
 'Ultra cases for iPhone 15 Pro', 1),
('iPhone 15 Pro Lite', 'iphone-15-pro-lite', 
 '1b7e3620-1c05-4aee-a9f0-7b3e4a3bd4c7',
 'Lite cases for iPhone 15 Pro', 1);
