import React from 'react';
import Layout from '../Layout';
import Link from 'next/link';

const ProductNotFound = () => {
  return (
    <Layout title="Product Not Found">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you are looking for does not exist.</p>
          <Link href="/products" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
            Back to Products
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ProductNotFound;
