import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import apiClient from '../lib/api';

const FilterSidebar = ({ onFilterChange, filters, category }) => {
  const [expandedSections, setExpandedSections] = useState({
    color: true,
    price: true,
    brand: false,
    magSafe: false,
    features: false
  });

  const [availableFilters, setAvailableFilters] = useState({
    colors: [],
    brands: [],
    priceRanges: [],
    magSafeCompatible: { count: 0 },
    isNew: { count: 0 },
    isLimitedEdition: { count: 0 },
    hasDiscount: { count: 0 }
  });

  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState(filters.colors || []);
  const [selectedBrands, setSelectedBrands] = useState(filters.brands || []);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(filters.priceRanges || []);
  const [magSafeEnabled, setMagSafeEnabled] = useState(filters.magSafe || false);
  const [newEnabled, setNewEnabled] = useState(filters.isNew || false);
  const [limitedEditionEnabled, setLimitedEditionEnabled] = useState(filters.isLimitedEdition || false);
  const [discountEnabled, setDiscountEnabled] = useState(filters.hasDiscount || false);

  // Fetch available filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const params = category ? { category } : {};
        const response = await apiClient.get('/products/filters', { params });
        setAvailableFilters(response.data.filters);
      } catch (error) {
        console.error('Error fetching filters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [category]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleColorClick = (color) => {
    const newSelectedColors = selectedColors.includes(color.name)
      ? selectedColors.filter(c => c !== color.name)
      : [...selectedColors, color.name];
    
    setSelectedColors(newSelectedColors);
    onFilterChange('colors', newSelectedColors);
  };

  const handleBrandClick = (brand) => {
    const newSelectedBrands = selectedBrands.includes(brand.name)
      ? selectedBrands.filter(b => b !== brand.name)
      : [...selectedBrands, brand.name];
    
    setSelectedBrands(newSelectedBrands);
    onFilterChange('brands', newSelectedBrands);
  };

  const handlePriceRangeClick = (range) => {
    const rangeKey = `${range.min}-${range.max}`;
    const newSelectedRanges = selectedPriceRanges.includes(rangeKey)
      ? selectedPriceRanges.filter(r => r !== rangeKey)
      : [...selectedPriceRanges, rangeKey];
    
    setSelectedPriceRanges(newSelectedRanges);
    onFilterChange('priceRanges', newSelectedRanges);
  };

  const handleMagSafeToggle = () => {
    const newValue = !magSafeEnabled;
    setMagSafeEnabled(newValue);
    onFilterChange('magSafe', newValue);
  };

  const handleNewToggle = () => {
    const newValue = !newEnabled;
    setNewEnabled(newValue);
    onFilterChange('isNew', newValue);
  };

  const handleLimitedEditionToggle = () => {
    const newValue = !limitedEditionEnabled;
    setLimitedEditionEnabled(newValue);
    onFilterChange('isLimitedEdition', newValue);
  };

  const handleDiscountToggle = () => {
    const newValue = !discountEnabled;
    setDiscountEnabled(newValue);
    onFilterChange('hasDiscount', newValue);
  };

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedPriceRanges([]);
    setMagSafeEnabled(false);
    setNewEnabled(false);
    setLimitedEditionEnabled(false);
    setDiscountEnabled(false);
    onFilterChange('clearAll', {});
  };

  const getActiveFiltersCount = () => {
    return selectedColors.length + 
           selectedBrands.length + 
           selectedPriceRanges.length + 
           (magSafeEnabled ? 1 : 0) +
           (newEnabled ? 1 : 0) +
           (limitedEditionEnabled ? 1 : 0) +
           (discountEnabled ? 1 : 0);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {getActiveFiltersCount()} active
            </span>
          )}
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Color Filter */}
      {availableFilters.colors.length > 0 && (
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
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 lg:gap-2">
                {availableFilters.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorClick(color)}
                    className={`w-8 h-8 lg:w-6 lg:h-6 rounded-full border-2 transition-all touch-manipulation relative ${
                      selectedColors.includes(color.name)
                        ? 'border-blue-500 ring-2 ring-blue-200 scale-110'
                        : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.count} products)`}
                  >
                    {selectedColors.includes(color.name) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedColors.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedColors.map(color => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                    >
                      {color}
                      <button
                        onClick={() => handleColorClick({ name: color })}
                        className="hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      {availableFilters.priceRanges.length > 0 && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">Price Range</span>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="mt-3 space-y-2">
              {availableFilters.priceRanges.map((range, index) => {
                const rangeKey = `${range.min}-${range.max}`;
                const isSelected = selectedPriceRanges.includes(rangeKey);
                return (
                  <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{range.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">({range.count})</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handlePriceRangeClick(range)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Brand Filter */}
      {availableFilters.brands.length > 0 && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">Brand</span>
            {expandedSections.brand ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.brand && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.brands.map((brand, index) => (
                <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{brand.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">({brand.count})</span>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Features Filter */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">Features</span>
          {expandedSections.features ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.features && (
          <div className="mt-3 space-y-3">
            {availableFilters.magSafeCompatible.count > 0 && (
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-700">MagSafe Compatible</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">({availableFilters.magSafeCompatible.count})</span>
                  <input
                    type="checkbox"
                    checked={magSafeEnabled}
                    onChange={handleMagSafeToggle}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </label>
            )}

            {availableFilters.isNew.count > 0 && (
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-700">New Arrivals</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">({availableFilters.isNew.count})</span>
                  <input
                    type="checkbox"
                    checked={newEnabled}
                    onChange={handleNewToggle}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </label>
            )}

            {availableFilters.isLimitedEdition.count > 0 && (
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-700">Limited Edition</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">({availableFilters.isLimitedEdition.count})</span>
                  <input
                    type="checkbox"
                    checked={limitedEditionEnabled}
                    onChange={handleLimitedEditionToggle}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </label>
            )}

            {availableFilters.hasDiscount.count > 0 && (
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-700">On Sale</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">({availableFilters.hasDiscount.count})</span>
                  <input
                    type="checkbox"
                    checked={discountEnabled}
                    onChange={handleDiscountToggle}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </label>
            )}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {getActiveFiltersCount() > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full mt-4 px-4 py-3 lg:py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors touch-manipulation"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default FilterSidebar;
