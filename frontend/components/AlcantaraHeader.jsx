import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronRight, ChevronDown, Grid3x3, Star, ArrowRight, Smartphone, Headphones, Wallet, Car, ShoppingBag, LogOut, Package, Settings } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { productService } from '../lib/productService';
import GenericSubcategoryGrid from './GenericSubcategoryGrid';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

// Logo component
const Logo = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    small: "text-lg",
    default: "text-xl",
    large: "text-2xl"
  };
  
  return (
    <div className={`font-bold text-primary-600 ${sizeClasses[size]} ${className}`}>
      ΛʟcΛɴᴛ
    </div>
  );
};

const AlcantaraHeader = () => {
  const router = useRouter();
  // Memoize context values to prevent re-renders
  const { cartItems, openCart, calculateTotalItems } = useCart();
  const { wishlistItems, openWishlist, getWishlistCount, isInWishlist } = useWishlist();
  const { openSearch } = useSearch();
  
  // Handle contexts with proper fallbacks for SSR
  let authContext;
  try {
    authContext = useSupabaseAuth();
  } catch (error) {
    // Fallback for SSR when context is not available
    authContext = {
      isAuthenticated: () => false,
      user: null,
      logout: async () => {}
    };
  }
  const { isAuthenticated, user, logout } = authContext;

  // Handle SupabaseCart context with fallback for SSR
  let supabaseCartContext;
  try {
    supabaseCartContext = useSupabaseCart();
  } catch (error) {
    // Fallback for SSR when context is not available
    supabaseCartContext = {
      cartItems: [],
      calculateSubtotal: () => 0,
      calculateTotalItems: () => 0,
      clearCart: async () => {}
    };
  }
  
  // Memoize counts to prevent unnecessary recalculations
  const cartItemCount = useMemo(() => calculateTotalItems(), [calculateTotalItems]);
  const wishlistCount = useMemo(() => getWishlistCount(), [getWishlistCount]);
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
  const [mobileNavStack, setMobileNavStack] = useState([]);
  const dropdownTimeoutRef = useRef(null);
  const categoryButtonRefs = useRef({});
  const userMenuRef = useRef(null);
  const isMounted = useRef(true);
  const hasFetchedData = useRef(false);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle user menu clicks
  const handleUserMenuClick = () => {
    if (isAuthenticated()) {
      setIsProfileOpen(!isProfileOpen);
    } else {
      router.push('/login');
    }
  };

  // Fetch products for a category
  const fetchCategoryProducts = useCallback(async (categorySlug) => {
    try {
      if (!isMounted.current) return;
      setProductsLoading(prev => ({ ...prev, [categorySlug]: true }));
      const productsData = await productService.getProductsByCategory(categorySlug, { limit: 8 });
      if (isMounted.current) {
        setCategoryProducts(prev => ({ ...prev, [categorySlug]: productsData.products || [] }));
      }
    } catch (error) {
      console.error('Failed to fetch category products:', error);
      if (isMounted.current) {
        setCategoryProducts(prev => ({ ...prev, [categorySlug]: [] }));
      }
    } finally {
      if (isMounted.current) {
        setProductsLoading(prev => ({ ...prev, [categorySlug]: false }));
      }
    }
  }, []);

  // Fetch sub-subcategories for a subcategory
  const fetchSubSubcategories = useCallback(async (categorySlug, subcategorySlug) => {
    try {
      if (!isMounted.current) return;
      setSubSubcategoriesLoading(prev => ({ ...prev, [subcategorySlug]: true }));
      const subSubcategoriesData = await categoryService.getSubSubcategories(categorySlug, subcategorySlug);
      if (isMounted.current) {
        setSubSubcategories(prev => ({ ...prev, [subcategorySlug]: subSubcategoriesData }));
      }
    } catch (error) {
      console.error('Failed to fetch sub-subcategories:', error);
      if (isMounted.current) {
        setSubSubcategories(prev => ({ ...prev, [subcategorySlug]: [] }));
      }
    } finally {
      if (isMounted.current) {
        setSubSubcategoriesLoading(prev => ({ ...prev, [subcategorySlug]: false }));
      }
    }
  }, []);

  // Handle subcategory selection
  const handleSubcategorySelect = (categorySlug, subcategory) => {
    setSelectedSubcategory(subcategory);
    fetchSubSubcategories(categorySlug, subcategory.slug);
  };

  // Fetch categories and subcategories - optimized with debouncing
  useEffect(() => {
    const fetchData = async () => {
      // Prevent multiple fetches
      if (hasFetchedData.current || !isMounted.current) return;
      hasFetchedData.current = true;
      
      try {
        setLoading(true);
        
        // Use hierarchy endpoint to get all data at once
        const categoriesData = await categoryService.getCategoriesWithHierarchy();
        
        if (!isMounted.current) return;
        
        const categoriesList = categoriesData.data || [];
        setCategories(categoriesList);

        // Extract subcategories from hierarchy data - optimized
        const subcategoriesData = {};
        const subSubcategoriesData = {};
        
        for (const category of categoriesList) {
          subcategoriesData[category.slug] = category.subcategories || [];
          
          // Extract sub-subcategories for each subcategory
          if (category.subcategories) {
            for (const sub of category.subcategories) {
              if (sub.sub_subcategories && sub.sub_subcategories.length > 0) {
                subSubcategoriesData[sub.slug] = sub.sub_subcategories;
              }
            }
          }
        }
        
        if (isMounted.current) {
          setSubcategories(subcategoriesData);
          setSubSubcategories(subSubcategoriesData);
        }
        
      } catch (err) {
        console.error('AlcantaraHeader: Failed to fetch data:', err);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoize categories lookup to prevent unnecessary finds
  const categoriesMap = useMemo(() => {
    const map = {};
    categories.forEach(cat => {
      map[cat.name] = cat;
    });
    return map;
  }, [categories]);

  // Handle dropdown hover with delay
  const handleDropdownEnter = useCallback(async (categoryName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(categoryName);
    setActiveCategory(categoryName);
    setSelectedSubcategory(null); // Reset selected subcategory when changing category
    setHoveredSubcategory(null); // Reset hovered subcategory when changing category
    
    // Fetch products for this category if not already loaded
    const category = categoriesMap[categoryName];
    if (category && !categoryProducts[category.slug]) {
      await fetchCategoryProducts(category.slug);
    }
  }, [fetchCategoryProducts, categoriesMap]); // Use memoized categories map

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveCategory(null);
      setHoveredSubcategory(null);
    }, 50); // Reduced from 150ms to 50ms
  };

  // Add effect to control body scroll based on dropdown state
  useEffect(() => {
    if (!isMounted.current) return;
    
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
    if (!isMounted.current) return;
    
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mega-menu-container')) {
        setActiveDropdown(null);
        setActiveCategory(null);
        setHoveredSubcategory(null);
      }
      if (!e.target.closest('.user-menu-container') && !e.target.closest('.user-menu-button')) {
        setIsProfileOpen(false);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setActiveCategory(null);
        setHoveredSubcategory(null);
        setIsProfileOpen(false);
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

  // Drill-down navigation functions
  const navigateToMobileCategory = (category, level) => {
    setMobileNavStack(prev => [...prev, { category, level }]);
  };

  const navigateMobileBack = () => {
    setMobileNavStack(prev => prev.slice(0, -1));
  };

  const getCurrentMobileView = () => {
    if (mobileNavStack.length === 0) {
      return categories.map(cat => ({
        name: cat.name,
        title: cat.name,
        href: `/category/${cat.slug}`,
        image: getCategoryPromoImage(cat.name),
        subcategories: cat.subcategories || [],
        slug: cat.slug
      }));
    }
    
    const current = mobileNavStack[mobileNavStack.length - 1];
    
    // If we're at category level (level 0), show subcategories
    if (mobileNavStack.length === 1 && current.category.subcategories) {
      const result = current.category.subcategories.map(sub => ({
        name: sub.name,
        title: sub.name,
        href: `/category/${current.category.slug}?subcategory=${sub.slug}`,
        image: getCategoryPromoImage(sub.name),
        subcategories: sub.sub_subcategories || [],
        slug: sub.slug,
        parentCategorySlug: current.category.slug
      }));
      return result;
    }
    
    // If we're at subcategory level (level 1), show sub-subcategories
    if (mobileNavStack.length === 2) {
      // Find the subcategory we clicked on from the previous level
      const previousLevel = mobileNavStack[mobileNavStack.length - 2];
      if (previousLevel && previousLevel.category.subcategories) {
        const clickedSubcategory = previousLevel.category.subcategories.find(
          sub => sub.slug === current.category.slug
        );
        
        if (clickedSubcategory && clickedSubcategory.sub_subcategories) {
          const result = clickedSubcategory.sub_subcategories.map(subSub => ({
            name: subSub.name,
            title: subSub.name,
            href: `/category/${previousLevel.category.slug}?subcategory=${clickedSubcategory.slug}&subsubcategory=${subSub.slug}`,
            image: getCategoryPromoImage(subSub.name),
            subcategories: [],
            slug: subSub.slug
          }));
          return result;
        }
      }
    }
    
    return [];
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
        <div className="container px-3 sm:px-4">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="default" className="group-hover:scale-105" />
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 mega-menu-container">
              {categories.map((category) => (
                <button 
                  key={category.id}
                  ref={(el) => categoryButtonRefs.current[category.name] = el}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-gray-700 hover:text-primary-600 font-medium text-xs sm:text-sm rounded-lg hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap cursor-pointer hover:scale-105 hover:shadow-md"
                  onKeyDown={(e) => handleKeyDown(e, category.name)}
                  aria-expanded={activeDropdown === category.name}
                  aria-haspopup="true"
                  onMouseEnter={async () => {
                    await handleDropdownEnter(category.name);
                  }}
                >
                  <span className="text-gray-500 group-hover:text-primary-600 transition-colors duration-200">
                    {getCategoryIcon(category.name)}
                  </span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden text-xs">{category.name.length > 8 ? category.name.substring(0, 8) + '...' : category.name}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ml-1 ${
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
                    if (dropdownTimeoutRef.current) {
                      clearTimeout(dropdownTimeoutRef.current);
                    }
                  }}
                  onMouseLeave={() => {
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
                                return (
                                  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 whitespace-nowrap">
                                      {hoveredSubcategory.name}
                                    </h3>
                                    <GenericSubcategoryGrid 
                                      subSubcategories={subSubcategories[hoveredSubcategory.slug]}
                                      onLinkClick={() => setActiveDropdown(null)}
                                      subcategoryName={hoveredSubcategory.name}
                                      category={activeCategory}
                                      subcategory={hoveredSubcategory}
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
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search Icon */}
              <button 
                className="p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={openSearch}
                aria-label="Open search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {/* Favorites/Wishlist Icon */}
              <button 
                className="p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200 relative"
                onClick={openWishlist}
                aria-label="View wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-medium">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>
              
              {/* Shopping Cart Icon */}
              <button 
                className="p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200 relative"
                onClick={openCart}
                aria-label="View shopping cart"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-medium">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </button>
              
              {/* User Profile Icon */}
              <div className="relative user-menu-container">
                <button 
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200 user-menu-button"
                  onClick={handleUserMenuClick}
                  aria-label="User profile"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* User Dropdown Menu */}
                {isProfileOpen && isAuthenticated() && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 user-menu-container">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user?.user_metadata?.name || user?.email || 'User'}
                          </p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/account"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                      
                      <Link
                        href="/account?tab=profile"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Drill-Down Style */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute inset-x-0 bottom-0 top-16 bg-white max-w-sm mx-auto animate-in slide-in-from-bottom-2 duration-300">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  {mobileNavStack.length > 0 && (
                    <button
                      onClick={navigateMobileBack}
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                      aria-label="Go back"
                    >
                      <ChevronDown className="w-5 h-5 rotate-90" />
                    </button>
                  )}
                  <Logo size="small" />
                  <span className="text-lg font-bold text-gray-900">ΛʟcΛɴᴛ</span>
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
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                  <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors" onClick={handleUserMenuClick}>
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
                    {getCurrentMobileView().map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          if (item.subcategories && item.subcategories.length > 0) {
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
                            {getCategoryIcon(item.name)}
                          </div>
                          <span className="text-base font-medium text-gray-900">{item.name}</span>
                        </div>
                        {item.subcategories && item.subcategories.length > 0 && (
                          <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  // Category items with images
                  <div className="space-y-3">
                    {getCurrentMobileView().map((item) => {
                      const hasSubCategories = (item.subcategories && item.subcategories.length > 0);
                      
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
                    <button
                      className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors p-3 rounded-lg hover:bg-gray-50"
                      onClick={openWishlist}
                    >
                      <Heart className="w-5 h-5" />
                      <span>Wishlist ({wishlistCount})</span>
                    </button>
                    <button
                      className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors p-3 rounded-lg hover:bg-gray-50"
                      onClick={() => alert('Login functionality is currently disabled for testing. Please use the cart and checkout features.')}
                    >
                      <User className="w-5 h-5" />
                      <span>Account</span>
                    </button>
                    <button
                      className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-center font-medium w-full"
                      onClick={() => router.push('/products')}
                    >
                      Shop Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default memo(AlcantaraHeader);
