-- Create subcategories table for 3-level category hierarchy
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  image VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_is_active ON subcategories(is_active);
CREATE INDEX IF NOT EXISTS idx_subcategories_sort_order ON subcategories(sort_order);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_subcategories_updated_at ON subcategories;
CREATE TRIGGER update_subcategories_updated_at 
BEFORE UPDATE ON subcategories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Create policies (drop if exists first)
DROP POLICY IF EXISTS "Allow public read access to subcategories" ON subcategories;
CREATE POLICY "Allow public read access to subcategories" ON subcategories
FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow service role full access to subcategories" ON subcategories;
CREATE POLICY "Allow service role full access to subcategories" ON subcategories
FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Insert sample subcategories for existing categories
-- First, get the category IDs and then insert subcategories
DO $$
DECLARE
  accessories_id UUID;
  car_travel_id UUID;
  phone_cases_id UUID;
  wallets_cards_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO accessories_id FROM categories WHERE slug = 'accessories' LIMIT 1;
  SELECT id INTO car_travel_id FROM categories WHERE slug = 'car-travel' LIMIT 1;
  SELECT id INTO phone_cases_id FROM categories WHERE slug = 'phone-cases' LIMIT 1;
  SELECT id INTO wallets_cards_id FROM categories WHERE slug = 'wallets-cards' LIMIT 1;
  
  -- Insert Accessories subcategories
  IF accessories_id IS NOT NULL THEN
    INSERT INTO subcategories (name, slug, category_id, description, sort_order, is_active) VALUES
      ('Watch Bands', 'watch-bands', accessories_id, 'Premium watch bands for all smartwatches', 1, true),
      ('Keychains', 'keychains', accessories_id, 'Elegant keychains and accessories', 2, true),
      ('Tech Accessories', 'tech-accessories', accessories_id, 'Technology accessories and gadgets', 3, true)
    ON CONFLICT (category_id, slug) DO NOTHING;
  END IF;
  
  -- Insert Car & Travel subcategories
  IF car_travel_id IS NOT NULL THEN
    INSERT INTO subcategories (name, slug, category_id, description, sort_order, is_active) VALUES
      ('Car Accessories', 'car-accessories', car_travel_id, 'Premium car interior accessories', 1, true),
      ('Travel Essentials', 'travel-essentials', car_travel_id, 'Essential travel accessories', 2, true),
      ('Luxury Travel', 'luxury-travel', car_travel_id, 'Luxury travel accessories', 3, true)
    ON CONFLICT (category_id, slug) DO NOTHING;
  END IF;
  
  -- Insert Phone Cases subcategories
  IF phone_cases_id IS NOT NULL THEN
    INSERT INTO subcategories (name, slug, category_id, description, sort_order, is_active) VALUES
      ('iPhone Cases', 'iphone-cases', phone_cases_id, 'Premium iPhone cases and covers', 1, true),
      ('Samsung Cases', 'samsung-cases', phone_cases_id, 'Samsung phone cases and covers', 2, true),
      ('Google Pixel Cases', 'google-pixel-cases', phone_cases_id, 'Google Pixel phone cases', 3, true)
    ON CONFLICT (category_id, slug) DO NOTHING;
  END IF;
  
  -- Insert Wallets & Cards subcategories
  IF wallets_cards_id IS NOT NULL THEN
    INSERT INTO subcategories (name, slug, category_id, description, sort_order, is_active) VALUES
      ('Card Holders', 'card-holders', wallets_cards_id, 'Minimalist card holders', 1, true),
      ('Full Wallets', 'full-wallets', wallets_cards_id, 'Premium leather wallets', 2, true),
      ('Mini Wallets', 'mini-wallets', wallets_cards_id, 'Compact mini wallets', 3, true)
    ON CONFLICT (category_id, slug) DO NOTHING;
  END IF;
END $$;
