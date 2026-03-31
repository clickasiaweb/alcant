require('dotenv').config();
const XLSX = require('xlsx');
const { formidable } = require('formidable');
const { supabase } = require('../config/supabase');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Create direct service client to bypass RLS
let supabaseService;
try {
  supabaseService = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
} catch (error) {
  console.log('Warning: Could not create service client:', error.message);
  supabaseService = null;
}

// Excel template columns
const REQUIRED_COLUMNS = [
  'product_name',
  'slug', 
  'description',
  'short_description',
  'brand',
  'category',
  'sub_category',
  'sub_sub_category',
  'price',
  'sale_price',
  'stock',
  'sku',
  'color',
  'size',
  'weight',
  'image_1',
  'image_2',
  'image_3',
  'image_4'
];

const VARIANT_COLUMNS = [
  'variant_color',
  'variant_size', 
  'variant_price',
  'variant_stock'
];

// Generate Excel template
const generateTemplate = async (req, res) => {
  try {
    // Create workbook with sample data
    const wb = XLSX.utils.book_new();
    
    // Create worksheet with headers and sample data
    const wsData = [
      REQUIRED_COLUMNS,
      VARIANT_COLUMNS
    ];
    
    // Add sample data rows
    const sampleData = [
      'iPhone 15 Pro Case',
      'iphone-15-pro-case',
      'Premium silicone case with excellent protection and stylish design',
      'Soft protective case for iPhone 15 Pro',
      'Apple',
      'Electronics',
      'Mobile Accessories',
      'Phone Cases',
      799,
      599,
      100,
      'ALC-IP15P-BLK',
      'Black',
      'Standard',
      200,
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
      'https://example.com/image4.jpg'
    ];
    
    const variantData = [
      'Black, Blue, Red',
      'M, L, XL',
      '799,899,999',
      '20,30,25'
    ];
    
    wsData.push(sampleData);
    wsData.push(variantData);
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths
    const colWidths = REQUIRED_COLUMNS.map(() => ({ wch: 15 }));
    colWidths[0].wch = 20; // product_name
    colWidths[1].wch = 20; // slug
    colWidths[2].wch = 30; // description
    colWidths[3].wch = 25; // short_description
    colWidths[14].wch = 25; // image_1
    colWidths[15].wch = 25; // image_2
    colWidths[16].wch = 25; // image_3
    colWidths[17].wch = 25; // image_4
    
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'products');
    
    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=product-upload-template.xlsx');
    
    res.send(buffer);
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate template',
      error: error.message 
    });
  }
};

