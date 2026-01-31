import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Search from 'lucide-react/dist/esm/icons/search';
import User from 'lucide-react/dist/esm/icons/user';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Menu from 'lucide-react/dist/esm/icons/menu';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Heart from 'lucide-react/dist/esm/icons/heart';
import { useAuth } from '../contexts/AuthContext';

const PhoneAccessoriesHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const { isAuthenticated, user } = useAuth();

  const phoneAccessoriesSubcategories = [
    "Mobile Cases & Covers",
    "Screen Protectors", 
    "Chargers & Cables",
    "Power Banks",
    "Earphones & Headphones",
    "Mobile Stands & Holders",
    "Camera Lenses",
    "Mobile Skins",
    "Wireless Accessories"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 bg-primary-900 text-white transition-all duration-300 ${
        isScrolled 
          ? 'shadow-lg py-2' 
          : 'shadow-none py-4'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-200">
                <span className="text-primary-900 font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold text-white hidden sm:inline">
                Phone Accessories
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-6">
              {/* Phone Accessories Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => setIsCategoryOpen(false)}
                  className="flex items-center text-white hover:text-primary-200 transition-colors duration-200 py-2"
                >
                  Phone Accessories
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {/* Dropdown Menu */}
                {isCategoryOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50"
                    onMouseEnter={() => setIsCategoryOpen(true)}
                    onMouseLeave={() => setIsCategoryOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Browse Categories</p>
                    </div>
                    {phoneAccessoriesSubcategories.map((subcategory, index) => (
                      <Link
                        key={index}
                        href={`/products?subcategory=${encodeURIComponent(subcategory)}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                href="/products" 
                className="text-white hover:text-primary-200 transition-colors duration-200"
              >
                All Products
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-primary-200 transition-colors duration-200"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-white hover:text-primary-200 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg hover:bg-primary-800 transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
              
              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl p-4 z-50">
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search phone accessories..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* User Actions */}
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                {/* Wishlist */}
                <Link href="/wishlist" className="p-2 rounded-lg hover:bg-primary-800 transition-colors duration-200">
                  <Heart className="w-5 h-5 text-white" />
                </Link>
                
                {/* Cart */}
                <Link href="/cart" className="p-2 rounded-lg hover:bg-primary-800 transition-colors duration-200 relative">
                  <ShoppingBag className="w-5 h-5 text-white" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                
                {/* User Menu */}
                <div className="relative">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-800 transition-colors duration-200">
                    <User className="w-5 h-5 text-white" />
                    <span className="hidden sm:inline text-sm">{user?.fullName?.split(' ')[0] || 'User'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-primary-800 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <div className="w-6 h-6 flex items-center justify-center">
                    <span className="block w-6 h-0.5 bg-white"></span>
                    <span className="block w-6 h-0.5 bg-white mt-1 transform rotate-45"></span>
                  </div>
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl z-50">
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Phone Accessories</p>
                    {phoneAccessoriesSubcategories.map((subcategory, index) => (
                      <Link
                        key={index}
                        href={`/products?subcategory=${encodeURIComponent(subcategory)}`}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <Link
                      href="/about"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PhoneAccessoriesHeader;
