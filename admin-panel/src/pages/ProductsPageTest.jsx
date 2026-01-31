import React, { useState, useEffect } from "react";
import SidebarNoAuth from "../components/SidebarNoAuth";

export default function ProductsPageTest() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Test ProductsPage: Component mounted');
    
    // Test with mock data first
    const mockProducts = [
      { id: 1, name: 'Test Product 1', price: 99.99, is_active: true },
      { id: 2, name: 'Test Product 2', price: 149.99, is_active: true }
    ];
    
    setTimeout(() => {
      console.log('Test ProductsPage: Setting mock data');
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <SidebarNoAuth />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SidebarNoAuth />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products Management (Test)</h1>
          <p className="text-gray-600 mt-2">Test page with mock data</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
          {products.map(product => (
            <div key={product.id} className="border-b p-4">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-gray-600">Price: ${product.price}</p>
              <p className="text-gray-600">Status: {product.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
