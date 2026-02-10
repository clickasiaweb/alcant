-- STEP 1: Create the sub-subcategories table
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

-- Create trigger for updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_sub_subcategories_updated_at ON sub_subcategories;
CREATE TRIGGER update_sub_subcategories_updated_at 
BEFORE UPDATE ON sub_subcategories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (check if already enabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'sub_subcategories' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE sub_subcategories ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies (drop if exists first)
DROP POLICY IF EXISTS "Allow public read access to sub_subcategories" ON sub_subcategories;
CREATE POLICY "Allow public read access to sub_subcategories" ON sub_subcategories
FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow service role full access to sub_subcategories" ON sub_subcategories;
CREATE POLICY "Allow service role full access to sub_subcategories" ON sub_subcategories
FOR ALL USING (auth.jwt()->>'role' = 'service_role');
