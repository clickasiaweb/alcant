import React from 'react';
import Link from 'next/link';

const ProductBreadcrumb = ({ displayName }) => {
  return (
    <nav className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
        <li>/</li>
        <li><Link href="/products" className="hover:text-primary-600">Products</Link></li>
        <li>/</li>
        <li className="text-gray-900">{displayName}</li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;
