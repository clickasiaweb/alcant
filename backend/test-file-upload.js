const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testFileUpload() {
  try {
    console.log('🧪 Testing file upload endpoint...');
    
    // Create a simple test Excel file content
    const testExcelContent = `product_name,slug,description,short_description,brand,category,sub_category,sub_sub_category,price,sale_price,stock,sku,color,size,weight,image_1,image_2,image_3,image_4
Test Product,test-product,Premium test product,Short description,Test Brand,Electronics,Mobile Accessories,Phone Cases,99.99,79.99,50,TEST-SKU-001,Black,Standard,200,https://example.com/image1.jpg,https://example.com/image2.jpg,,`;
    
    // Write test file
    fs.writeFileSync('test-upload.xlsx', testExcelContent);
    console.log('📄 Test Excel file created');
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream('test-upload.xlsx'));
    
    console.log('📤 Uploading to http://localhost:5001/api/bulk-upload/parse');
    
    // Test upload
    const response = await axios.post('http://localhost:5001/api/bulk-upload/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      maxBodyLength: 10 * 1024 * 1024, // 10MB
      timeout: 30000
    });
    
    console.log('✅ Upload response:', response.data);
    console.log('📊 Parsed products:', response.data.data?.products?.length || 0);
    console.log('❌ Errors:', response.data.data?.errors?.length || 0);
    
    // Clean up
    fs.unlinkSync('test-upload.xlsx');
    console.log('🧹 Test file cleaned up');
    
  } catch (error) {
    console.error('❌ Upload test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFileUpload();
