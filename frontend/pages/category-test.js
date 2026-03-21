import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export default function CategoryTest() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testCategories = async () => {
      try {
        setLoading(true);
        console.log('🔍 Testing category service...');
        const response = await categoryService.getCategoriesWithHierarchy();
        console.log('📁 Category response:', response);
        setCategories(response.data || []);
        setError(null);
      } catch (err) {
        console.error('❌ Category error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testCategories();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Category Test Page</h1>
      
      {loading && <p>Loading categories...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Environment Variables:</h2>
        <p>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</p>
        <p>API URL used by service: http://localhost:5001/api</p>
      </div>

      <div className="bg-white border rounded p-4">
        <h2 className="font-bold mb-2">Categories Loaded: {categories.length}</h2>
        
        {categories.map((category, index) => (
          <div key={category.id} className="mb-4 p-3 border rounded">
            <h3 className="font-bold">{index + 1}. {category.name}</h3>
            <p>Slug: {category.slug}</p>
            
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="ml-4 mt-2">
                <h4 className="font-semibold">Subcategories ({category.subcategories.length}):</h4>
                {category.subcategories.map((sub) => (
                  <div key={sub.id} className="ml-4 mt-1 p-2 bg-gray-50 rounded">
                    <p className="font-medium">• {sub.name}</p>
                    
                    {sub.sub_subcategories && sub.sub_subcategories.length > 0 && (
                      <div className="ml-4 mt-1">
                        <h5 className="font-semibold text-sm">Sub-subcategories ({sub.sub_subcategories.length}):</h5>
                        {sub.sub_subcategories.map((subSub) => (
                          <div key={subSub.id} className="ml-4 mt-1 p-1 bg-gray-100 rounded">
                            <p className="text-sm">• {subSub.name}</p>
                            
                            {subSub.sub3_categories && subSub.sub3_categories.length > 0 && (
                              <div className="ml-4 mt-1">
                                <h6 className="font-semibold text-xs">Sub3 categories ({subSub.sub3_categories.length}):</h6>
                                {subSub.sub3_categories.map((sub3) => (
                                  <div key={sub3.id} className="ml-4 mt-1">
                                    <p className="text-xs text-gray-600">• {sub3.name}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
