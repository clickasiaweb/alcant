// Test script to debug template download issue

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

async function testDownload() {
  console.log('Testing template download...');
  console.log('API URL:', API_BASE_URL);
  
  try {
    // Test with fetch first
    console.log('Testing with fetch...');
    const fetchResponse = await fetch(`${API_BASE_URL}/bulk-upload/template`);
    console.log('Fetch response status:', fetchResponse.status);
    console.log('Fetch response headers:', [...fetchResponse.headers.entries()]);
    
    if (!fetchResponse.ok) {
      throw new Error(`HTTP error! status: ${fetchResponse.status}`);
    }
    
    const blob = await fetchResponse.blob();
    console.log('Blob size:', blob.size);
    console.log('Blob type:', blob.type);
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'product-upload-template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Download successful with fetch!');
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
    
    // Try with axios as fallback
    try {
      console.log('Testing with axios...');
      const axios = require('axios');
      const axiosResponse = await axios.get(`${API_BASE_URL}/bulk-upload/template`, {
        responseType: 'blob'
      });
      
      console.log('Axios response status:', axiosResponse.status);
      console.log('Axios response data:', axiosResponse.data);
      
      const url = window.URL.createObjectURL(new Blob([axiosResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product-upload-template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Download successful with axios!');
      
    } catch (axiosError) {
      console.error('❌ Axios error:', axiosError);
    }
  }
}

// Run test if in browser
if (typeof window !== 'undefined') {
  testDownload();
}

module.exports = { testDownload };
