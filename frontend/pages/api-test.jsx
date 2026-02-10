import React, { useState, useEffect } from 'react';

export default function ApiTest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        console.log('🔍 Testing API URL:', API_BASE_URL);
        
        // Test categories endpoint
        console.log('📡 Testing categories endpoint...');
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories/hierarchy`);
        console.log('📊 Categories response status:', categoriesResponse.status);
        
        if (!categoriesResponse.ok) {
          throw new Error(`Categories API failed: ${categoriesResponse.status}`);
        }
        
        const categoriesData = await categoriesResponse.json();
        console.log('📁 Categories data:', categoriesData);
        
        // Test featured products endpoint
        console.log('📡 Testing featured products endpoint...');
        const productsResponse = await fetch(`${API_BASE_URL}/products/featured`);
        console.log('📊 Products response status:', productsResponse.status);
        
        if (!productsResponse.ok) {
          throw new Error(`Products API failed: ${productsResponse.status}`);
        }
        
        const productsData = await productsResponse.json();
        console.log('⭐ Products data:', productsData);
        
        setData({
          categories: categoriesData,
          products: productsData,
          apiBaseUrl: API_BASE_URL
        });
        
      } catch (err) {
        console.error('❌ API Test Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Testing API connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-red-800 mb-4">❌ API Connection Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">Check the browser console for more details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">✅ API Connection Test</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">🎉 Connection Successful!</h2>
          <p className="text-green-700">API Base URL: {data?.apiBaseUrl}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📁 Categories</h3>
            <p className="text-sm text-gray-600 mb-4">
              Found {data?.categories?.data?.length || 0} categories
            </p>
            <div className="space-y-2">
              {data?.categories?.data?.map((category) => (
                <div key={category.id} className="text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-gray-500 ml-2">
                    ({category.subcategories?.length || 0} subcategories)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⭐ Featured Products</h3>
            <p className="text-sm text-gray-600 mb-4">
              Found {data?.products?.data?.length || 0} featured products
            </p>
            <div className="space-y-2">
              {data?.products?.data?.map((product) => (
                <div key={product.id} className="text-sm">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-gray-500 ml-2">${product.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 Debug Info</h3>
          <p className="text-sm text-blue-700">
            Check the browser console (F12) for detailed API request logs.
          </p>
        </div>
      </div>
    </div>
  );
}
