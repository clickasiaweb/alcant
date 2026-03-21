const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
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
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel files are allowed.'));
    }
  }
});

// Generate Excel template for categories
router.get('/template', async (req, res) => {
  try {
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
      },
      {
        'Category Name': 'Home & Garden',
        'Category Slug': 'home-garden',
        'Description': 'Home improvement and garden supplies',
        'Image URL': 'https://example.com/home-garden.jpg',
        'Sort Order': 3,
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
      },
      {
        'Column': 'Description',
        'Required': 'No',
        'Description': 'Category description for SEO and display',
        'Example': 'Electronic devices and accessories'
      },
      {
        'Column': 'Image URL',
        'Required': 'No',
        'Description': 'Category image URL',
        'Example': 'https://example.com/electronics.jpg'
      },
      {
        'Column': 'Sort Order',
        'Required': 'No',
        'Description': 'Display order (lower numbers show first)',
        'Example': '1'
      },
      {
        'Column': 'Is Active',
        'Required': 'No',
        'Description': 'Whether category is visible (TRUE/FALSE)',
        'Example': 'TRUE'
      }
    ];

    const instructionsWS = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="categories-template.xlsx"');
    res.setHeader('Content-Length', buf.length);
    res.send(buf);

  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ 
      error: 'Failed to generate template',
      details: error.message 
    });
  }
});

// Upload and process categories from Excel
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    
    const results = {
      created: 0,
      errors: []
    };

    // Process Categories sheet
    if (workbook.Sheets['Categories']) {
      const categoriesData = XLSX.utils.sheet_to_json(workbook.Sheets['Categories']);
      
      for (let i = 0; i < categoriesData.length; i++) {
        const row = categoriesData[i];
        const rowNum = i + 2; // Excel row numbers start at 1, plus header row
        
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
            results.errors.push(`Row ${rowNum}: Category Name is required`);
            continue;
          }

          // Check for duplicate
          const { data: existing } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categoryData.slug)
            .single();

          if (existing) {
            results.errors.push(`Row ${rowNum}: Category with slug '${categoryData.slug}' already exists`);
            continue;
          }

          // Insert category
          const { error } = await supabase
            .from('categories')
            .insert(categoryData);

          if (error) throw error;
          results.created++;

        } catch (error) {
          results.errors.push(`Row ${rowNum}: ${error.message}`);
        }
      }
    } else {
      results.errors.push('No "Categories" sheet found in the Excel file');
    }

    res.json({
      message: 'Category upload completed',
      results,
      totalCreated: results.created,
      totalErrors: results.errors.length
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
