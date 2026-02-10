const axios = require('axios');

async function testAdminCategories() {
  try {
    const response = await axios.get('http://localhost:5001/api/admin/categories');
    console.log('Response structure:');
    console.log('Keys:', Object.keys(response.data));
    console.log('Data type:', typeof response.data.data);
    console.log('Is array:', Array.isArray(response.data.data));
    console.log('Categories count:', response.data.data?.length || 0);
    console.log('Category names:');
    response.data.data?.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.id})`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAdminCategories();
