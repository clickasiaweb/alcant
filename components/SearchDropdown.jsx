import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

const SearchDropdown = () => {
  const {
    isSearchOpen,
    searchQuery,
    searchResults,
    isSearching,
    recentSearches,
    popularSuggestions,
    openSearch,
    closeSearch,
    handleSearch,
    handleSearchSubmit,
    handleRecentSearchClick,
    handleSuggestionClick,
    clearRecentSearches
  } = useSearch();

  const [inputValue, setInputValue] = useState('');
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSearchSubmit(inputValue);
    }
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeSearch();
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 animate-in fade-in duration-200"
        onClick={closeSearch}
      />

      {/* Search Dropdown */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl animate-in slide-in-from-top-4 duration-300">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for products..."
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => setInputValue('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-500">Searching...</p>
            </div>
          ) : searchQuery.length >= 2 ? (
            <>
              {searchResults.length > 0 ? (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Products
                  </p>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSearchSubmit(product.name)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ${product.price}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">Try searching for something else</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Recent
                    </p>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Suggestions */}
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </p>
                {popularSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Search Tips */}
        <div className="p-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-xs">Enter</kbd> to search, <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
