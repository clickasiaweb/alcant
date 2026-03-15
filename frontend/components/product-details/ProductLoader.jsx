import React from 'react';
import Layout from '../Layout';

const ProductLoader = () => {
  return (
    <Layout title="Loading...">
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    </Layout>
  );
};

export default ProductLoader;
