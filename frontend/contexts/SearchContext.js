import React, { createContext, useContext, useState, useCallback } from 'react';
import searchService from '../lib/searchService';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    console.error('useSearch must be used within a SearchProvider');
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Open search dropdown
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    // Load recent searches when opening
    setRecentSearches(searchService.getRecentSearches());
  }, []);

  // Close search dropdown
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Handle search input with debouncing
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
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
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((query) => {
    if (!query || query.trim().length < 2) return;
    
    // Save to recent searches
    searchService.saveRecentSearch(query.trim());
    setRecentSearches(searchService.getRecentSearches());
    
    // Navigate to search results page
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    
    // Close search dropdown
    closeSearch();
  }, [closeSearch]);

  // Handle recent search click
  const handleRecentSearchClick = useCallback((query) => {
    handleSearchSubmit(query);
  }, [handleSearchSubmit]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion) => {
    handleSearchSubmit(suggestion);
  }, [handleSearchSubmit]);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    searchService.clearRecentSearches();
    setRecentSearches([]);
  }, []);

  // Get popular suggestions
  const popularSuggestions = searchService.getPopularSuggestions();

  const value = {
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
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
