import React from 'react';
import { Grid } from 'lucide-react';
import Link from 'next/link';

const ViewAllProductsButton = ({ href = '/products', className = '', onClick }) => {
  const ButtonContent = () => (
    <>
      <Grid className="w-5 h-5 mr-2" />
      View All Products
    </>
  );

  const buttonClasses = `
    bg-blue-600 
    text-white 
    px-6 py-3 
    rounded-lg 
    font-semibold 
    hover:bg-blue-700 
    transition-colors 
    duration-200 
    inline-flex 
    items-center 
    justify-center
    shadow-md
    hover:shadow-lg
    ${className}
  `.trim();

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={buttonClasses}
      >
        <ButtonContent />
      </button>
    );
  }

  return (
    <Link href={href} className={buttonClasses}>
      <ButtonContent />
    </Link>
  );
};

export default ViewAllProductsButton;