// Parse and validate Excel file
const parseExcelFile = async (req, res) => {
  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
      uploadDir: require('os').tmpdir(),
      multiples: false,
      // Disable file filtering to let all files through, we'll validate manually
      filter: function () {
        return true;
      }
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'File upload failed',
          error: err.message
        });
      }

      if (!files.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const filePath = files.file[0].filepath;
      const originalFileName = files.file[0].originalFilename || files.file[0].name;
      
      // Manual file validation
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const hasValidExtension = originalFileName && validExtensions.some(ext => originalFileName.toLowerCase().endsWith(ext));
      
      if (!hasValidExtension) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Please upload .xlsx, .xls, or .csv files only.'
        });
      }
      
      try {
        console.log('📁 Reading Excel file from:', filePath);
        console.log('📁 Original filename:', originalFileName);
        console.log('📁 File exists:', fs.existsSync(filePath));
        
        if (!fs.existsSync(filePath)) {
          return res.status(400).json({
            success: false,
            message: 'Uploaded file not found on server'
          });
        }
        
        const fileStats = fs.statSync(filePath);
        console.log('📁 File stats:', fileStats);
        
        // Verify file integrity by checking size and signature
        if (fileStats.size === 0) {
          return res.status(400).json({
            success: false,
            message: 'Uploaded file is empty'
          });
        }
        
        // Read Excel file with error handling - try buffer approach
        let workbook;
        try {
          console.log('🔍 Reading file as buffer...');
          const fileBuffer = fs.readFileSync(filePath);
          console.log('📊 Buffer size:', fileBuffer.length);
          
          // Check file signature to verify it's a valid Excel file
          if (fileBuffer.length < 8) {
            throw new Error('File too small to be a valid Excel file');
          }
          
          // Check for ZIP signature (xlsx files are ZIP archives)
          const signature = fileBuffer.slice(0, 4).toString('hex');
          console.log('📊 File signature:', signature);
          
          if (signature !== '504b0304' && signature !== '504b0506') {
            throw new Error('Invalid file format. Expected Excel file (.xlsx)');
          }
          
          // Try to read with different options - removed bookSheets
          workbook = XLSX.read(fileBuffer, { 
            type: 'buffer',
            cellStyles: false,
            cellNF: false,
            cellHTML: false,
            bookVBA: false
          });
          
          if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error('No sheets found in workbook');
          }
          
        } catch (readError) {
          console.error('❌ Error reading Excel file:', readError);
          console.error('❌ Error details:', readError.stack);
          
          // Clean up the uploaded file
          try {
            fs.unlinkSync(filePath);
          } catch (cleanupError) {
            console.error('Failed to cleanup file:', cleanupError);
          }
          
          return res.status(400).json({
            success: false,
            message: 'Failed to read Excel file. Please ensure it is a valid .xlsx file.',
            error: readError.message
          });
        }
        
        const sheetName = workbook.SheetNames.includes('products') ? 'products' : workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log('📊 Sheet names:', workbook.SheetNames);
        console.log('📊 Using sheet:', sheetName);
        console.log('📊 Data rows:', data.length);

        if (data.length < 2) {
          return res.status(400).json({
            success: false,
            message: 'Excel file must contain at least header and one data row'
          });
        }

        // Extract headers
        const headers = data[0];
        const rows = data.slice(1).filter(row => row.some(cell => cell !== null && cell !== ''));

        // Validate required columns
        const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Missing required columns',
            missingColumns
          });
        }

        // Parse and validate data
        const products = [];
        const errors = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const rowData = {};
          
          // Map row data to columns
          headers.forEach((header, index) => {
            rowData[header] = row[index] || '';
          });

          // Validate required fields
          const validationErrors = await validateProductRow(rowData, i + 2); // +2 because Excel rows are 1-indexed and header is row 1
          
          if (validationErrors.length > 0) {
            errors.push(...validationErrors);
            continue;
          }

          // Check for duplicate slug and SKU in Supabase
          const { data: existingProducts } = await supabase
            .from('products')
            .select('slug, sku')
            .or(`slug.eq.${rowData.slug},sku.eq.${rowData.sku}`)
            .limit(1);

          if (existingProducts && existingProducts.length > 0) {
            const existing = existingProducts[0];
            if (existing.slug === rowData.slug) {
              errors.push({
                row: i + 2,
                field: 'slug',
                message: `Slug "${rowData.slug}" already exists`
              });
            }
            if (existing.sku === rowData.sku) {
              errors.push({
                row: i + 2,
                field: 'sku', 
                message: `SKU "${rowData.sku}" already exists`
              });
            }
            continue;
          }

          // Parse variants if present
          const variants = parseVariants(rowData);

          // Convert numeric values properly
          const processedRowData = {
            ...rowData,
            price: parseFloat(rowData.price?.toString().trim() || '0'),
            sale_price: parseFloat(rowData.sale_price?.toString().trim() || '0'),
            stock: parseInt(rowData.stock?.toString().trim() || '0'),
            weight: parseFloat(rowData.weight?.toString().trim() || '0'),
            variants,
            rowIndex: i + 2
          };

          products.push(processedRowData);
        }

        res.json({
          success: true,
          data: {
            products,
            errors,
            totalRows: rows.length,
            validProducts: products.length,
            invalidRows: errors.length
          }
        });

      } catch (parseError) {
        console.error('Error parsing Excel:', parseError);
        
        // Clean up the uploaded file
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.error('Failed to cleanup file:', cleanupError);
        }
        
        res.status(500).json({
          success: false,
          message: 'Failed to parse Excel file',
          error: parseError.message
        });
      } finally {
        // Always clean up the uploaded file
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.error('Failed to cleanup file in finally:', cleanupError);
        }
      }
    });

  } catch (error) {
    console.error('Error in parseExcelFile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Validate product row data
const validateProductRow = async (rowData, rowNumber) => {
  const errors = [];

  // Required fields validation
  if (!rowData.product_name || rowData.product_name.toString().trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'product_name',
      message: 'Product name is required'
    });
  }

  if (!rowData.slug || rowData.slug.toString().trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'slug',
      message: 'Slug is required'
    });
  }

  if (!rowData.description || rowData.description.toString().trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'description',
      message: 'Description is required'
    });
  }

  if (!rowData.category || rowData.category.toString().trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'category',
      message: 'Category is required'
    });
  }

  // Price validation
  const price = parseFloat(rowData.price?.toString().trim() || '0');
  if (isNaN(price) || price < 0) {
    errors.push({
      row: rowNumber,
      field: 'price',
      message: 'Price must be a valid positive number'
    });
  }

  // Stock validation
  const stock = parseInt(rowData.stock?.toString().trim() || '0');
  if (isNaN(stock) || stock < 0) {
    errors.push({
      row: rowNumber,
      field: 'stock',
      message: 'Stock must be a valid non-negative number'
    });
  }

  // SKU validation
  if (!rowData.sku || rowData.sku.toString().trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'sku',
      message: 'SKU is required'
    });
  }

  // Image URL validation
  for (let i = 1; i <= 4; i++) {
    const imageField = `image_${i}`;
    if (rowData[imageField] && rowData[imageField].toString().trim() !== '') {
      try {
        new URL(rowData[imageField]);
      } catch {
        errors.push({
          row: rowNumber,
          field: imageField,
          message: `Invalid URL format for ${imageField}`
        });
      }
    }
  }

  return errors;
};

