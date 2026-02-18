import React from 'react';
import DirectApiTest from '../components/DirectApiTest';

export default function DirectTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Direct API Connection Test</h1>
        <DirectApiTest />
      </div>
    </div>
  );
}
