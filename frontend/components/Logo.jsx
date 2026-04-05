import React from 'react';
import Link from 'next/link';

const Logo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10", 
    large: "w-12 h-12"
  };

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="relative">
        {/* Main Logo Container */}
        <div className={`relative ${sizeClasses[size]} bg-primary-900 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-primary-800 group`}>
          {/* Alcantara Logo Image */}
          <img 
            src="/alcant.png" 
            alt="Alcantara Logo"
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              console.error('Logo image failed to load:', e);
            }}
            onLoad={() => {
              console.log('Logo loaded successfully');
            }}
          />
          
          {/* Premium Indicators */}
          <div className="absolute -top-1 -right-1 flex space-x-0.5">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
        
        {/* Brand Name */}
        <div className="ml-3 text-primary-900 font-semibold text-lg leading-tight hidden sm:inline">
          ΛʟcΛɴᴛ
        </div>
      </div>
      
      {/* Hover Effect Enhancement */}
      <div className="absolute inset-0 bg-primary-800 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    </Link>
  );
};

export default Logo;