// Parse variants from row data
const parseVariants = (rowData) => {
  const variants = [];
  
  if (rowData.variant_color && rowData.variant_size && rowData.variant_price && rowData.variant_stock) {
    const colors = rowData.variant_color.toString().split(',').map(c => c.trim());
    const sizes = rowData.variant_size.toString().split(',').map(s => s.trim());
    const prices = rowData.variant_price.toString().split(',').map(p => parseFloat(p.trim()));
    const stocks = rowData.variant_stock.toString().split(',').map(s => parseInt(s.trim()));

    const maxLength = Math.max(colors.length, sizes.length, prices.length, stocks.length);

    for (let i = 0; i < maxLength; i++) {
      if (colors[i] && sizes[i] && !isNaN(prices[i]) && !isNaN(stocks[i])) {
        // Extract color-specific images
        const variantImages = [];
        for (let imgIndex = 1; imgIndex <= 4; imgIndex++) {
          const imageField = `image_${imgIndex}`;
          if (rowData[imageField] && rowData[imageField].toString().trim() !== '') {
            // Check if image is color-specific (e.g., "black_image1.jpg" or contains color name)
            const imageUrl = rowData[imageField].toString().trim();
            if (imageUrl.toLowerCase().includes(colors[i].toLowerCase()) || 
                rowData[`variant_${colors[i].toLowerCase()}_image_${imgIndex}`]) {
              variantImages.push(imageUrl);
            }
          }
        }
        
        variants.push({
          color: colors[i],
          size: sizes[i],
          price: prices[i],
          stock: stocks[i],
          images: variantImages.length > 0 ? variantImages : [
            rowData.image_1, 
            rowData.image_2, 
            rowData.image_3, 
            rowData.image_4
          ].filter(img => img && img.toString().trim() !== '')
        });
      }
    }
  } else if (rowData.color) {
    // Single color variant
    const variantImages = [
      rowData.image_1, 
      rowData.image_2, 
      rowData.image_3, 
      rowData.image_4
    ].filter(img => img && img.toString().trim() !== '');
    
    variants.push({
      color: rowData.color.toString().trim(),
      size: rowData.size?.toString().trim() || 'Standard',
      price: rowData.price || 0,
      stock: rowData.stock || 0,
      images: variantImages
    });
  }

  return variants;
};

