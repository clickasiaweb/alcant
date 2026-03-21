const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

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

// Generate Excel template for category upload
router.get('/template', async (req, res) => {
  try {
    // Get existing categories for reference
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name');

    if (categoriesError) throw categoriesError;

    // Get existing subcategories for reference
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select(`
        id, 
        name, 
        slug,
        category_id,
        categories(name)
      `)
      .eq('is_active', true)
      .order('name');

    if (subcategoriesError) throw subcategoriesError;

    // Create template workbook
    const wb = XLSX.utils.book_new();

    // Categories sheet
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

    // Subcategories sheet
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

    // Sub-subcategories sheet
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

    // Reference data sheet
    const referenceData = [
      ...categories.map(cat => ({
        'Type': 'Category',
        'Name': cat.name,
        'Slug': cat.slug
      })),
      ...subcategories.map(sub => ({
        'Type': 'Subcategory',
        'Name': sub.name,
        'Slug': sub.slug,
        'Parent Category': sub.categories?.name || 'N/A'
      }))
    ];

    const referenceWS = XLSX.utils.json_to_sheet(referenceData);
    XLSX.utils.book_append_sheet(wb, referenceWS, 'Reference');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=category-template.xlsx');
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
      categories: { created: 0, errors: [] },
      subcategories: { created: 0, errors: [] },
      subSubcategories: { created: 0, errors: [] }
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
            results.categories.errors.push(`Row ${rowNum}: Category Name is required`);
            continue;
          }

          // Check for duplicate
          const { data: existing } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categoryData.slug)
            .single();

          if (existing) {
            results.categories.errors.push(`Row ${rowNum}: Category with slug '${categoryData.slug}' already exists`);
            continue;
          }

          // Insert category
          const { error } = await supabase
            .from('categories')
            .insert(categoryData);

          if (error) throw error;
          results.categories.created++;

        } catch (error) {
          results.categories.errors.push(`Row ${rowNum}: ${error.message}`);
        }
      }
    }

    // Process Subcategories sheet
    if (workbook.Sheets['Subcategories']) {
      const subcategoriesData = XLSX.utils.sheet_to_json(workbook.Sheets['Subcategories']);
      
      for (let i = 0; i < subcategoriesData.length; i++) {
        const row = subcategoriesData[i];
        const rowNum = i + 2;
        
        try {
          const categoryName = row['Category Name']?.trim();
          if (!categoryName) {
            results.subcategories.errors.push(`Row ${rowNum}: Category Name is required`);
            continue;
          }

          // Find category ID
          const { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categoryName)
            .single();

          if (categoryError || !category) {
            results.subcategories.errors.push(`Row ${rowNum}: Category '${categoryName}' not found`);
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
            results.subcategories.errors.push(`Row ${rowNum}: Subcategory Name is required`);
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
            results.subcategories.errors.push(`Row ${rowNum}: Subcategory with slug '${subcategoryData.slug}' already exists in category '${categoryName}'`);
            continue;
          }

          // Insert subcategory
          const { error } = await supabase
            .from('subcategories')
            .insert(subcategoryData);

          if (error) throw error;
          results.subcategories.created++;

        } catch (error) {
          results.subcategories.errors.push(`Row ${rowNum}: ${error.message}`);
        }
      }
    }

    // Process Sub-Subcategories sheet
    if (workbook.Sheets['Sub-Subcategories']) {
      const subSubcategoriesData = XLSX.utils.sheet_to_json(workbook.Sheets['Sub-Subcategories']);
      
      for (let i = 0; i < subSubcategoriesData.length; i++) {
        const row = subSubcategoriesData[i];
        const rowNum = i + 2;
        
        try {
          const categoryName = row['Category Name']?.trim();
          const subcategoryName = row['Subcategory Name']?.trim();
          
          if (!categoryName || !subcategoryName) {
            results.subSubcategories.errors.push(`Row ${rowNum}: Both Category Name and Subcategory Name are required`);
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
            results.subSubcategories.errors.push(`Row ${rowNum}: Subcategory '${subcategoryName}' not found in category '${categoryName}'`);
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
            results.subSubcategories.errors.push(`Row ${rowNum}: Sub-Subcategory Name is required`);
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
            results.subSubcategories.errors.push(`Row ${rowNum}: Sub-Subcategory with slug '${subSubcategoryData.slug}' already exists in subcategory '${subcategoryName}'`);
            continue;
          }

          // Insert sub-subcategory
          const { error } = await supabase
            .from('sub_subcategories')
            .insert(subSubcategoryData);

          if (error) throw error;
          results.subSubcategories.created++;

        } catch (error) {
          results.subSubcategories.errors.push(`Row ${rowNum}: ${error.message}`);
        }
      }
    }

    res.json({
      message: 'Category upload completed',
      results,
      totalCreated: results.categories.created + results.subcategories.created + results.subSubcategories.created,
      totalErrors: results.categories.errors.length + results.subcategories.errors.length + results.subSubcategories.errors.length
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
