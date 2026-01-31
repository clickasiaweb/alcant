-- Create content table for CMS
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pageKey TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  buttonText TEXT,
  buttonLink TEXT,
  backgroundImage TEXT,
  imageUrl TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  sections JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  bannerImage TEXT,
  isPublished BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_content_pagekey ON content(pageKey);

-- RLS Policy (if needed)
-- ALTER TABLE content ENABLE ROW LEVEL SECURITY;
