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

// Generate CSV template for categories
router.get('/template', async (req, res) => {
  try {
    console.log('Generating CSV template for categories...');
    
    // CSV headers and sample data
    const csvData = [
      // Headers
      'Category Name,Category Slug,Description,Image URL,Sort Order,Is Active',
      // Sample data
      'Electronics,electronics,Electronic devices and accessories,https://example.com/electronics.jpg,1,TRUE',
      'Fashion,fashion,Clothing and fashion accessories,https://example.com/fashion.jpg,2,TRUE',
      'Home & Garden,home-garden,Home improvement and garden supplies,https://example.com/home-garden.jpg,3,TRUE'
    ].join('\n');

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="categories-template.csv"');
    res.setHeader('Content-Length', Buffer.byteLength(csvData));
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Send the CSV data
    res.send(csvData);
    console.log('CSV template sent successfully');

  } catch (error) {
    console.error('Error generating CSV template:', error);
    res.status(500).json({ 
      error: 'Failed to generate template',
      details: error.message 
    });
  }
});

// Upload and process categories from CSV
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
          const categoryData = {
            name: row['Category Name']?.trim(),
            slug: row['Category Slug']?.trim().toLowerCase() || generateSlug(row['Category Name']),
            description: row['Description']?.trim() || null,
            image: row['Image URL']?.trim() || null,
            sort_order: parseInt(row['Sort Order']) || 0,
            is_active: row['Is Active']?.toString().toUpperCase() === 'TRUE'
          };

          // Validation
          if (!categoryData.name) {
            results.errors.push(`Category Name is required`);
            return;
          }

          // Check for duplicate
          const { data: existing } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categoryData.slug)
            .single();

          if (existing) {
            results.errors.push(`Category with slug '${categoryData.slug}' already exists`);
            return;
          }

          // Insert category
          const { error } = await supabase
            .from('categories')
            .insert(categoryData);

          if (error) throw error;
          results.created++;

        } catch (error) {
          results.errors.push(`Processing error: ${error.message}`);
        }
      })
      .on('end', () => {
        res.json({
          message: 'Category upload completed',
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
