-- Add product_id column to inquiries table
-- Migration: Add product reference to inquiries

ALTER TABLE inquiries 
ADD COLUMN product_id UUID REFERENCES products(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX idx_inquiries_product_id ON inquiries(product_id);

-- Update existing inquiries to have default null values (no action needed for new column)

-- Update the status check to match the application values
ALTER TABLE inquiries 
DROP CONSTRAINT IF EXISTS inquiries_status_check;

ALTER TABLE inquiries 
ADD CONSTRAINT inquiries_status_check 
CHECK (status IN ('new', 'read', 'responded', 'closed'));

-- Add response tracking columns
ALTER TABLE inquiries 
ADD COLUMN response TEXT,
ADD COLUMN responded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN responded_by UUID REFERENCES users(id);

-- Add index for responded_by for better performance
CREATE INDEX idx_inquiries_responded_by ON inquiries(responded_by);
