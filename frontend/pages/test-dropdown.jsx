import React, { useState } from 'react';
import DynamicHeader from '../components/DynamicHeader';
import AdminDataSync from '../components/AdminDataSync';

export default function TestDropdown() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleAdminRefresh = () => {
    // This will trigger the DynamicHeader to refresh
    setRefreshKey(prev => prev + 1);
    window.dispatchEvent(new Event('admin-data-updated'));
  };

  return (
    <div>
      <DynamicHeader key={refreshKey} />
      <AdminDataSync onRefresh={handleAdminRefresh} lastUpdated={Date.now()} />
      
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Dynamic Dropdown Test Page
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ✅ Real-Time Admin Panel Integration
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Categories, subcategories, and sub-subcategories sync automatically
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Featured products update in real-time
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Auto-refresh every 30 seconds
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Manual refresh available
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Refreshes when you return to the browser tab
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📋 How to Test Real-Time Updates
            </h2>
            <ol className="space-y-2 text-gray-600">
              <li>1. Open the admin panel in another tab: <a href="http://localhost:3001" target="_blank" className="text-blue-600 underline">Admin Panel</a></li>
              <li>2. Add a new category, subcategory, or sub-subcategory</li>
              <li>3. Add a new product and mark it as featured</li>
              <li>4. Watch the dropdown update automatically (within 30 seconds)</li>
              <li>5. Or click "Refresh Now" in the sync widget for instant updates</li>
              <li>6. Switch browser tabs and back - it will auto-refresh!</li>
            </ol>
          </div>

          <div className="bg-yellow-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔄 Sync Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded">
                <h3 className="font-semibold mb-2">Automatic Updates</h3>
                <p className="text-sm text-gray-600">Data refreshes every 30 seconds automatically</p>
              </div>
              <div className="bg-white p-4 rounded">
                <h3 className="font-semibold mb-2">Tab Focus Detection</h3>
                <p className="text-sm text-gray-600">Refreshes when you return to the browser tab</p>
              </div>
              <div className="bg-white p-4 rounded">
                <h3 className="font-semibold mb-2">Manual Refresh</h3>
                <p className="text-sm text-gray-600">Click the refresh button for instant updates</p>
              </div>
              <div className="bg-white p-4 rounded">
                <h3 className="font-semibold mb-2">Live Data</h3>
                <p className="text-sm text-gray-600">Shows exactly what's in your database</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🎯 Admin Panel Integration
            </h2>
            <p className="text-gray-600 mb-4">
              The header dropdown now shows real-time data from your admin panel:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded text-center">
                <div className="text-2xl mb-2">📁</div>
                <h3 className="font-semibold">Categories</h3>
                <p className="text-sm text-gray-600">Created in admin panel → appears in dropdown</p>
              </div>
              <div className="bg-white p-4 rounded text-center">
                <div className="text-2xl mb-2">📂</div>
                <h3 className="font-semibold">Subcategories</h3>
                <p className="text-sm text-gray-600">Nested under categories automatically</p>
              </div>
              <div className="bg-white p-4 rounded text-center">
                <div className="text-2xl mb-2">📄</div>
                <h3 className="font-semibold">Sub-subcategories</h3>
                <p className="text-sm text-gray-600">Deep nesting supported</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
