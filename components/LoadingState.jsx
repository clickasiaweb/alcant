import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ 
  type = 'spinner', 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50'
    : 'flex items-center justify-center';

  const overlayClasses = overlay 
    ? 'bg-black bg-opacity-50'
    : '';

  if (type === 'spinner') {
    return (
      <div className={`${containerClasses} ${overlayClasses}`}>
        <div className={`${sizeClasses[size]} spinner border-4 border-primary-600 border-t-transparent rounded-full`} />
        {text && (
          <span className="ml-3 text-gray-600 text-sm">{text}</span>
        )}
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`${containerClasses} ${overlayClasses} space-y-4`}>
        <div className="w-full h-8 bg-gray-200 rounded skeleton"></div>
        <div className="w-3/4 h-4 bg-gray-200 rounded skeleton"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded skeleton"></div>
        {text && (
          <span className="text-gray-400 text-sm">{text}</span>
        )}
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`${containerClasses} ${overlayClasses}`}>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
        {text && (
          <span className="ml-3 text-gray-600 text-sm">{text}</span>
        )}
      </div>
    );
  }

  return null;
};

export default LoadingState;
