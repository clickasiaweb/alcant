const XLSX = require('xlsx');
const fs = require('fs');

// Test template generation
function createTestTemplate() {
  console.log('🧪 Creating test template...');
  
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Categories data
    const categoriesData = [
      {
        'Category Name': 'Test Category',
        'Category Slug': 'test-category',
        'Description': 'Test category description',
        'Image URL': 'https://example.com/test.jpg',
        'Sort Order': 1,
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
        'Example': 'Test Category'
      }
    ];

    const instructionsWS = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Write file
    fs.writeFileSync('test-template-validation.xlsx', buf);
    
    console.log('✅ Test template created successfully');
    console.log(`   File size: ${buf.length} bytes`);
    console.log(`   Sheets: ${Object.keys(wb.Sheets).join(', ')}`);
    
    // Verify file can be read back
    const verifyWb = XLSX.readFile('test-template-validation.xlsx');
    const verifyData = XLSX.utils.sheet_to_json(verifyWb.Sheets['Categories']);
    console.log('✅ File verification successful');
    console.log(`   Categories found: ${verifyData.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Template creation failed:', error.message);
    return false;
  }
}

// Run the test
createTestTemplate();
