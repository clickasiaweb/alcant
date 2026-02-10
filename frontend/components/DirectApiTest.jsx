import React, { useState, useEffect } from 'react';

export default function DirectApiTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testDirectFetch = async () => {
      try {
        setLoading(true);
        
        console.log('🔍 Testing direct fetch to categories API...');
        
        // Direct fetch without any service layer
        const response = await fetch('http://localhost:5001/api/categories/hierarchy', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📁 Response data:', data);
        
        setResult({
          success: true,
          status: response.status,
          data: data,
          categoriesCount: data?.data?.length || 0
        });
        
      } catch (error) {
        console.error('❌ Direct fetch error:', error);
        setResult({
          success: false,
          error: error.message,
          stack: error.stack
        });
      } finally {
        setLoading(false);
      }
    };

    testDirectFetch();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Testing direct API connection...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">🔍 Direct API Test</h2>
      
      {result?.success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Success!</h3>
          <p className="text-green-700">Status: {result.status}</p>
          <p className="text-green-700">Categories found: {result.categoriesCount}</p>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Categories:</h4>
            <div className="space-y-1">
              {result.data?.data?.map((category) => (
                <div key={category.id} className="text-sm">
                  • {category.name} ({category.subcategories?.length || 0} subcategories)
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
          <p className="text-red-700">{result?.error}</p>
          {result?.stack && (
            <details className="mt-2">
              <summary className="text-sm text-red-600 cursor-pointer">Stack trace</summary>
              <pre className="text-xs text-red-500 mt-2 whitespace-pre-wrap">
                {result.stack}
              </pre>
            </details>
          )}
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          💡 Check the browser console (F12) for detailed request logs.
        </p>
      </div>
    </div>
  );
}
