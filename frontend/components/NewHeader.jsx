import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, ChevronDown, Heart } from 'lucide-react';

const NewHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 bg-white transition-all duration-300 ${
        isScrolled 
          ? 'shadow-header py-2' 
          : 'shadow-none py-4'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-200">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold text-primary-800 hidden sm:inline font-display">
                Premium
              </span>
              <span className="text-2xl font-light text-secondary-600 hidden sm:inline font-display">
                Lifestyle
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-1">
              <Link 
                href="/new-arrivals" 
                className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200"
              >
                New
              </Link>
              <Link 
                href="/collections" 
                className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200"
              >
                Collections
              </Link>
              <Link 
                href="/brands" 
                className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200"
              >
                Brands
              </Link>
              <Link 
                href="/sale" 
                className="px-4 py-2 text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors duration-200"
              >
                Sale
              </Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg hover:bg-primary-50 transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-secondary-600" />
              </button>
              
              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-lg rounded-lg border border-ui-border p-4 z-50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full px-4 py-2 pr-10 border border-ui-border rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      autoFocus
                    />
                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-secondary-400" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-secondary-500 mb-2">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">Summer dresses</span>
                      <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">Handbags</span>
                      <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">Sneakers</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              className="p-2 rounded-lg hover:bg-primary-50 transition-colors duration-200 hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-secondary-600" />
            </button>

            {/* Account */}
            <div className="relative group">
              <button
                className="p-2 rounded-lg hover:bg-primary-50 transition-colors duration-200 flex items-center space-x-1"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-secondary-600" />
                <ChevronDown className="w-4 h-4 text-secondary-400 group-hover:text-primary-600 transition-colors" />
              </button>
              
              {/* Account Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-ui-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Wishlist
                  </Link>
                  <hr className="my-2 border-ui-divider" />
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            {/* Cart */}
            <button
              className="relative p-2 rounded-lg hover:bg-primary-50 transition-colors duration-200"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-secondary-600" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-secondary-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-ui-divider bg-white">
          <div className="container py-4">
            <nav className="space-y-1">
              <Link
                href="/new-arrivals"
                className="block px-4 py-3 text-base font-medium text-secondary-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                href="/collections"
                className="block px-4 py-3 text-base font-medium text-secondary-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
              >
                Collections
              </Link>
              <Link
                href="/brands"
                className="block px-4 py-3 text-base font-medium text-secondary-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
              >
                Brands
              </Link>
              <Link
                href="/sale"
                className="block px-4 py-3 text-base font-medium text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
              >
                Sale
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default NewHeader;
