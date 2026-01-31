import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronRight, ChevronDown, Grid3x3, Star, ArrowRight, Smartphone, Headphones, Wallet, Car, ShoppingBag } from 'lucide-react';
import { categoryService } from '../lib/categoryService';
import CartDrawer from './CartDrawer';
import SearchDropdown from './SearchDropdown';
import WishlistDropdown from './WishlistDropdown';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useWishlist } from '../contexts/WishlistContext';

const AlcantaraHeader = () => {
  const router = useRouter();
  const { openCart, calculateTotalItems } = useCart();
  const { openSearch } = useSearch();
  const { openWishlist, getWishlistCount, isInWishlist } = useWishlist();
  const cartItemCount = calculateTotalItems();
  const wishlistCount = getWishlistCount();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [focusedCategory, setFocusedCategory] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const categoryButtonRefs = useRef({});

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);

        // Fetch subcategories for each category
        const subcategoriesData = {};
        for (const category of categoriesData) {
          const categorySubcategories = await categoryService.getSubcategories(category.slug);
          subcategoriesData[category.slug] = categorySubcategories || [];
        }
        setSubcategories(subcategoriesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle dropdown hover with delay
  const handleDropdownEnter = (categoryName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(categoryName);
    setActiveCategory(categoryName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveCategory(null);
    }, 150);
  };

  // Add effect to control body scroll based on dropdown state
  useEffect(() => {
    if (activeDropdown || isProfileOpen) {
      // Disable body scrolling when any modal/dropdown is active
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scrolling when all modals/dropdowns are inactive
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeDropdown, isProfileOpen]);

  // Handle category hover in mega menu
  const handleCategoryHover = (categoryName) => {
    setActiveCategory(categoryName);
  };

  // Handle navbar hover (new function)
  const handleNavbarHover = (categoryName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(categoryName);
    setActiveCategory(categoryName);
  };

  // Handle navbar leave
  const handleNavbarLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveCategory(null);
    }, 200); // Increased delay for better UX
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, categoryName) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeDropdown === categoryName) {
          setActiveDropdown(null);
          setActiveCategory(null);
        } else {
          handleDropdownEnter(categoryName);
        }
        break;
      case 'Escape':
        setActiveDropdown(null);
        setActiveCategory(null);
        setFocusedCategory(null);
        break;
      case 'ArrowDown':
        e.preventDefault();
        // Focus next category
        const currentIndex = categories.findIndex(cat => cat.name === categoryName);
        const nextIndex = (currentIndex + 1) % categories.length;
        const nextCategory = categories[nextIndex];
        setFocusedCategory(nextCategory.name);
        categoryButtonRefs.current[nextCategory.name]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Focus previous category
        const prevIndex = (categories.findIndex(cat => cat.name === categoryName) - 1 + categories.length) % categories.length;
        const prevCategory = categories[prevIndex];
        setFocusedCategory(prevCategory.name);
        categoryButtonRefs.current[prevCategory.name]?.focus();
        break;
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mega-menu-container')) {
        setActiveDropdown(null);
        setActiveCategory(null);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setActiveCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Get category icon component
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('phone') || name.includes('case')) return <Smartphone className="w-5 h-5" />;
    if (name.includes('accessor')) return <Headphones className="w-5 h-5" />;
    if (name.includes('wallet') || name.includes('card')) return <Wallet className="w-5 h-5" />;
    if (name.includes('car') || name.includes('travel')) return <Car className="w-5 h-5" />;
    if (name.includes('bag') || name.includes('purse')) return <ShoppingBag className="w-5 h-5" />;
    return <Grid3x3 className="w-5 h-5" />;
  };

  // Get category promo image
  const getCategoryPromoImage = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('phone') || name.includes('case')) return 'https://picsum.photos/seed/phone-cases-promo/400/500.jpg';
    if (name.includes('accessor')) return 'https://picsum.photos/seed/accessories-promo/400/500.jpg';
    if (name.includes('wallet') || name.includes('card')) return 'https://picsum.photos/seed/wallets-promo/400/500.jpg';
    if (name.includes('car') || name.includes('travel')) return 'https://picsum.photos/seed/car-travel-promo/400/500.jpg';
    if (name.includes('bag') || name.includes('purse')) return 'https://picsum.photos/seed/bags-promo/400/500.jpg';
    return 'https://picsum.photos/seed/default-promo/400/500.jpg';
  };

  // Get category color
  const getCategoryColor = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('phone') || name.includes('case')) return 'from-blue-500 to-blue-600';
    if (name.includes('accessor')) return 'from-purple-500 to-purple-600';
    if (name.includes('wallet') || name.includes('card')) return 'from-green-500 to-green-600';
    if (name.includes('car') || name.includes('travel')) return 'from-red-500 to-red-600';
    if (name.includes('bag') || name.includes('purse')) return 'from-pink-500 to-pink-600';
    return 'from-gray-500 to-gray-600';
  };

  const handleMobileCategoryToggle = (categoryName) => {
    setExpandedMobileCategory(expandedMobileCategory === categoryName ? null : categoryName);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">ALCANSIDE</span>
          </Link>

          {/* Desktop Navigation - Mega Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            {loading ? (
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="relative mega-menu-container"
                >
                  <button 
                    ref={(el) => categoryButtonRefs.current[category.name] = el}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium text-sm rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap cursor-pointer hover:scale-105 hover:shadow-md"
                    onKeyDown={(e) => handleKeyDown(e, category.name)}
                    aria-expanded={activeDropdown === category.name}
                    aria-haspopup="true"
                    aria-controls={`mega-menu-${category.slug}`}
                    onMouseEnter={() => {
                      console.log('Hovering on:', category.name);
                      setActiveDropdown(category.name);
                      setActiveCategory(category.name);
                    }}
                  >
                    <span className="text-gray-500 group-hover:text-primary-600 transition-colors duration-200">
                      {getCategoryIcon(category.name)}
                    </span>
                    <span>{category.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-all duration-200 ml-1 ${
                      activeDropdown === category.name ? 'rotate-180 text-primary-600' : 'text-gray-400'
                    }`} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {activeDropdown === category.name && (
                    <div 
                      id={`mega-menu-${category.slug}`}
                      className="fixed inset-0 flex items-start justify-center pt-28 pb-20 z-50 animate-in fade-in duration-200"
                      onMouseEnter={() => {
                        console.log('Hovering on dropdown backdrop');
                        if (dropdownTimeoutRef.current) {
                          clearTimeout(dropdownTimeoutRef.current);
                        }
                      }}
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          console.log('Clicked backdrop - closing dropdown');
                          setActiveDropdown(null);
                          setActiveCategory(null);
                        }
                      }}
                    >
                      <div 
                        className="bg-white shadow-xl border border-gray-200 rounded-xl animate-in slide-in-from-top-4 duration-300"
                        style={{ 
                          width: '90vw',
                          maxWidth: '1200px',
                          maxHeight: '70vh',
                          marginBottom: '80px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => {
                          console.log('Hovering on dropdown content');
                          if (dropdownTimeoutRef.current) {
                            clearTimeout(dropdownTimeoutRef.current);
                          }
                        }}
                        onMouseLeave={() => {
                          console.log('Leaving dropdown content');
                          dropdownTimeoutRef.current = setTimeout(() => {
                            setActiveDropdown(null);
                            setActiveCategory(null);
                          }, 100);
                        }}
                        role="menu"
                        aria-label={`${category.name} menu`}
                      >
                        <div className="w-full h-full px-6 sm:px-8 lg:px-10 xl:px-12 overflow-y-auto">
                          <div 
                            className="flex flex-row gap-0 py-8"
                            style={{ 
                              minHeight: '400px', 
                              maxHeight: '70vh',
                              width: '100%'
                            }}
                          >
                          {/* Column 1 - Primary Categories (Fixed Width) */}
                          <div 
                            className="flex-shrink-0 border-r border-gray-100"
                            style={{ 
                              width: '25%',
                              minWidth: '256px',
                              maxWidth: '320px',
                              flexBasis: '25%'
                            }}
                          >
                            <div className="px-6">
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 whitespace-nowrap">Categories</h3>
                              <div className="space-y-1" role="menu">
                                {categories.map((cat) => (
                                  <button
                                    key={cat.id}
                                    onClick={() => handleCategoryHover(cat.name)}
                                    onMouseEnter={() => handleCategoryHover(cat.name)}
                                    className={`w-full flex items-center justify-between px-3 py-3 text-left rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 ${
                                      activeCategory === cat.name 
                                        ? 'bg-primary-50 text-primary-600 border-l-2 border-primary-600 shadow-sm' 
                                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                                    }`}
                                    role="menuitem"
                                    aria-current={activeCategory === cat.name}
                                  >
                                    <div className="flex items-center space-x-3 flex-shrink-0">
                                      <span className={`transition-all duration-200 flex-shrink-0 ${
                                        activeCategory === cat.name ? 'text-primary-600 scale-110' : 'text-gray-400 group-hover:text-gray-600'
                                      }`}>
                                        {getCategoryIcon(cat.name)}
                                      </span>
                                      <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">{cat.name}</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-all duration-200 flex-shrink-0 ${
                                      activeCategory === cat.name ? 'text-primary-600 opacity-100 translate-x-0' : 'text-gray-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                                    }`} />
                                  </button>
                                ))}
                              </div>
                              
                              <div className="mt-6 pt-6 border-t border-gray-100">
                                <Link
                                  href={`/category/${category.slug}`}
                                  className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 rounded whitespace-nowrap"
                                  onClick={() => setActiveDropdown(null)}
                                  role="menuitem"
                                >
                                  <span className="whitespace-nowrap">Shop All {category.name}</span>
                                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Column 2 - Subcategories (Flexible Width) */}
                          <div 
                            className="flex-grow min-w-0"
                            style={{ 
                              width: '35%',
                              minWidth: '358px',
                              maxWidth: '448px',
                              flexBasis: '35%'
                            }}
                          >
                            <div className="px-6">
                              {activeCategory && (
                                <div className="animate-in fade-in slide-in-from-left-2 duration-200">
                                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 whitespace-nowrap">
                                    {activeCategory}
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4" role="menu" style={{ minWidth: '300px' }}>
                                    {subcategories[category.slug] && subcategories[category.slug].length > 0 ? (
                                      subcategories[category.slug].map((subcategory, index) => (
                                        <div key={subcategory.slug} className="min-w-0">
                                          <Link
                                            href={`/category/${category.slug}?subcategory=${subcategory.slug}`}
                                            className="block py-2 text-sm text-gray-700 hover:text-primary-600 transition-all duration-200 group hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 rounded whitespace-nowrap overflow-hidden text-ellipsis"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                            onClick={() => setActiveDropdown(null)}
                                            role="menuitem"
                                          >
                                            <div className="flex items-center space-x-2">
                                              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-primary-600 transition-all duration-200 group-hover:translate-x-1 flex-shrink-0" />
                                              <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{subcategory.name}</span>
                                            </div>
                                          </Link>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="col-span-2 text-sm text-gray-500 py-2 animate-in fade-in duration-200">
                                        No subcategories available
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Column 3 - Visual/Promo (Fixed Width) */}
                          <div 
                            className="flex-shrink-0"
                            style={{ 
                              width: '40%',
                              minWidth: '350px',
                              maxWidth: '400px',
                              flexBasis: '40%',
                              overflow: 'hidden'
                            }}
                          >
                            <div className="px-4 h-full flex flex-col justify-center" style={{ minHeight: '350px' }}>
                              <div className="space-y-4">
                                <div className="aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden shadow-sm group" style={{ width: '100%', maxWidth: '280px', maxHeight: '280px' }}>
                                  <img 
                                    src={getCategoryPromoImage(activeCategory || category.name)}
                                    alt={`Featured ${activeCategory || category.name}`}
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                  />
                                </div>
                                <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                                  <h4 className="text-lg font-semibold text-gray-900 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {activeCategory || category.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    Discover our premium collection with modern design and exceptional quality.
                                  </p>
                                  <Link
                                    href={`/category/${category.slug}?sort=newest`}
                                    className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 whitespace-nowrap"
                                    onClick={() => setActiveDropdown(null)}
                                    role="menuitem"
                                  >
                                    Shop New Arrivals
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <button 
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              onClick={openSearch}
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Favorites/Wishlist Icon */}
            <button 
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200 relative"
              onClick={openWishlist}
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>
            
            {/* Shopping Cart Icon */}
            <button 
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200 relative"
              onClick={openCart}
              aria-label="View shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
            
            {/* User Profile Icon */}
            <button 
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Open user profile"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Accordion Style */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="container py-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-200">
                    <button
                      onClick={() => handleMobileCategoryToggle(category.name)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                      aria-expanded={expandedMobileCategory === category.name}
                      aria-controls={`mobile-menu-${category.slug}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`text-gray-500 group-hover:text-primary-600 transition-colors duration-200 ${
                          getCategoryIcon(category.name).props.className || ''
                        }`}>
                          {getCategoryIcon(category.name)}
                        </span>
                        <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{category.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
                        expandedMobileCategory === category.name ? 'rotate-180 text-primary-600' : ''
                      }`} />
                    </button>
                    
                    {/* Mobile Subcategories - Accordion */}
                    {expandedMobileCategory === category.name && (
                      <div 
                        id={`mobile-menu-${category.slug}`}
                        className="bg-gray-50 px-4 py-3 space-y-1 animate-in slide-in-from-top-1 duration-200"
                        role="region"
                        aria-label={`${category.name} subcategories`}
                      >
                        {subcategories[category.slug] && subcategories[category.slug].length > 0 && (
                          <>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Subcategories</p>
                            {subcategories[category.slug].map((subcategory, index) => (
                              <Link
                                key={subcategory.slug}
                                href={`/category/${category.slug}?subcategory=${subcategory.slug}`}
                                className="flex items-center space-x-2 py-2 pl-4 text-sm text-gray-700 hover:text-primary-600 transition-all duration-200 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 rounded"
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <ChevronRight className="w-3 h-3 text-gray-400 transition-all duration-200" />
                                <span className="font-medium">{subcategory.name}</span>
                              </Link>
                            ))}
                            <div className="border-t border-gray-200 my-3"></div>
                          </>
                        )}
                        
                        <Link
                          href={`/category/${category.slug}`}
                          className="flex items-center justify-between py-2 pl-4 text-sm text-gray-700 hover:text-primary-600 transition-all duration-200 hover:translate-x-1 group focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 rounded"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="font-medium group-hover:text-primary-600">View All {category.name}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400 transition-all duration-200 group-hover:text-primary-600 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Dropdown Components */}
      <SearchDropdown />
      <WishlistDropdown />
      <CartDrawer />
    </header>
  );
};

export default AlcantaraHeader;
