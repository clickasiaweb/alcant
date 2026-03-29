// Simple test to check if server is responding
const test = async () => {
  try {
    console.log('🧪 Testing server response...');
    
    const response = await fetch('http://localhost:5001/api/products/test-create');
    const text = await response.text();
    
    console.log('Response status:', response.status);
    console.log('Response text:', text);
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Success:', data);
    } else {
      console.log('❌ Error response:', text);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

test();
