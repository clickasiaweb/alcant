// Simple script to check and update database structure
const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndUpdateDatabase() {
  try {
    console.log('🔍 Checking database structure...');
    
    // Check if the columns exist by trying to select them
    const { data, error } = await supabase
      .from('sub_subcategories')
      .select('id, name, slug, link_type, custom_url')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column "link_type" does not exist') || 
          error.message.includes('column "custom_url" does not exist')) {
        console.log('❌ Missing columns detected. Please run the migration manually.');
        console.log('\n📝 Run this SQL in your Supabase SQL editor:');
        console.log(`
ALTER TABLE sub_subcategories 
ADD COLUMN link_type VARCHAR(20) DEFAULT 'auto' NOT NULL,
ADD COLUMN custom_url TEXT;

COMMENT ON COLUMN sub_subcategories.link_type IS 'Type of link: auto, custom, product, or collection';
COMMENT ON COLUMN sub_subcategories.custom_url IS 'Custom URL or path for the link when link_type is not auto';

CREATE INDEX idx_sub_subcategories_link_type ON sub_subcategories(link_type);

UPDATE sub_subcategories 
SET link_type = 'auto' 
WHERE link_type IS NULL;
        `);
      } else {
        console.log('❌ Other database error:', error.message);
      }
    } else {
      console.log('✅ Database structure looks good!');
      console.log('Sample data:', data);
    }
    
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    console.log('\n💡 Make sure your SUPABASE_URL and SUPABASE_ANON_KEY are set correctly');
  }
}

checkAndUpdateDatabase();
