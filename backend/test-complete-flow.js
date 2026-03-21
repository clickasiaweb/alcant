const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Test the complete category bulk upload flow
async function testCompleteUploadFlow() {
  try {
    console.log('🧪 Testing Complete Category Bulk Upload Flow...\n');

    // Step 1: Download template
    console.log('1. Downloading template...');
    const templateResponse = await axios.get('http://localhost:3000/api/categories/bulk/template', {
      responseType: 'arraybuffer'
    });
    
    // Save template
    fs.writeFileSync('test-template.xlsx', templateResponse.data);
    console.log('✅ Template downloaded and saved');

    // Step 2: Test upload with the template file
    console.log('\n2. Testing upload with template file...');
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream('test-template.xlsx'), {
      filename: 'test-template.xlsx',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const uploadResponse = await axios.post('http://localhost:3000/api/categories/bulk/upload', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('✅ Upload successful!');
    console.log('📊 Results:');
    console.log(`   Total Created: ${uploadResponse.data.totalCreated}`);
    console.log(`   Total Errors: ${uploadResponse.data.totalErrors}`);
    
    if (uploadResponse.data.results) {
      console.log('\n📋 Detailed Results:');
      console.log(`   Categories: ${uploadResponse.data.results.categories.created} created, ${uploadResponse.data.results.categories.errors.length} errors`);
      console.log(`   Subcategories: ${uploadResponse.data.results.subcategories.created} created, ${uploadResponse.data.results.subcategories.errors.length} errors`);
      console.log(`   Sub-subcategories: ${uploadResponse.data.results.subSubcategories.created} created, ${uploadResponse.data.results.subSubcategories.errors.length} errors`);
    }

    // Step 3: Test database retrieval
    console.log('\n3. Testing database retrieval...');
    const categoriesResponse = await axios.get('http://localhost:3000/api/categories');
    console.log(`✅ Retrieved ${categoriesResponse.data.length} categories from database`);

    console.log('\n🎉 Complete flow test successful!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testCompleteUploadFlow();
