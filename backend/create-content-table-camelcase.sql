-- Create content table for CMS with camelCase column names
-- Drop existing table first
DROP TABLE IF EXISTS content CASCADE;

-- Create new table with camelCase schema
CREATE TABLE content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pageKey TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  buttonText TEXT,
  buttonLink TEXT,
  backgroundImage TEXT,
  imageUrl TEXT,
  videoUrl TEXT,
  videoFile TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  sections JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  bannerImage TEXT,
  isPublished BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_content_pageKey ON content(pageKey);
CREATE INDEX idx_content_isPublished ON content(isPublished);

-- Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to content" ON content
FOR SELECT USING (isPublished = true);

CREATE POLICY "Allow service role full access to content" ON content
FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Insert sample content for home page
INSERT INTO content (
  pageKey, title, subtitle, content, buttonText, buttonLink, 
  isPublished
) VALUES (
  'home-hero',
  'Welcome to Alcantara',
  'Premium luxury materials for your lifestyle',
  'Experience the finest Alcantara products crafted with precision and care.',
  'Shop Now',
  '/products',
  true
) ON CONFLICT (pageKey) DO NOTHING;
