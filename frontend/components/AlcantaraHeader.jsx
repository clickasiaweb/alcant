import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronRight, ChevronDown, Grid3x3, Star, ArrowRight, Smartphone, Headphones, Wallet, Car, ShoppingBag } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { productService } from '../lib/productService';
import CartDrawer from './CartDrawer';
import SearchDropdown from './SearchDropdown';
import WishlistDropdown from './WishlistDropdown';
import GenericSubcategoryGrid from './GenericSubcategoryGrid';
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
  const [subSubcategories, setSubSubcategories] = useState({});
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [productsLoading, setProductsLoading] = useState({});
  const [subSubcategoriesLoading, setSubSubcategoriesLoading] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [focusedCategory, setFocusedCategory] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const categoryButtonRefs = useRef({});

  // Fetch products for a category
  const fetchCategoryProducts = async (categorySlug) => {
    try {
      setProductsLoading(prev => ({ ...prev, [categorySlug]: true }));
      const productsData = await productService.getProductsByCategory(categorySlug, { limit: 8 });
      setCategoryProducts(prev => ({ ...prev, [categorySlug]: productsData.products || [] }));
    } catch (error) {
      console.error('Failed to fetch category products:', error);
      setCategoryProducts(prev => ({ ...prev, [categorySlug]: [] }));
    } finally {
      setProductsLoading(prev => ({ ...prev, [categorySlug]: false }));
    }
  };

  // Fetch sub-subcategories for a subcategory
  const fetchSubSubcategories = async (categorySlug, subcategorySlug) => {
    try {
      setSubSubcategoriesLoading(prev => ({ ...prev, [subcategorySlug]: true }));
      const subSubcategoriesData = await categoryService.getSubSubcategories(categorySlug, subcategorySlug);
      setSubSubcategories(prev => ({ ...prev, [subcategorySlug]: subSubcategoriesData }));
    } catch (error) {
      console.error('Failed to fetch sub-subcategories:', error);
      setSubSubcategories(prev => ({ ...prev, [subcategorySlug]: [] }));
    } finally {
      setSubSubcategoriesLoading(prev => ({ ...prev, [subcategorySlug]: false }));
    }
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (categorySlug, subcategory) => {
    setSelectedSubcategory(subcategory);
    fetchSubSubcategories(categorySlug, subcategory.slug);
  };

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔄 AlcantaraHeader: Fetching categories with hierarchy...');
        
        // Use the hierarchy endpoint to get all data at once
        const categoriesData = await categoryService.getCategoriesWithHierarchy();
        console.log('📊 AlcantaraHeader: Categories data received:', categoriesData);
        
        const categoriesList = categoriesData.data || [];
        setCategories(categoriesList);

        // Extract subcategories from the hierarchy data
        const subcategoriesData = {};
        const subSubcategoriesData = {};
        
        categoriesList.forEach(category => {
          subcategoriesData[category.slug] = category.subcategories || [];
          
          // Extract sub-subcategories for each subcategory
          category.subcategories?.forEach(sub => {
            if (sub.sub_subcategories && sub.sub_subcategories.length > 0) {
              subSubcategoriesData[sub.slug] = sub.sub_subcategories;
            }
          });
        });
        
        setSubcategories(subcategoriesData);
        setSubSubcategories(subSubcategoriesData);
        
        console.log('📁 Subcategories:', subcategoriesData);
        console.log('📄 Sub-subcategories:', subSubcategoriesData);
        
        // Debug iPhone Cases specifically
        const phoneCases = categoriesList.find(cat => cat.name === 'Phone Cases');
        if (phoneCases) {
          const iPhoneSub = phoneCases.subcategories?.find(sub => sub.name === 'iPhone Cases');
          console.log('📱 Phone Cases category:', phoneCases);
          console.log('📱 iPhone Cases subcategory:', iPhoneSub);
          if (iPhoneSub) {
            console.log('📱 iPhone Cases sub-subcategories:', iPhoneSub.sub_subcategories);
          }
        }
        
        console.log('✅ AlcantaraHeader: Data loaded successfully');
      } catch (err) {
        console.error('❌ AlcantaraHeader: Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle dropdown hover with delay
  const handleDropdownEnter = async (categoryName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(categoryName);
    setActiveCategory(categoryName);
    setSelectedSubcategory(null); // Reset selected subcategory when changing category
    setHoveredSubcategory(null); // Reset hovered subcategory when changing category
    
    // Fetch products for this category if not already loaded
    const category = categories.find(cat => cat.name === categoryName);
    if (category && !categoryProducts[category.slug]) {
      await fetchCategoryProducts(category.slug);
    }
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveCategory(null);
      setHoveredSubcategory(null);
    }, 50); // Reduced from 150ms to 50ms
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
        setHoveredSubcategory(null);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setActiveCategory(null);
        setHoveredSubcategory(null);
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
    <>
      <style jsx>{`
        @keyframes slideInFade {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
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
          <nav className="hidden lg:flex items-center space-x-1 relative">
            {loading ? (
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <>
                {categories.map((category) => (
                  <button 
                    key={category.id}
                    ref={(el) => categoryButtonRefs.current[category.name] = el}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium text-sm rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap cursor-pointer hover:scale-105 hover:shadow-md"
                    onKeyDown={(e) => handleKeyDown(e, category.name)}
                    aria-expanded={activeDropdown === category.name}
                    aria-haspopup="true"
                    onMouseEnter={async () => {
                      console.log('Hovering on:', category.name);
                      await handleDropdownEnter(category.name);
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
                ))}

                {/* Static Mega Menu Dropdown */}
                {activeDropdown && (
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 transition-all duration-300 ease-out"
                    style={{
                      opacity: activeDropdown ? 1 : 0,
                      transform: activeDropdown ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(-10px) scale(0.95)',
                      pointerEvents: activeDropdown ? 'auto' : 'none'
                    }}
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
                        setHoveredSubcategory(null);
                      }, 50);
                    }}
                  >
                    <div 
                      className="bg-white shadow-xl border border-gray-200 rounded-xl transition-all duration-300 ease-out"
                      style={{ 
                        width: '90vw',
                        maxWidth: '1200px',
                        maxHeight: '70vh',
                        transform: 'translateY(0)',
                        opacity: 1
                      }}
                      role="menu"
                      aria-label={`${activeCategory} menu`}
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
                          {/* Column 1 - Subcategories (Reduced Width) */}
                          <div 
                            className="flex-shrink-0 border-r border-gray-100"
                            style={{ 
                              width: '35%',
                              minWidth: '280px',
                              maxWidth: '350px',
                              flexBasis: '35%'
                            }}
                          >
                            <div className="px-6">
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 whitespace-nowrap">
                                {(() => {
                                  const currentCategory = categories.find(cat => cat.name === activeCategory);
                                  return currentCategory ? `${currentCategory.name} Subcategories` : 'Subcategories';
                                })()}
                              </h3>
                              
                              {(() => {
                                const currentCategory = categories.find(cat => cat.name === activeCategory);
                                if (!currentCategory) return null;
                                
                                return subcategories[currentCategory.slug] && subcategories[currentCategory.slug].length > 0 ? (
                                  <div className="space-y-4" role="menu">
                                    {subcategories[currentCategory.slug].map((subcategory, index) => (
                                      <div key={subcategory.slug} className="min-w-0">
                                        <button
                                          className={`block w-full py-2 text-sm text-left transition-all duration-300 ease-out group hover:translate-x-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 rounded whitespace-nowrap overflow-hidden text-ellipsis ${
                                            hoveredSubcategory?.slug === subcategory.slug 
                                              ? 'text-primary-600 bg-primary-50 border-l-2 border-primary-600' 
                                              : 'text-gray-700 hover:text-primary-600'
                                          }`}
                                          style={{ 
                                            animationDelay: `${index * 50}ms`,
                                            opacity: 0,
                                            transform: 'translateX(-10px)',
                                            animation: 'slideInFade 0.3s ease-out forwards',
                                            animationDelay: `${index * 50}ms`
                                          }}
                                          onMouseEnter={() => {
                                            console.log('Hovering on subcategory:', subcategory.name);
                                            console.log('Available sub-subcategories for this subcategory:', subSubcategories[subcategory.slug]);
                                            setHoveredSubcategory(subcategory);
                                          }}
                                          role="menuitem"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <ChevronRight className={`w-3 h-3 transition-all duration-200 group-hover:translate-x-1 flex-shrink-0 ${
                                              hoveredSubcategory?.slug === subcategory.slug 
                                                ? 'text-primary-600' 
                                                : 'text-gray-400 group-hover:text-primary-600'
                                            }`} />
                                            <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{subcategory.name}</span>
                                          </div>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500 py-4 animate-in fade-in duration-200">
                                    No subcategories available
                                  </div>
                                );
                              })()}
                              
                              <div className="mt-6 pt-6 border-t border-gray-100">
                                {(() => {
                                  const currentCategory = categories.find(cat => cat.name === activeCategory);
                                  if (!currentCategory) return null;
                                  return (
                                    <Link
                                      href={`/category/${currentCategory.slug}`}
                                      className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 rounded whitespace-nowrap"
                                      onClick={() => setActiveDropdown(null)}
                                      role="menuitem"
                                    >
                                      <span className="whitespace-nowrap">Shop All {currentCategory.name}</span>
                                      <ArrowRight className="w-4 h-4 flex-shrink-0" />
                                    </Link>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>

                          {/* Column 2 - Sub-subcategories (Expanded Width) */}
                          <div 
                            className="flex-shrink-0"
                            style={{ 
                              width: '65%',
                              minWidth: '450px',
                              maxWidth: '750px',
                              flexBasis: '65%'
                            }}
                          >
                            <div className="px-6">
                              {(() => {
                                const currentCategory = categories.find(cat => cat.name === activeCategory);
                                if (!currentCategory) return null;
                                
                                // Show only the hovered subcategory's sub-subcategories
                                if (hoveredSubcategory && subSubcategories[hoveredSubcategory.slug] && subSubcategories[hoveredSubcategory.slug].length > 0) {
                                  console.log('Displaying sub-subcategories for:', hoveredSubcategory.name, subSubcategories[hoveredSubcategory.slug]);
                                  return (
                                    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 whitespace-nowrap">
                                        {hoveredSubcategory.name}
                                      </h3>
                                      <GenericSubcategoryGrid 
                                        subSubcategories={subSubcategories[hoveredSubcategory.slug]}
                                        onLinkClick={() => setActiveDropdown(null)}
                                        subcategoryName={hoveredSubcategory.name}
                                      />
                                    </div>
                                  );
                                }
                                
                                // Show placeholder when no subcategory is hovered
                                return (
                                  <div className="flex items-center justify-center h-full text-gray-400">
                                    <div className="text-center">
                                      <Grid3x3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                      <p className="text-sm">Hover over a subcategory to view items</p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
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
    </>
  );
};

export default AlcantaraHeader;
