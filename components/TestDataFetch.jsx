import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export default function TestDataFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getCategoriesWithHierarchy();
        console.log('🔍 Raw API Response:', response);
        setData(response);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Fetch Test</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Raw API Response:</h2>
        <pre className="text-xs overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {data?.data && (
        <div className="space-y-4">
          {data.data.map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              
              <div className="ml-4">
                <h4 className="font-medium mb-2">Subcategories:</h4>
                {category.subcategories?.map((sub) => (
                  <div key={sub.id} className="ml-4 mb-2 p-2 bg-gray-50 rounded">
                    <div className="font-medium">{sub.name}</div>
                    <div className="text-sm text-gray-600">Slug: {sub.slug}</div>
                    
                    <div className="ml-4 mt-2">
                      <div className="text-sm font-medium text-blue-600">
                        Sub-subcategories ({sub.sub_subcategories?.length || 0}):
                      </div>
                      {sub.sub_subcategories?.map((subSub) => (
                        <div key={subSub.id} className="ml-4 text-sm text-gray-700">
                          • {subSub.name} (Slug: {subSub.slug})
                        </div>
                      ))}
                      {(!sub.sub_subcategories || sub.sub_subcategories.length === 0) && (
                        <div className="ml-4 text-sm text-gray-400 italic">
                          No sub-subcategories
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
