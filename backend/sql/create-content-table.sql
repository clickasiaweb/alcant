-- Create content table for CMS functionality
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_key VARCHAR(255) NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  button_text VARCHAR(255),
  button_link VARCHAR(500),
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_page_key ON content(page_key);
CREATE INDEX IF NOT EXISTS idx_content_is_published ON content(is_published);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at);

-- Create trigger for updated_at
CREATE TRIGGER IF NOT EXISTS update_content_updated_at 
BEFORE UPDATE ON content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Allow public read access to content" ON content
FOR SELECT USING (is_published = true);

CREATE POLICY IF NOT EXISTS "Allow service role full access to content" ON content
FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Insert sample content for home page
INSERT INTO content (
  page_key, title, subtitle, content, button_text, button_link, 
  is_published
) VALUES (
  'home-hero',
  'Welcome to Alcantara',
  'Premium luxury materials for your lifestyle',
  'Experience the finest Alcantara products crafted with precision and care.',
  'Shop Now',
  '/products',
  true
) ON CONFLICT (page_key) DO NOTHING;
