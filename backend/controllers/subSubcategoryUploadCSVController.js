const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/csv'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV files are allowed.'));
    }
  }
});

// Generate CSV template for sub-subcategories
router.get('/template', async (req, res) => {
  try {
    console.log('Generating CSV template for sub-subcategories...');
    
    // CSV headers and sample data
    const csvData = [
      // Headers
      'Sub-Subcategory Name,Sub-Subcategory Slug,Category Name,Subcategory Name,Description,Image URL,Sort Order,Is Active',
      // Sample data
      'iPhone,iphone,Electronics,Smartphones,Apple iPhone smartphones,https://example.com/iphone.jpg,1,TRUE',
      'Samsung Galaxy,samsung-galaxy,Electronics,Smartphones,Samsung Galaxy smartphones,https://example.com/samsung-galaxy.jpg,2,TRUE',
      'MacBook,macbook,Electronics,Laptops,Apple MacBook laptops,https://example.com/macbook.jpg,1,TRUE',
      'Dell Inspiron,dell-inspiron,Electronics,Laptops,Dell Inspiron laptops,https://example.com/dell-inspiron.jpg,2,TRUE'
    ].join('\n');

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sub-subcategories-template.csv"');
    res.setHeader('Content-Length', Buffer.byteLength(csvData));
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Send the CSV data
    res.send(csvData);
    console.log('Sub-subcategories CSV template sent successfully');

  } catch (error) {
    console.error('Error generating CSV template:', error);
    res.status(500).json({ 
      error: 'Failed to generate template',
      details: error.message 
    });
  }
});

// Upload and process sub-subcategories from CSV
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse CSV file
    const csv = require('csv-parser');
    const results = {
      created: 0,
      errors: []
    };

    const stream = require('stream').Readable.from(req.file.buffer.toString())
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const categoryName = row['Category Name']?.trim();
          const subcategoryName = row['Subcategory Name']?.trim();
          
          if (!categoryName || !subcategoryName) {
            results.errors.push(`Both Category Name and Subcategory Name are required`);
            return;
          }

          // Find subcategory ID
          const { data: subcategory, error: subcategoryError } = await supabase
            .from('subcategories')
            .select(`
              id,
              categories(name)
            `)
            .eq('name', subcategoryName)
            .eq('categories.name', categoryName)
            .single();

          if (subcategoryError || !subcategory) {
            results.errors.push(`Subcategory '${subcategoryName}' not found in category '${categoryName}'`);
            return;
          }

          const subSubcategoryData = {
            name: row['Sub-Subcategory Name']?.trim(),
            slug: row['Sub-Subcategory Slug']?.trim().toLowerCase() || generateSlug(row['Sub-Subcategory Name']),
            subcategory_id: subcategory.id,
            description: row['Description']?.trim() || null,
            image: row['Image URL']?.trim() || null,
            sort_order: parseInt(row['Sort Order']) || 0,
            is_active: row['Is Active']?.toString().toUpperCase() === 'TRUE'
          };

          // Validation
          if (!subSubcategoryData.name) {
            results.errors.push(`Sub-Subcategory Name is required`);
            return;
          }

          // Check for duplicate
          const { data: existing } = await supabase
            .from('sub_subcategories')
            .select('id')
            .eq('slug', subSubcategoryData.slug)
            .eq('subcategory_id', subcategory.id)
            .single();

          if (existing) {
            results.errors.push(`Sub-Subcategory with slug '${subSubcategoryData.slug}' already exists in subcategory '${subcategoryName}'`);
            return;
          }

          // Insert sub-subcategory
          const { error } = await supabase
            .from('sub_subcategories')
            .insert(subSubcategoryData);

          if (error) throw error;
          results.created++;

        } catch (error) {
          results.errors.push(`Processing error: ${error.message}`);
        }
      })
      .on('end', () => {
        res.json({
          message: 'Sub-Subcategory upload completed',
          results,
          totalCreated: results.created,
          totalErrors: results.errors.length
        });
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        res.status(500).json({ 
          error: 'Failed to process CSV file',
          details: error.message 
        });
      });

  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ 
      error: 'Failed to process upload',
      details: error.message 
    });
  }
});

// Helper function to generate slug
function generateSlug(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

module.exports = router;
