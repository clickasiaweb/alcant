const XLSX = require('xlsx');
const formidable = require('formidable');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const SubSubCategory = require('../models/SubSubCategory');
const ProductVariant = require('../models/ProductVariant');
const ProductImage = require('../models/ProductImage');

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
      filter: function ({ mimetype }) {
        return mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
               mimetype === 'application/vnd.ms-excel' ||
               mimetype === 'text/csv';
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
      
      try {
        // Read Excel file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames.includes('products') ? 'products' : workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

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
            rowData[header] = row[index];
          });

          // Validate required fields
          const validationErrors = validateProductRow(rowData, i + 2); // +2 because Excel rows are 1-indexed and header is row 1
          
          if (validationErrors.length > 0) {
            errors.push(...validationErrors);
            continue;
          }

          // Check for duplicate slug and SKU
          const existingProduct = await Product.findOne({
            $or: [
              { slug: rowData.slug },
              { sku: rowData.sku }
            ]
          });

          if (existingProduct) {
            if (existingProduct.slug === rowData.slug) {
              errors.push({
                row: i + 2,
                field: 'slug',
                message: `Slug "${rowData.slug}" already exists`
              });
            }
            if (existingProduct.sku === rowData.sku) {
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

          products.push({
            ...rowData,
            variants,
            rowIndex: i + 2
          });
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
        res.status(500).json({
          success: false,
          message: 'Failed to parse Excel file',
          error: parseError.message
        });
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
const validateProductRow = (rowData, rowNumber) => {
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
  const price = parseFloat(rowData.price);
  if (isNaN(price) || price < 0) {
    errors.push({
      row: rowNumber,
      field: 'price',
      message: 'Price must be a valid positive number'
    });
  }

  // Stock validation
  const stock = parseInt(rowData.stock);
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
        variants.push({
          color: colors[i],
          size: sizes[i],
          price: prices[i],
          stock: stocks[i]
        });
      }
    }
  }

  return variants;
};

// Import products to database
const importProducts = async (req, res) => {
  try {
    const { products } = req.body;

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
        // Ensure category exists
        let category = await Category.findOne({ name: productData.category });
        if (!category) {
          category = new Category({
            name: productData.category,
            slug: productData.category.toLowerCase().replace(/\s+/g, '-'),
            isActive: true
          });
          await category.save();
        }

        // Process images
        const images = [];
        for (let i = 1; i <= 4; i++) {
          const imageField = `image_${i}`;
          if (productData[imageField] && productData[imageField].toString().trim() !== '') {
            images.push(productData[imageField].toString().trim());
          }
        }

        // Create product
        const product = new Product({
          name: productData.product_name,
          slug: productData.slug,
          description: productData.description,
          shortDescription: productData.short_description,
          brand: productData.brand,
          category: productData.category,
          subcategory: productData.sub_category || '',
          subSubCategory: productData.sub_sub_category || '',
          price: parseFloat(productData.price),
          salePrice: productData.sale_price ? parseFloat(productData.sale_price) : undefined,
          oldPrice: productData.sale_price ? parseFloat(productData.sale_price) : undefined,
          sku: productData.sku,
          stock: parseInt(productData.stock) || 0,
          color: productData.color,
          size: productData.size,
          weight: productData.weight ? parseFloat(productData.weight) : undefined,
          images: images,
          image: images[0] || '',
          isActive: true
        });

        await product.save();

        // Create product images with positions
        for (let i = 0; i < images.length; i++) {
          const productImage = new ProductImage({
            product: product._id,
            imageUrl: images[i],
            position: i,
            altText: `${productData.product_name} - Image ${i + 1}`
          });
          await productImage.save();
        }

        // Create variants if they exist
        if (productData.variants && productData.variants.length > 0) {
          for (const variant of productData.variants) {
            const variantSku = `${productData.sku}-${variant.color}-${variant.size}`.toUpperCase().replace(/\s+/g, '-');
            const productVariant = new ProductVariant({
              product: product._id,
              color: variant.color,
              size: variant.size,
              price: variant.price,
              stock: variant.stock,
              sku: variantSku
            });
            await productVariant.save();
          }
        }
        results.success.push({
          name: productData.product_name,
          slug: productData.slug,
          id: product._id
        });

      } catch (error) {
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
