import React from 'react';

export default function TestCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Test Category Page</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Success!</h2>
          <p className="text-green-700">
            If you can see this page, the category routing is working correctly.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">🔍 Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Check the console for category page logs</li>
            <li>Verify the API calls are working</li>
            <li>Test with the actual category IDs</li>
          </ol>
        </div>

        <div className="mt-8">
          <a href="/" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
