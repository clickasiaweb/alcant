import React, { useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export default function DebugConsole() {
  useEffect(() => {
    // Force the categoryService to initialize and log
    console.log('🚀 DebugConsole: Page loaded, forcing API test...');
    
    const testApi = async () => {
      try {
        console.log('📡 DebugConsole: Testing categories API...');
        const categories = await categoryService.getCategoriesWithHierarchy();
        console.log('📊 DebugConsole: Categories result:', categories);
        
        console.log('📡 DebugConsole: Testing featured products API...');
        const products = await categoryService.getFeaturedProducts();
        console.log('📊 DebugConsole: Products result:', products);
        
      } catch (error) {
        console.error('❌ DebugConsole: API test failed:', error);
      }
    };
    
    testApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Console Debug Page</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">📋 Debug Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Open browser developer tools (F12)</li>
            <li>Go to the Console tab</li>
            <li>Look for logs starting with 🔧, 📡, 📊, 📁, ⭐, ❌</li>
            <li>Check the Network tab for failed requests</li>
            <li>Look for any red error messages</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">🔍 What to Look For</h2>
          <div className="space-y-2 text-blue-700">
            <p><strong>CategoryService initialization:</strong> Should show the API URL</p>
            <p><strong>Fetch requests:</strong> Should show the URLs being called</p>
            <p><strong>Response status:</strong> Should show HTTP status codes</p>
            <p><strong>Response data:</strong> Should show the actual data returned</p>
            <p><strong>Error messages:</strong> Any errors will be detailed here</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Expected Results</h2>
          <div className="space-y-2 text-green-700">
            <p>• API URL should be: http://localhost:5001/api</p>
            <p>• Categories endpoint: /categories/hierarchy</p>
            <p>• Featured products endpoint: /products/featured</p>
            <p>• Should return 4 categories with subcategories</p>
            <p>• Should return featured products data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
