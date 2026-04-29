import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import searchService from '../lib/searchService';


const SearchDropdown = () => {
  const router = useRouter();
  const {
    isSearchOpen,
    closeSearch,
    recentSearches,
    popularSuggestions,
    handleRecentSearchClick,
    handleSuggestionClick,
    clearRecentSearches
  } = useSearch();

  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const isMounted = useRef(true);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (!isMounted.current) return;
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search using real searchService
  const performSearch = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const results = await searchService.searchProducts(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if value is too short
    if (value.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Debounce search with 300ms delay
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle form submission with real data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Save to recent searches and navigate
      searchService.saveRecentSearch(inputValue.trim());
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      closeSearch();
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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {isSearching && (
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                )}
                {inputValue && !isSearching && (
                  <button
                    type="button"
                    onClick={() => setInputValue('')}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
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
          ) : inputValue.length >= 2 ? (
            <>
              {searchResults.length > 0 ? (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Products
                  </p>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        // Save to recent searches and navigate
                        searchService.saveRecentSearch(product.name.trim());
                        router.push(`/search?q=${encodeURIComponent(product.name)}`);
                        closeSearch();
                      }}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                          onError={(e) => {
                            e.target.src = 'https://picsum.photos/seed/fallback/60/60.jpg';
                          }}
                        />
                        {product.isNew && (
                          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded">
                            New
                          </span>
                        )}
                        {product.discount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{product.category}</span>
                          {product.rating > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1">{product.rating.toFixed(1)}</span>
                                {product.reviews > 0 && (
                                  <span className="ml-1">({product.reviews})</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-600">
                          ₹{product.price.toFixed(2)}
                        </p>
                        {product.oldPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ₹{product.oldPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
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
                      onClick={() => {
                        // Save to recent searches and navigate
                        searchService.saveRecentSearch(search.trim());
                        router.push(`/search?q=${encodeURIComponent(search)}`);
                        closeSearch();
                      }}
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
                    onClick={() => {
                      // Save to recent searches and navigate
                      searchService.saveRecentSearch(suggestion.trim());
                      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                      closeSearch();
                    }}
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
