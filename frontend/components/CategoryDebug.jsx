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

      // Test 2: Get products by category ID (the correct way)
      const categoryMapping = {
        'phone-case': 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be',
        'iphone-cases': 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be',
        'accessories': '883e60ba-b93d-4cb8-ab9e-680ac6bd6575',
        'car-travel': '10ed20c8-b707-471c-be22-fe4ed960e1cd',
        'yoga': '824e190f-b8f0-41e1-be24-da03ba52faa9',
        'travel': '73f3c2de-7ab8-4166-a351-671969411301'
      };
      
      const categoryId = categoryMapping[collection];
      info.categoryId = categoryId;
      
      try {
        const categoryProducts = await getProducts({ categoryId: categoryId });
        let productCount = 0;
        if (Array.isArray(categoryProducts)) {
          productCount = categoryProducts.length;
        } else if (categoryProducts?.products && Array.isArray(categoryProducts.products)) {
          productCount = categoryProducts.products.length;
        } else if (categoryProducts?.data && Array.isArray(categoryProducts.data)) {
          productCount = categoryProducts.data.length;
        }
        info.categoryProductsCount = productCount;
        info.apiCalls.push(`✅ getProducts(categoryId: "${categoryId}") - ${productCount} products`);
      } catch (error) {
        info.apiCalls.push(`❌ getProducts(categoryId: "${categoryId}") - ${error.message}`);
      }

      // Test 3: Try getByCategory (old way for comparison)
      try {
        const byCategoryProducts = await productsAPI.getByCategory(collection);
        info.byCategoryCount = Array.isArray(byCategoryProducts) ? byCategoryProducts.length : 0;
        info.apiCalls.push(`✅ getByCategory("${collection}") - ${info.byCategoryCount} products`);
      } catch (error) {
        info.apiCalls.push(`❌ getByCategory("${collection}") - ${error.message}`);
      }

      // Test 4: Try with category slug (old way)
      try {
        const slugProducts = await getProducts({ category: collection });
        const slugCount = Array.isArray(slugProducts) ? slugProducts.length : 
                         (slugProducts?.data && Array.isArray(slugProducts.data)) ? slugProducts.data.length : 0;
        info.apiCalls.push(`✅ getProducts(category: "${collection}") - ${slugCount} products`);
      } catch (error) {
        info.apiCalls.push(`❌ getProducts(category: "${collection}") - ${error.message}`);
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
        <p><strong>Category ID:</strong> {debugInfo.categoryId || 'Not found'}</p>
        <p><strong>All Products:</strong> {debugInfo.allProductsCount || 0}</p>
        <p><strong>Category Products (ID):</strong> {debugInfo.categoryProductsCount || 0}</p>
        <p><strong>By Category (Slug):</strong> {debugInfo.byCategoryCount || 0}</p>
        
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
