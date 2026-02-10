-- Complete fix for content table - drop and recreate with correct schema
-- This will work regardless of current table state

DROP TABLE IF EXISTS content CASCADE;

CREATE TABLE content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  button_text TEXT,
  button_link TEXT,
  background_image TEXT,
  image_url TEXT,
  video_url TEXT,
  video_file TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  sections JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  banner_image TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_content_page_key ON content(page_key);

-- Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to content" ON content
FOR SELECT USING (is_published = true);

CREATE POLICY "Allow service role full access to content" ON content
FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Insert sample data
INSERT INTO content (
  page_key, title, subtitle, content, button_text, button_link, is_published
) VALUES (
  'home-hero',
  'Welcome to Alcantara',
  'Premium luxury materials for your lifestyle',
  'Experience the finest Alcantara products crafted with precision and care.',
  'Shop Now',
  '/products',
  true
) ON CONFLICT (page_key) DO NOTHING;
