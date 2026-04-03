-- Add policy to allow public inserts for inquiries table
-- This allows anyone to submit inquiries without authentication

CREATE POLICY "Allow public insert for inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

-- This allows anyone to insert inquiries (public contact form)
-- The existing service role policy will still allow admin access
