-- Fix RLS policies for content table to allow service role full access

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to content" ON content;
DROP POLICY IF EXISTS "Allow service role full access to content" ON content;

-- Create new policies with proper service role access
CREATE POLICY "Allow public read access to published content" ON content
FOR SELECT USING (is_published = true);

CREATE POLICY "Allow service role full access to content" ON content
FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Also allow anon role to read published content
CREATE POLICY "Allow anon read access to published content" ON content
FOR SELECT USING (auth.jwt()->>'role' = 'anon' AND is_published = true);

-- Bypass RLS for service role
ALTER TABLE content DISABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
