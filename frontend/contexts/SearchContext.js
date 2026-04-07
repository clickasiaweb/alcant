import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
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

  // Safe recent searches state update to prevent unnecessary re-renders
  const updateRecentSearches = useCallback(() => {
    const newSearches = searchService.getRecentSearches();
    setRecentSearches(prev => {
      // Prevent unnecessary re-render if data is same
      if (JSON.stringify(prev) === JSON.stringify(newSearches)) {
        return prev;
      }
      return newSearches;
    });
  }, []);

  // Open search dropdown
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    // Load recent searches when opening safely
    updateRecentSearches();
  }, []); // Remove updateRecentSearches dependency to prevent circular dependency

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
      // Could add toast notification here for user feedback
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((query) => {
    if (!query || query.trim().length < 2) return;
    
    // Save to recent searches
    searchService.saveRecentSearch(query.trim());
    updateRecentSearches();
    
    // Navigate to search results page
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    
    // Close search dropdown
    closeSearch();
  }, []); // Remove dependencies to prevent circular dependency

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
  const popularSuggestions = useMemo(() => {
    return searchService.getPopularSuggestions();
  }, []);

  const value = useMemo(() => ({
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
  }), [
    isSearchOpen,
    searchQuery,
    searchResults,
    isSearching,
    recentSearches,
    popularSuggestions
  ]); // ✅ only state + memo values

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
