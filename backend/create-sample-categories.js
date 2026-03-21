const XLSX = require('xlsx');
const fs = require('fs');

// Create a sample Excel file for testing category bulk upload
function createSampleCategoryFile() {
  console.log('📊 Creating sample category Excel file...');

  // Create workbook
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
    },
    {
      'Subcategory Name': "Men's Clothing",
      'Subcategory Slug': 'mens-clothing',
      'Category Name': 'Fashion',
      'Description': "Men's fashion and clothing",
      'Image URL': 'https://example.com/mens-clothing.jpg',
      'Sort Order': 1,
      'Is Active': 'TRUE'
    },
    {
      'Subcategory Name': "Women's Clothing",
      'Subcategory Slug': 'womens-clothing',
      'Category Name': 'Fashion',
      'Description': "Women's fashion and clothing",
      'Image URL': 'https://example.com/womens-clothing.jpg',
      'Sort Order': 2,
      'Is Active': 'TRUE'
    }
  ];

  const subcategoriesWS = XLSX.utils.json_to_sheet(subcategoriesData);
  XLSX.utils.book_append_sheet(wb, subcategoriesWS, 'Subcategories');

  // Sub-Subcategories sheet
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
    },
    {
      'Sub-Subcategory Name': 'MacBook',
      'Sub-Subcategory Slug': 'macbook',
      'Category Name': 'Electronics',
      'Subcategory Name': 'Laptops',
      'Description': 'Apple MacBook laptops',
      'Image URL': 'https://example.com/macbook.jpg',
      'Sort Order': 1,
      'Is Active': 'TRUE'
    },
    {
      'Sub-Subcategory Name': 'Dell Inspiron',
      'Sub-Subcategory Slug': 'dell-inspiron',
      'Category Name': 'Electronics',
      'Subcategory Name': 'Laptops',
      'Description': 'Dell Inspiron laptops',
      'Image URL': 'https://example.com/dell-inspiron.jpg',
      'Sort Order': 2,
      'Is Active': 'TRUE'
    }
  ];

  const subSubcategoriesWS = XLSX.utils.json_to_sheet(subSubcategoriesData);
  XLSX.utils.book_append_sheet(wb, subSubcategoriesWS, 'Sub-Subcategories');

  // Generate buffer
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  // Write file
  fs.writeFileSync('sample-categories.xlsx', buf);
  
  console.log('✅ Sample category file created: sample-categories.xlsx');
  console.log(`   File size: ${buf.length} bytes`);
  console.log(`   Categories: ${categoriesData.length}`);
  console.log(`   Subcategories: ${subcategoriesData.length}`);
  console.log(`   Sub-subcategories: ${subSubcategoriesData.length}`);
}

// Create the file
createSampleCategoryFile();
