import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { 
  FaBars, 
  FaTimes, 
  FaSearch, 
  FaShoppingCart, 
  FaUser,
  FaHeart,
  FaChevronDown
} from "react-icons/fa";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  ChevronDown,
  Menu,
  X,
  Package,
  Settings,
  Truck,
  Shield
} from "lucide-react";
import { categoryService } from "../services/categoryService";
import Logo from "./Logo";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(4);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [mobileNavStack, setMobileNavStack] = useState([]);
  const router = useRouter();
  const megaMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await categoryService.getCategoriesWithHierarchy();
        console.log('📁 Header: Categories loaded:', response.data);
        setCategories(response.data || []);
      } catch (error) {
        console.error('❌ Header: Error loading categories:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Transform categories data for navigation
  const navigationItems = [
    {
      name: "Products",
      href: "/products",
      hasMegaMenu: true,
      megaMenu: {
        title: "Product Categories",
        categories: categories.map(category => ({
          title: category.name,
          href: `/category/${category.slug}`,
          description: `Premium Alcantara ${category.name.toLowerCase()}`,
          image: `https://via.placeholder.com/300x200/1a365d/ffffff?text=${encodeURIComponent(category.name)}`,
          subcategories: category.subcategories?.map(subcategory => ({
            name: subcategory.name,
            href: `/category/${category.slug}?subcategory=${subcategory.slug}`,
            subSubcategories: subcategory.sub_subcategories?.map(subSub => ({
              name: subSub.name,
              href: `/category/${category.slug}?subcategory=${subcategory.slug}&subsubcategory=${subSub.slug}`,
              sub3Categories: subSub.sub3_categories?.map(sub3 => ({
                name: sub3.name,
                href: `/category/${category.slug}?subcategory=${subcategory.slug}&subsubcategory=${subSub.slug}&sub3=${sub3.slug}`
              }))
            })) || []
          })) || []
        }))
      }
    },
    {
      name: "About",
      href: "/about",
      hasMegaMenu: false
    },
    {
      name: "Contact",
      href: "/contact",
      hasMegaMenu: false
    }
  ];

  // Handle click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false);
        setActiveMegaMenu(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleMegaMenuToggle = (itemName) => {
    const item = navigationItems.find(nav => nav.name === itemName);
    if (item?.hasMegaMenu) {
      if (activeMegaMenu === itemName) {
        setIsMegaMenuOpen(false);
        setActiveMegaMenu(null);
      } else {
        setIsMegaMenuOpen(true);
        setActiveMegaMenu(itemName);
      }
    } else {
      setIsMegaMenuOpen(false);
      setActiveMegaMenu(null);
      router.push(item?.href || '#');
    }
  };

  const navigateToMobileCategory = (category, level) => {
    setMobileNavStack(prev => [...prev, { category, level }]);
  };

  const navigateMobileBack = () => {
    setMobileNavStack(prev => prev.slice(0, -1));
  };

  const getCurrentMobileView = () => {
    if (mobileNavStack.length === 0) {
      return navigationItems;
    }
    const current = mobileNavStack[mobileNavStack.length - 1];
    
    // If it's the main "Products" item, show its categories
    if (current.category.name === "Products" && current.category.megaMenu) {
      return current.category.megaMenu.categories;
    }
    
    // For category items, show their subcategories or subSubcategories
    return current.category.subcategories || current.category.subSubcategories || [];
  };

  const getCurrentMobileTitle = () => {
    if (mobileNavStack.length === 0) {
      return "Menu";
    }
    const current = mobileNavStack[mobileNavStack.length - 1];
    return current.category.name?.toUpperCase() || current.category.title?.toUpperCase();
  };

  const renderMegaMenu = (item) => {
    if (!item.megaMenu) return null;

    return (
      <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">{item.megaMenu.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {item.megaMenu.categories.map((category) => (
                  <div key={category.title} className="group">
                    <Link href={category.href} className="block">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:opacity-90 transition-opacity">
                        <img
                          src={category.image}
                          alt={category.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {category.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <div className="space-y-1">
                        {category.subcategories.map((sub) => (
                          <div key={sub.name} className="group/sub">
                            <div className="flex items-center justify-between">
                              <Link
                                href={sub.href}
                                className="text-sm text-gray-600 hover:text-primary-600 transition-colors block"
                              >
                                {sub.name}
                              </Link>
                              {sub.subSubcategories && (
                                <ChevronDown className="w-3 h-3 text-gray-400 group-hover/sub:text-primary-600 transition-colors" />
                              )}
                            </div>
                            {sub.subSubcategories && (
                              <div className="ml-4 mt-1 space-y-1 opacity-0 group-hover/sub:opacity-100 transition-opacity duration-200">
                                {sub.subSubcategories.map((subSub) => (
                                  <div key={subSub.name} className="group/subsub">
                                    <Link
                                      href={subSub.href}
                                      className="text-xs text-gray-500 hover:text-primary-500 transition-colors block flex items-center"
                                    >
                                      {subSub.name}
                                      {subSub.sub3Categories && (
                                        <ChevronDown className="w-2 h-2 text-gray-400 group-hover/subsub:text-primary-600 transition-colors ml-1" />
                                      )}
                                    </Link>
                                    {subSub.sub3Categories && (
                                      <div className="ml-4 mt-1 space-y-1 opacity-0 group-hover/subsub:opacity-100 transition-opacity duration-200">
                                        {subSub.sub3Categories.map((sub3) => (
                                          <Link
                                            key={sub3.name}
                                            href={sub3.href}
                                            className="text-xs text-gray-400 hover:text-primary-500 transition-colors block"
                                          >
                                            {sub3.name}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Section */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">{item.megaMenu.featured.title}</h3>
              <div className="space-y-4">
                {item.megaMenu.featured.products.map((product) => (
                  <Link key={product.name} href={product.href} className="group block">
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-primary-600 transition-colors truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">{product.description}</p>
                        <p className="text-sm font-semibold text-primary-600">{product.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>Free shipping on orders over $100</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Premium Alcantara products</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="tel:+1-800-ALCANSIDE" className="hover:text-primary-400 transition-colors">
              1-800-ALCANSIDE
            </a>
            <a href="/contact" className="hover:text-primary-400 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative" ref={megaMenuRef}>
                <button
                  onClick={() => handleMegaMenuToggle(item.name)}
                  className={`flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-300 ${
                    activeMegaMenu === item.name ? 'text-primary-600' : ''
                  }`}
                >
                  <span>{item.name}</span>
                  {item.hasMegaMenu && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      activeMegaMenu === item.name ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Search
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link href="/account" className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {/* CTA Button */}
            <Link href="/contact" className="hidden md:inline bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Shop Now
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      {isMegaMenuOpen && activeMegaMenu && (
        <div className="border-t border-gray-200">
          {renderMegaMenu(navigationItems.find(item => item.name === activeMegaMenu))}
        </div>
      )}

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute inset-x-0 top-0 bottom-0 bg-white max-w-sm mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Logo size="small" />
                <span className="text-lg font-bold text-gray-900">ALCANT</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setMobileNavStack([]);
                  }}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {mobileNavStack.length === 0 ? (
                // Main menu items
                <div className="space-y-3">
                  {navigationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (item.hasMegaMenu) {
                          navigateToMobileCategory(item, 0);
                        } else {
                          router.push(item.href || '#');
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.name === "Products" && <Package className="w-5 h-5 text-gray-600" />}
                          {item.name === "About" && <Settings className="w-5 h-5 text-gray-600" />}
                          {item.name === "Contact" && <Truck className="w-5 h-5 text-gray-600" />}
                        </div>
                        <span className="text-base font-medium text-gray-900">{item.name}</span>
                      </div>
                      {item.hasMegaMenu && (
                        <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                // Category items with images
                <div className="space-y-3">
                  {getCurrentMobileView().map((item) => {
                    const hasSubCategories = (item.subcategories && item.subcategories.length > 0) || 
                                           (item.subSubcategories && item.subSubcategories.length > 0);
                    
                    return (
                      <button
                        key={item.name || item.title}
                        onClick={() => {
                          if (hasSubCategories) {
                            navigateToMobileCategory(item, mobileNavStack.length);
                          } else {
                            router.push(item.href || '#');
                            setIsMobileMenuOpen(false);
                            setMobileNavStack([]);
                          }
                        }}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          {/* Category Icon/Image */}
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image || `https://via.placeholder.com/40x40/1a365d/ffffff?text=${encodeURIComponent((item.name || item.title).charAt(0))}`}
                              alt={item.name || item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Category Name */}
                          <span className="text-base font-medium text-gray-900 text-left">
                            {item.name || item.title}
                          </span>
                        </div>
                        
                        {/* Chevron */}
                        {hasSubCategories && (
                          <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Mobile Actions - Only show on main menu */}
              {mobileNavStack.length === 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <Link
                    href="/wishlist"
                    className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors p-3 rounded-lg hover:bg-gray-50"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileNavStack([]);
                    }}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Wishlist ({wishlistCount})</span>
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors p-3 rounded-lg hover:bg-gray-50"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileNavStack([]);
                    }}
                  >
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </Link>
                  <Link
                    href="/products"
                    className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-center font-medium"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileNavStack([]);
                    }}
                  >
                    Shop Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
