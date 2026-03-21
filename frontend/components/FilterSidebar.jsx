import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const FilterSidebar = ({ onFilterChange, filters }) => {
  const [expandedSections, setExpandedSections] = useState({
    color: true,
    iphoneModel: false,
    typeCase: false,
    magSafe: false,
    partnership: false
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [magSafeEnabled, setMagSafeEnabled] = useState(false);

  const colors = [
    '#3D3D3D', // Dark Grey
    '#1A5C2A', // Dark Green
    '#1E3A8A', // Dark Blue
    '#9CA3AF', // Light Grey
    '#F59E0B', // Orange/Yellow
    '#7B1C1C', // Maroon
    '#1E3A8A', // Dark Blue (duplicate as in image)
    '#8B4513', // Dark Brown
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleColorClick = (color) => {
    const newSelectedColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    
    setSelectedColors(newSelectedColors);
    onFilterChange('colors', newSelectedColors);
  };

  const handleMagSafeToggle = () => {
    const newValue = !magSafeEnabled;
    setMagSafeEnabled(newValue);
    onFilterChange('magSafe', newValue);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
      
      {/* Color Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">Color</span>
          {expandedSections.color ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.color && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorClick(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedColors.includes(color)
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* iPhone Model Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('iphoneModel')}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">iPhone Model</span>
          {expandedSections.iphoneModel ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.iphoneModel && (
          <div className="mt-3 space-y-2">
            {['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12'].map((model) => (
              <label key={model} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => onFilterChange('iphoneModel', { model, checked: e.target.checked })}
                />
                <span className="text-sm text-gray-700">{model}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Type Case Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('typeCase')}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">Type case</span>
          {expandedSections.typeCase ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.typeCase && (
          <div className="mt-3 space-y-2">
            {['Clear Case', 'Leather Case', 'Silicone Case', 'Hard Case', 'Wallet Case', 'Bumper Case', 'Rugged Case'].map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => onFilterChange('typeCase', { type, checked: e.target.checked })}
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* MagSafe Magnet Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('magSafe')}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">MagSafe Magnet</span>
          {expandedSections.magSafe ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.magSafe && (
          <div className="mt-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={magSafeEnabled}
                  onChange={handleMagSafeToggle}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  magSafeEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    magSafeEnabled ? 'translate-x-6' : 'translate-x-1'
                  } mt-1`} />
                </div>
              </div>
              <span className="text-sm text-gray-700">
                {magSafeEnabled ? 'MagSafe Compatible' : 'Not MagSafe Compatible'}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Partnership Filter */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('partnership')}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">Partnership</span>
          {expandedSections.partnership ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.partnership && (
          <div className="mt-3 space-y-2">
            {['Official Apple', 'Third Party', 'Designer Brand', 'Premium Brand'].map((partner) => (
              <label key={partner} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => onFilterChange('partnership', { partner, checked: e.target.checked })}
                />
                <span className="text-sm text-gray-700">{partner}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          setSelectedColors([]);
          setMagSafeEnabled(false);
          onFilterChange('clearAll', {});
        }}
        className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
