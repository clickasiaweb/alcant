import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const APITest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      console.log('Testing API connection...');
      const data = await productsAPI.getNew();
      console.log('API Response:', data);
      setTestResult({
        success: true,
        data: data,
        message: `Found ${data.products?.length || 0} products`
      });
    } catch (error) {
      console.error('API Test Error:', error);
      setTestResult({
        success: false,
        error: error.message,
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
      
      <button
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>

      {testResult && (
        <div className={`mt-4 p-4 rounded ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <h3 className="font-semibold mb-2">
            {testResult.success ? '✅ API Connected Successfully' : '❌ API Connection Failed'}
          </h3>
          {testResult.success ? (
            <div>
              <p>{testResult.message}</p>
              <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <p>Error: {testResult.error}</p>
              {testResult.details && (
                <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(testResult.details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>Check the browser console (F12) for detailed logs.</p>
      </div>
    </div>
  );
};

export default APITest;
