const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Direct template download with file system approach
router.get('/template-direct', async (req, res) => {
  try {
    console.log('Generating direct template download...');
    
    // Create template workbook
    const wb = XLSX.utils.book_new();

    // Categories data
    const categoriesData = [
      {
        'Category Name': 'Electronics',
        'Category Slug': 'electronics',
        'Description': 'Electronic devices and accessories',
        'Image URL': 'https://example.com/electronics.jpg',
        'Sort Order': 1,
        'Is Active': 'TRUE'
      },
      {
        'Category Name': 'Fashion',
        'Category Slug': 'fashion',
        'Description': 'Clothing and fashion accessories',
        'Image URL': 'https://example.com/fashion.jpg',
        'Sort Order': 2,
        'Is Active': 'TRUE'
      }
    ];

    const categoriesWS = XLSX.utils.json_to_sheet(categoriesData);
    XLSX.utils.book_append_sheet(wb, categoriesWS, 'Categories');

    // Instructions sheet
    const instructionsData = [
      {
        'Column': 'Category Name',
        'Required': 'Yes',
        'Description': 'The display name of the category',
        'Example': 'Electronics'
      },
      {
        'Column': 'Category Slug',
        'Required': 'Auto-generated if empty',
        'Description': 'URL-friendly version of the name',
        'Example': 'electronics'
      }
    ];

    const instructionsWS = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    console.log('Template generated, size:', buf.length);

    // Set headers for direct download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="categories-template-direct.xlsx"');
    res.setHeader('Content-Length', buf.length);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Send the buffer
    res.send(buf);
    console.log('Template sent successfully');

  } catch (error) {
    console.error('Error generating direct template:', error);
    res.status(500).json({ 
      error: 'Failed to generate template',
      details: error.message 
    });
  }
});

module.exports = router;
