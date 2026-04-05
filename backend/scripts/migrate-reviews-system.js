// Migration script for Reviews System Implementation
// Run this script in Supabase SQL editor or via Supabase migrations

const migrationSQL = `
-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Add new columns to products table (if they don't exist)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create trigger to automatically update product rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new average rating and review count
  UPDATE products 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE product_id = NEW.product_id
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE product_id = NEW.product_id
    ),
    -- Keep backward compatibility
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE product_id = NEW.product_id
    ),
    reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE product_id = NEW.product_id
    )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for reviews table
DROP TRIGGER IF EXISTS trigger_update_product_rating_insert ON reviews;
CREATE TRIGGER trigger_update_product_rating_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

DROP TRIGGER IF EXISTS trigger_update_product_rating_update ON reviews;
CREATE TRIGGER trigger_update_product_rating_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

DROP TRIGGER IF EXISTS trigger_update_product_rating_delete ON reviews;
CREATE TRIGGER trigger_update_product_rating_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- Row Level Security (RLS) for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own reviews and all published reviews
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

-- Policy: Users can only insert their own reviews
CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Update existing products to have correct rating values
UPDATE products 
SET 
  average_rating = COALESCE(rating, 0),
  review_count = COALESCE(reviews, 0)
WHERE average_rating IS NULL OR review_count IS NULL;
`;

console.log('=== Reviews System Migration ===');
console.log('Copy and paste the following SQL into your Supabase SQL Editor:');
console.log('='.repeat(50));
console.log(migrationSQL);
console.log('='.repeat(50));
console.log('\nMigration includes:');
console.log('✅ Reviews table creation');
console.log('✅ Performance indexes');
console.log('✅ Product table updates (short_description, average_rating, review_count)');
console.log('✅ Automatic rating calculation triggers');
console.log('✅ Row Level Security policies');
console.log('✅ Backward compatibility maintenance');