// Import products to database
const importProducts = async (req, res) => {
  try {
    const { products } = req.body;

    console.log('📥 Import request received for', products?.length || 0, 'products');

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No products to import'
      });
    }

    const results = {
      success: [],
      errors: []
    };

    for (const productData of products) {
      try {
        console.log(`🔄 Processing product: ${productData.product_name}`);
        
        // Ensure category exists in categories table
        const { data: existingCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('name', productData.category)
          .single();

        let categoryId;
        if (!existingCategory) {
          // Try to create new category using service client to bypass RLS
          const { data: newCategory, error: categoryError } = await supabaseService
            .from('categories')
            .insert({
              name: productData.category,
              slug: productData.category.toLowerCase().replace(/\s+/g, '-'),
              is_active: true
            })
            .select()
            .single();

          if (categoryError) {
            // If service client also fails, use fallback
            console.log(`Cannot create category "${productData.category}". Using fallback...`);
            
            const { data: fallbackCategories } = await supabase
              .from('categories')
              .select('id, name')
              .limit(1);
              
            if (fallbackCategories && fallbackCategories.length > 0) {
              categoryId = fallbackCategories[0].id;
              console.log(`Using fallback category: ${fallbackCategories[0].name}`);
            } else {
              throw new Error(`Cannot create category "${productData.category}" and no fallback categories available.`);
            }
          } else {
            categoryId = newCategory.id;
            console.log(`✅ Created new category: ${productData.category}`);
          }
        } else {
          categoryId = existingCategory.id;
        }

        // Process images
        const images = [];
        for (let i = 1; i <= 4; i++) {
          const imageField = `image_${i}`;
          if (productData[imageField] && productData[imageField].toString().trim() !== '') {
            images.push(productData[imageField].toString().trim());
          }
        }

        // Create product payload matching actual database schema
        const productPayload = {
          name: productData.product_name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          old_price: productData.sale_price || null,
          final_price: productData.sale_price || productData.price,
          category: categoryId,
          subcategory: productData.sub_category || null,
          sub_subcategory: productData.sub_sub_category || null,
          brand: productData.brand || null,
          short_description: productData.short_description || null,
          sku: productData.sku,
          weight: productData.weight || null,
          images: images.length > 0 ? images : [productData.image_1 || ''],
          image: productData.image_1 || '',
          stock: productData.stock,
          rating: 0,
          reviews: 0,
          is_new: false,
          is_limited_edition: false,
          is_blue_monday_sale: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Try to insert product with proper error handling
        let newProduct, productError;
        
        // First try with service client to bypass RLS
        try {
          if (supabaseService) {
            const result = await supabaseService
              .from('products')
              .insert(productPayload)
              .select()
              .single();
            newProduct = result.data;
            productError = result.error;
          } else {
            throw new Error('Service client not available');
          }
        } catch (serviceError) {
          console.log('Service client failed, trying regular client...');
          const result = await supabase
            .from('products')
            .insert(productPayload)
            .select()
            .single();
          newProduct = result.data;
          productError = result.error;
        }

        if (productError) {
          console.error('Database insertion error:', productError);
          throw new Error(`Failed to insert product: ${productError.message}`);
        }

        console.log(`✅ Successfully inserted product: ${productData.product_name} (ID: ${newProduct.id})`);

        // Create product images if needed (if you have a separate product_images table)
        if (images.length > 0) {
          const imageRecords = images.map((imageUrl, index) => ({
            product_id: newProduct.id,
            image_url: imageUrl,
            alt_text: `${productData.product_name} - Image ${index + 1}`,
            position: index,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          // Try to insert into product_images table if it exists
          try {
            await supabase
              .from('product_images')
              .insert(imageRecords);
            console.log(`✅ Added ${images.length} images for ${productData.product_name}`);
          } catch (imageError) {
            console.log('Product images table may not exist, skipping image records:', imageError.message);
          }
        }

        // Create variants if they exist (if you have a product_variants table)
        if (productData.variants && productData.variants.length > 0) {
          const variantRecords = productData.variants.map(variant => ({
            product_id: newProduct.id,
            color: variant.color,
            size: variant.size,
            price: variant.price,
            stock: variant.stock,
            sku: `${productData.sku}-${variant.color}-${variant.size}`.toUpperCase().replace(/\s+/g, '-'),
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          // Try to insert into product_variants table if it exists
          try {
            await supabase
              .from('product_variants')
              .insert(variantRecords);
            console.log(`✅ Added ${productData.variants.length} variants for ${productData.product_name}`);
          } catch (variantError) {
            console.log('Product variants table may not exist, skipping variant records:', variantError.message);
          }
        }

        results.success.push({
          name: productData.product_name,
          slug: productData.slug,
          id: newProduct.id
        });

      } catch (error) {
        console.error(`❌ Error importing ${productData.product_name}:`, error.message);
        results.errors.push({
          product: productData.product_name,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Import completed. ${results.success.length} products imported successfully, ${results.errors.length} failed.`,
      results
    });

  } catch (error) {
    console.error('Error importing products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import products',
      error: error.message
    });
  }
};

module.exports = {
  generateTemplate,
  parseExcelFile,
  importProducts
};
