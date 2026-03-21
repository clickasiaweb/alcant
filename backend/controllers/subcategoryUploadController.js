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

// Generate Excel template for subcategories
router.get('/template', async (req, res) => {
  try {
    // Get existing categories for reference
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('name, slug')
      .eq('is_active', true)
      .order('name');

    if (categoriesError) throw categoriesError;

    // Create template workbook
    const wb = XLSX.utils.book_new();

    // Subcategories data
    const subcategoriesData = [
      {
        'Subcategory Name': 'Smartphones',
        'Subcategory Slug': 'smartphones',
        'Category Name': 'Electronics',
        'Description': 'Mobile phones and smartphones',
        'Image URL': 'https://example.com/smartphones.jpg',
        'Sort Order': 1,
        'Is Active': 'TRUE'
      },
      {
        'Subcategory Name': 'Laptops',
        'Subcategory Slug': 'laptops',
        'Category Name': 'Electronics',
        'Description': 'Laptop computers',
        'Image URL': 'https://example.com/laptops.jpg',
        'Sort Order': 2,
        'Is Active': 'TRUE'
      }
    ];

    const subcategoriesWS = XLSX.utils.json_to_sheet(subcategoriesData);
    XLSX.utils.book_append_sheet(wb, subcategoriesWS, 'Subcategories');

    // Categories reference sheet
    const categoriesReferenceData = categories.map(cat => ({
      'Category Name': cat.name,
      'Category Slug': cat.slug
    }));

    const categoriesWS = XLSX.utils.json_to_sheet(categoriesReferenceData);
    XLSX.utils.book_append_sheet(wb, categoriesWS, 'Categories Reference');

    // Instructions sheet
    const instructionsData = [
      {
        'Column': 'Subcategory Name',
        'Required': 'Yes',
        'Description': 'The display name of the subcategory',
        'Example': 'Smartphones'
      },
      {
        'Column': 'Subcategory Slug',
        'Required': 'Auto-generated if empty',
        'Description': 'URL-friendly version of the name',
        'Example': 'smartphones'
      },
      {
        'Column': 'Category Name',
        'Required': 'Yes',
        'Description': 'Must match an existing category name exactly',
        'Example': 'Electronics'
      },
      {
        'Column': 'Description',
        'Required': 'No',
        'Description': 'Subcategory description for SEO and display',
        'Example': 'Mobile phones and smartphones'
      },
      {
        'Column': 'Image URL',
        'Required': 'No',
        'Description': 'Subcategory image URL',
        'Example': 'https://example.com/smartphones.jpg'
      },
      {
        'Column': 'Sort Order',
        'Required': 'No',
        'Description': 'Display order within category (lower numbers show first)',
        'Example': '1'
      },
      {
        'Column': 'Is Active',
        'Required': 'No',
        'Description': 'Whether subcategory is visible (TRUE/FALSE)',
        'Example': 'TRUE'
      }
    ];

    const instructionsWS = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="subcategories-template.xlsx"');
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

// Upload and process subcategories from Excel
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

    // Process Subcategories sheet
    if (workbook.Sheets['Subcategories']) {
      const subcategoriesData = XLSX.utils.sheet_to_json(workbook.Sheets['Subcategories']);
      
      for (let i = 0; i < subcategoriesData.length; i++) {
        const row = subcategoriesData[i];
        const rowNum = i + 2; // Excel row numbers start at 1, plus header row
        
        try {
          const categoryName = row['Category Name']?.trim();
          if (!categoryName) {
            results.errors.push(`Row ${rowNum}: Category Name is required`);
            continue;
          }

          // Find category ID
          const { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categoryName)
            .single();

          if (categoryError || !category) {
            results.errors.push(`Row ${rowNum}: Category '${categoryName}' not found`);
            continue;
          }

          const subcategoryData = {
            name: row['Subcategory Name']?.trim(),
            slug: row['Subcategory Slug']?.trim().toLowerCase() || generateSlug(row['Subcategory Name']),
            category_id: category.id,
            description: row['Description']?.trim() || null,
            image: row['Image URL']?.trim() || null,
            sort_order: parseInt(row['Sort Order']) || 0,
            is_active: row['Is Active']?.toString().toUpperCase() === 'TRUE'
          };

          // Validation
          if (!subcategoryData.name) {
            results.errors.push(`Row ${rowNum}: Subcategory Name is required`);
            continue;
          }

          // Check for duplicate
          const { data: existing } = await supabase
            .from('subcategories')
            .select('id')
            .eq('slug', subcategoryData.slug)
            .eq('category_id', category.id)
            .single();

          if (existing) {
            results.errors.push(`Row ${rowNum}: Subcategory with slug '${subcategoryData.slug}' already exists in category '${categoryName}'`);
            continue;
          }

          // Insert subcategory
          const { error } = await supabase
            .from('subcategories')
            .insert(subcategoryData);

          if (error) throw error;
          results.created++;

        } catch (error) {
          results.errors.push(`Row ${rowNum}: ${error.message}`);
        }
      }
    } else {
      results.errors.push('No "Subcategories" sheet found in the Excel file');
    }

    res.json({
      message: 'Subcategory upload completed',
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
