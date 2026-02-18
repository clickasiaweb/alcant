import React, { useEffect, useState } from 'react';

export default function SimpleFetchTest() {
  const [result, setResult] = useState('Loading...');

  useEffect(() => {
    const testBasicFetch = async () => {
      try {
        console.log('🚀 SimpleFetchTest: Starting basic fetch test...');
        
        // Test 1: Basic fetch to backend health endpoint
        console.log('📡 Testing backend health...');
        const healthResponse = await fetch('http://localhost:5001/api/health');
        console.log('📊 Health response status:', healthResponse.status);
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('✅ Health check success:', healthData);
          setResult('✅ Backend is reachable!');
        } else {
          throw new Error(`Health check failed: ${healthResponse.status}`);
        }

        // Test 2: Categories endpoint
        console.log('📡 Testing categories endpoint...');
        const categoriesResponse = await fetch('http://localhost:5001/api/categories/hierarchy');
        console.log('📊 Categories response status:', categoriesResponse.status);
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          console.log('✅ Categories success:', categoriesData);
          setResult(`✅ Backend reachable! Found ${categoriesData.data?.length || 0} categories.`);
        } else {
          const errorText = await categoriesResponse.text();
          console.error('❌ Categories failed:', errorText);
          throw new Error(`Categories failed: ${categoriesResponse.status} - ${errorText}`);
        }

      } catch (error) {
        console.error('❌ SimpleFetchTest: Error:', error);
        setResult(`❌ Error: ${error.message}`);
      }
    };

    testBasicFetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">🔍 Simple Fetch Test</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-lg mb-4">{result}</div>
          <p className="text-sm text-gray-600">
            Check browser console (F12) for detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}
