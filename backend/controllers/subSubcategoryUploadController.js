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

// Generate Excel template for sub-subcategories
router.get('/template', async (req, res) => {
  try {
    // Get existing categories and subcategories for reference
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('name, slug')
      .eq('is_active', true)
      .order('name');

    if (categoriesError) throw categoriesError;

    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select(`
        name, 
        slug,
        categories(name)
      `)
      .eq('is_active', true)
      .order('name');

    if (subcategoriesError) throw subcategoriesError;

    // Create template workbook
    const wb = XLSX.utils.book_new();

    // Sub-subcategories data
    const subSubcategoriesData = [
      {
        'Sub-Subcategory Name': 'iPhone',
        'Sub-Subcategory Slug': 'iphone',
        'Category Name': 'Electronics',
        'Subcategory Name': 'Smartphones',
        'Description': 'Apple iPhone smartphones',
        'Image URL': 'https://example.com/iphone.jpg',
        'Sort Order': 1,
        'Is Active': 'TRUE'
      },
      {
        'Sub-Subcategory Name': 'Samsung Galaxy',
        'Sub-Subcategory Slug': 'samsung-galaxy',
        'Category Name': 'Electronics',
        'Subcategory Name': 'Smartphones',
        'Description': 'Samsung Galaxy smartphones',
        'Image URL': 'https://example.com/samsung-galaxy.jpg',
        'Sort Order': 2,
        'Is Active': 'TRUE'
      }
    ];

    const subSubcategoriesWS = XLSX.utils.json_to_sheet(subSubcategoriesData);
    XLSX.utils.book_append_sheet(wb, subSubcategoriesWS, 'Sub-Subcategories');

    // Categories reference sheet
    const categoriesReferenceData = categories.map(cat => ({
      'Category Name': cat.name,
      'Category Slug': cat.slug
    }));

    const categoriesWS = XLSX.utils.json_to_sheet(categoriesReferenceData);
    XLSX.utils.book_append_sheet(wb, categoriesWS, 'Categories Reference');

    // Subcategories reference sheet
    const subcategoriesReferenceData = subcategories.map(sub => ({
      'Subcategory Name': sub.name,
      'Subcategory Slug': sub.slug,
      'Parent Category': sub.categories?.name || 'N/A'
    }));

    const subcategoriesWS = XLSX.utils.json_to_sheet(subcategoriesReferenceData);
    XLSX.utils.book_append_sheet(wb, subcategoriesWS, 'Subcategories Reference');

    // Instructions sheet
    const instructionsData = [
      {
        'Column': 'Sub-Subcategory Name',
        'Required': 'Yes',
        'Description': 'The display name of the sub-subcategory',
        'Example': 'iPhone'
      },
      {
        'Column': 'Sub-Subcategory Slug',
        'Required': 'Auto-generated if empty',
        'Description': 'URL-friendly version of the name',
        'Example': 'iphone'
      },
      {
        'Column': 'Category Name',
        'Required': 'Yes',
        'Description': 'Must match an existing category name exactly',
        'Example': 'Electronics'
      },
      {
        'Column': 'Subcategory Name',
        'Required': 'Yes',
        'Description': 'Must match an existing subcategory name exactly',
        'Example': 'Smartphones'
      },
      {
        'Column': 'Description',
        'Required': 'No',
        'Description': 'Sub-subcategory description for SEO and display',
        'Example': 'Apple iPhone smartphones'
      },
      {
        'Column': 'Image URL',
        'Required': 'No',
        'Description': 'Sub-subcategory image URL',
        'Example': 'https://example.com/iphone.jpg'
      },
      {
        'Column': 'Sort Order',
        'Required': 'No',
        'Description': 'Display order within subcategory (lower numbers show first)',
        'Example': '1'
      },
      {
        'Column': 'Is Active',
        'Required': 'No',
        'Description': 'Whether sub-subcategory is visible (TRUE/FALSE)',
        'Example': 'TRUE'
      }
    ];

    const instructionsWS = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="sub-subcategories-template.xlsx"');
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

// Upload and process sub-subcategories from Excel
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

    // Process Sub-Subcategories sheet
    if (workbook.Sheets['Sub-Subcategories']) {
      const subSubcategoriesData = XLSX.utils.sheet_to_json(workbook.Sheets['Sub-Subcategories']);
      
      for (let i = 0; i < subSubcategoriesData.length; i++) {
        const row = subSubcategoriesData[i];
        const rowNum = i + 2; // Excel row numbers start at 1, plus header row
        
        try {
          const categoryName = row['Category Name']?.trim();
          const subcategoryName = row['Subcategory Name']?.trim();
          
          if (!categoryName || !subcategoryName) {
            results.errors.push(`Row ${rowNum}: Both Category Name and Subcategory Name are required`);
            continue;
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
            results.errors.push(`Row ${rowNum}: Subcategory '${subcategoryName}' not found in category '${categoryName}'`);
            continue;
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
            results.errors.push(`Row ${rowNum}: Sub-Subcategory Name is required`);
            continue;
          }

          // Check for duplicate
          const { data: existing } = await supabase
            .from('sub_subcategories')
            .select('id')
            .eq('slug', subSubcategoryData.slug)
            .eq('subcategory_id', subcategory.id)
            .single();

          if (existing) {
            results.errors.push(`Row ${rowNum}: Sub-Subcategory with slug '${subSubcategoryData.slug}' already exists in subcategory '${subcategoryName}'`);
            continue;
          }

          // Insert sub-subcategory
          const { error } = await supabase
            .from('sub_subcategories')
            .insert(subSubcategoryData);

          if (error) throw error;
          results.created++;

        } catch (error) {
          results.errors.push(`Row ${rowNum}: ${error.message}`);
        }
      }
    } else {
      results.errors.push('No "Sub-Subcategories" sheet found in the Excel file');
    }

    res.json({
      message: 'Sub-Subcategory upload completed',
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
