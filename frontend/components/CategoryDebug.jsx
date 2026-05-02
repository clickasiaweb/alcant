import React, { useState, useEffect } from 'react';
import { getProducts, productsAPI } from '../services/api';

const CategoryDebug = ({ collection }) => {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (collection) {
      debugCategory();
    }
  }, [collection]);

  const debugCategory = async () => {
    setLoading(true);
    const info = {
      collectionSlug: collection,
      apiCalls: []
    };

    try {
      // Test 1: Get all products
      try {
        const allProducts = await productsAPI.getAll();
        info.allProductsCount = Array.isArray(allProducts) ? allProducts.length : 0;
        info.apiCalls.push('✅ getAll() - Success');
        
        // Analyze category structure
        const categories = {};
        (Array.isArray(allProducts) ? allProducts : []).forEach(product => {
          const cat = product.category || 'uncategorized';
          categories[cat] = (categories[cat] || 0) + 1;
        });
        info.categoryBreakdown = categories;
      } catch (error) {
        info.apiCalls.push(`❌ getAll() - ${error.message}`);
      }

      // Test 2: Get products by category slug
      try {
        const categoryProducts = await getProducts({ category: collection });
        info.categoryProductsCount = Array.isArray(categoryProducts) ? categoryProducts.length : 
                                  (categoryProducts?.data && Array.isArray(categoryProducts.data)) ? categoryProducts.data.length : 0;
        info.apiCalls.push(`✅ getProducts(category: "${collection}") - ${info.categoryProductsCount} products`);
      } catch (error) {
        info.apiCalls.push(`❌ getProducts(category: "${collection}") - ${error.message}`);
      }

      // Test 3: Try getByCategory
      try {
        const byCategoryProducts = await productsAPI.getByCategory(collection);
        info.byCategoryCount = Array.isArray(byCategoryProducts) ? byCategoryProducts.length : 0;
        info.apiCalls.push(`✅ getByCategory("${collection}") - ${info.byCategoryCount} products`);
      } catch (error) {
        info.apiCalls.push(`❌ getByCategory("${collection}") - ${error.message}`);
      }

      // Test 4: Try alternative names
      const alternatives = [
        collection.replace('-', ' '),
        collection.replace('-', ''),
        collection.charAt(0).toUpperCase() + collection.slice(1)
      ];
      
      for (const alt of alternatives) {
        try {
          const altProducts = await getProducts({ category: alt });
          const count = Array.isArray(altProducts) ? altProducts.length : 
                       (altProducts?.data && Array.isArray(altProducts.data)) ? altProducts.data.length : 0;
          if (count > 0) {
            info.apiCalls.push(`✅ Alternative "${alt}" - ${count} products`);
            info.workingAlternative = alt;
            break;
          }
        } catch (error) {
          // Skip failed alternatives
        }
      }

    } catch (error) {
      info.error = error.message;
    }

    setDebugInfo(info);
    setLoading(false);
  };

  if (loading) {
    return <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">Loading debug info...</div>;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
      <h3 className="text-sm font-bold text-yellow-800 mb-2">🔍 Category Debug Info</h3>
      
      <div className="text-xs space-y-1">
        <p><strong>Collection Slug:</strong> {debugInfo.collectionSlug}</p>
        <p><strong>All Products:</strong> {debugInfo.allProductsCount || 0}</p>
        <p><strong>Category Products:</strong> {debugInfo.categoryProductsCount || 0}</p>
        <p><strong>By Category:</strong> {debugInfo.byCategoryCount || 0}</p>
        
        {debugInfo.workingAlternative && (
          <p><strong>✅ Working Alternative:</strong> "{debugInfo.workingAlternative}"</p>
        )}
        
        <div className="mt-2">
          <strong>API Calls:</strong>
          <ul className="ml-4 list-disc">
            {debugInfo.apiCalls?.map((call, i) => (
              <li key={i} className="text-xs">{call}</li>
            ))}
          </ul>
        </div>

        {debugInfo.categoryBreakdown && (
          <div className="mt-2">
            <strong>Available Categories:</strong>
            <ul className="ml-4 list-disc">
              {Object.entries(debugInfo.categoryBreakdown).map(([cat, count]) => (
                <li key={cat} className="text-xs">{cat}: {count} products</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDebug;
