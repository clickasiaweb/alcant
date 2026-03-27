-- Add link configuration fields to sub_subcategories table
-- Run this SQL in your Supabase SQL editor

ALTER TABLE sub_subcategories 
ADD COLUMN link_type VARCHAR(20) DEFAULT 'auto' NOT NULL,
ADD COLUMN custom_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN sub_subcategories.link_type IS 'Type of link: auto, custom, product, or collection';
COMMENT ON COLUMN sub_subcategories.custom_url IS 'Custom URL or path for the link when link_type is not auto';

-- Create index for better performance
CREATE INDEX idx_sub_subcategories_link_type ON sub_subcategories(link_type);

-- Update existing records to have default values
UPDATE sub_subcategories 
SET link_type = 'auto' 
WHERE link_type IS NULL;
