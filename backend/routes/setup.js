const express = require('express');
const router = express.Router();

// Load environment variables
require('dotenv').config();

// Try to import supabase, but handle missing config gracefully
let supabase;
try {
  const supabaseConfig = require('../config/supabase');
  supabase = supabaseConfig.supabase;
} catch (error) {
  console.error('Supabase configuration error:', error.message);
}

// Temporary endpoint to create sub3_categories table
router.post('/create-sub3-table', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ 
        error: 'Supabase not configured. Please check environment variables.',
        message: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY'
      });
    }

    // Use raw SQL execution through supabase.rpc with a custom function
    // For now, let's create the table using a simpler approach
    const { data, error } = await supabase
      .from('sub3_categories')
      .select('id')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, we need to create it manually
      return res.status(500).json({ 
        error: 'Table does not exist. Please create sub3_categories table manually in Supabase dashboard.',
        code: error.code,
        message: 'Table sub3_categories not found in database'
      });
    }

    res.json({ message: 'Table already exists', data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Insert sample data
router.post('/insert-sub3-sample-data', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ 
        error: 'Supabase not configured. Please check environment variables.',
        message: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY'
      });
    }

    // First get some sub-subcategories to use as parents
    const { data: subSubcategories, error: fetchError } = await supabase
      .from('sub_subcategories')
      .select('id, name')
      .limit(4);

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    if (!subSubcategories || subSubcategories.length === 0) {
      return res.status(400).json({ error: 'No sub-subcategories found to use as parents' });
    }

    const sampleData = [
      {
        name: 'iPhone 15 Pro Max Premium',
        slug: 'iphone-15-pro-max-premium',
        sub_subcategory_id: subSubcategories[0]?.id,
        description: 'Premium cases for iPhone 15 Pro Max',
        sort_order: 1
      },
      {
        name: 'iPhone 15 Pro Standard',
        slug: 'iphone-15-pro-standard',
        sub_subcategory_id: subSubcategories[0]?.id,
        description: 'Standard cases for iPhone 15 Pro',
        sort_order: 2
      },
      {
        name: 'iPhone 15 Pro Ultra',
        slug: 'iphone-15-pro-ultra',
        sub_subcategory_id: subSubcategories[1]?.id,
        description: 'Ultra cases for iPhone 15 Pro',
        sort_order: 1
      },
      {
        name: 'iPhone 15 Pro Lite',
        slug: 'iphone-15-pro-lite',
        sub_subcategory_id: subSubcategories[2]?.id,
        description: 'Lite cases for iPhone 15 Pro',
        sort_order: 1
      }
    ];

    const { data, error } = await supabase
      .from('sub3_categories')
      .insert(sampleData)
      .select();

    if (error) {
      console.error('Error inserting sample data:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Sample data inserted successfully', data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
