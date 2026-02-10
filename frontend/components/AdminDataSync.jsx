import React, { useState } from 'react';

export default function AdminDataSync({ onRefresh, lastUpdated }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">Admin Data Sync</h4>
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>
      
      <div className="text-xs text-gray-600">
        <p>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
        <p className="mt-1">Auto-refresh: Every 30 seconds</p>
        <p className="mt-1">Also refreshes when you return to this tab</p>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Add categories, subcategories, or products in the admin panel and they'll appear here automatically!
        </p>
      </div>
    </div>
  );
}
