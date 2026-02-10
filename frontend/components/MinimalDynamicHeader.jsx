import React, { useState, useEffect } from 'react';

export default function MinimalDynamicHeader() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Minimal header: Starting data fetch...');
        
        // Direct fetch to test
        const response = await fetch('http://localhost:5001/api/categories/hierarchy');
        console.log('📊 Minimal header: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📁 Minimal header: Categories data:', data);
        
        setCategories(data.data || []);
        console.log('✅ Minimal header: Data loaded successfully');
        
      } catch (err) {
        console.error('❌ Minimal header: Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto">
          <div className="text-center">Loading categories...</div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="bg-red-50 border-b border-red-200 p-4">
        <div className="container mx-auto">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Alcantara Store</div>
          
          <nav className="flex space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            
            {/* Products dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 flex items-center">
                Products ▼
              </button>
              
              {categories.length > 0 && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg p-4 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id}>
                        <a 
                          href={`/category/${category.slug}`}
                          className="block font-medium text-gray-900 hover:text-blue-600 mb-1"
                        >
                          {category.name}
                        </a>
                        
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="ml-4 space-y-1">
                            {category.subcategories.map((sub) => (
                              <a 
                                key={sub.id}
                                href={`/category/${category.slug}?subcategory=${sub.slug}`}
                                className="block text-sm text-gray-600 hover:text-blue-600"
                              >
                                {sub.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <a href="/collections" className="text-gray-700 hover:text-blue-600">Collections</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          </nav>
          
          <div className="text-sm text-gray-600">
            {categories.length} categories loaded
          </div>
        </div>
      </div>
    </header>
  );
}
