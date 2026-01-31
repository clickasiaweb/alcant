import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, X, Menu, Search, User, ShoppingBag, Globe } from 'lucide-react';

const MegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const timeoutRef = useRef(null);

  const navigationData = {
    'new-arrivals': {
      title: 'New Arrivals',
      icon: '✨',
      subcategories: [
        { name: 'Just Added', href: '/new-arrivals/just-added' },
        { name: 'This Week', href: '/new-arrivals/this-week' },
        { name: 'Exclusive Online', href: '/new-arrivals/exclusive' },
        { name: 'Limited Edition', href: '/new-arrivals/limited' }
      ],
      featuredImage: '/api/placeholder/400/300',
      featuredText: 'Discover our latest collection'
    },
    'clothing': {
      title: 'Clothing',
      icon: '👔',
      subcategories: [
        { name: 'Tops & Blouses', href: '/clothing/tops' },
        { name: 'Dresses', href: '/clothing/dresses' },
        { name: 'Pants & Skirts', href: '/clothing/bottoms' },
        { name: 'Outerwear', href: '/clothing/outerwear' },
        { name: 'Activewear', href: '/clothing/activewear' },
        { name: 'Loungewear', href: '/clothing/loungewear' }
      ],
      featuredImage: '/api/placeholder/400/300',
      featuredText: 'Elevate your everyday style'
    },
    'accessories': {
      title: 'Accessories',
      icon: '👜',
      subcategories: [
        { name: 'Bags & Purses', href: '/accessories/bags' },
        { name: 'Jewelry', href: '/accessories/jewelry' },
        { name: 'Scarves & Wraps', href: '/accessories/scarves' },
        { name: 'Belts', href: '/accessories/belts' },
        { name: 'Hats & Caps', href: '/accessories/hats' },
        { name: 'Sunglasses', href: '/accessories/sunglasses' }
      ],
      featuredImage: '/api/placeholder/400/300',
      featuredText: 'Complete your look'
    },
    'shoes': {
      title: 'Shoes',
      icon: '👠',
      subcategories: [
        { name: 'Sneakers', href: '/shoes/sneakers' },
        { name: 'Heels', href: '/shoes/heels' },
        { name: 'Flats', href: '/shoes/flats' },
        { name: 'Boots', href: '/shoes/boots' },
        { name: 'Sandals', href: '/shoes/sandals' },
        { name: 'Athletic', href: '/shoes/athletic' }
      ],
      featuredImage: '/api/placeholder/400/300',
      featuredText: 'Step out in style'
    },
    'beauty': {
      title: 'Beauty',
      icon: '💄',
      subcategories: [
        { name: 'Skincare', href: '/beauty/skincare' },
        { name: 'Makeup', href: '/beauty/makeup' },
        { name: 'Fragrance', href: '/beauty/fragrance' },
        { name: 'Hair Care', href: '/beauty/hair-care' },
        { name: 'Body Care', href: '/beauty/body-care' }
      ],
      featuredImage: '/api/placeholder/400/300',
      featuredText: 'Radiate beauty inside and out'
    }
  };

  const handleMouseEnter = (menuKey) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleMobileCategoryToggle = (categoryKey) => {
    setExpandedMobileCategory(expandedMobileCategory === categoryKey ? null : categoryKey);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <div className="container">
          <ul className="flex items-center justify-center space-x-8 py-4">
            {Object.entries(navigationData).map(([key, item]) => (
              <li
                key={key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                    activeMenu === key 
                      ? 'text-primary-600' 
                      : 'text-secondary-700 hover:text-primary-600'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeMenu === key ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Mega Dropdown */}
                {activeMenu === key && (
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-6xl bg-white shadow-mega-menu rounded-lg border border-ui-border mt-2 z-50 animate-mega-menu"
                    onMouseEnter={() => clearTimeout(timeoutRef.current)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      marginLeft: 'calc(-50vw + 50%)',
                      left: '50%',
                      right: 'auto'
                    }}
                  >
                    <div className="grid grid-cols-12 gap-8 p-8 max-h-96 overflow-y-auto">
                      {/* Left Column - Main Categories */}
                      <div className="col-span-12 lg:col-span-3">
                        <h3 className="font-semibold text-primary-800 mb-4">{item.title}</h3>
                        <ul className="space-y-2">
                          {item.subcategories.map((subcat, idx) => (
                            <li key={idx}>
                              <Link
                                href={subcat.href}
                                className="block py-2 text-sm text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                              >
                                {subcat.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Center Columns - Additional Categories */}
                      <div className="col-span-12 lg:col-span-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-medium text-primary-700 mb-3">Shop by</h4>
                            <ul className="space-y-2">
                              <li>
                                <Link href="#" className="block py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                                  New Arrivals
                                </Link>
                              </li>
                              <li>
                                <Link href="#" className="block py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                                  Best Sellers
                                </Link>
                              </li>
                              <li>
                                <Link href="#" className="block py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                                  Sale Items
                                </Link>
                              </li>
                              <li>
                                <Link href="#" className="block py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                                  Exclusive
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-700 mb-3">Collections</h4>
                            <ul className="space-y-2">
                              <li>
                                <Link href="#" className="block py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                                  Summer Essentials
                                </Link>
                              </li>
                              <li>
                                <Link href="#" className="block py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                                  Work Wardrobe
                                </Link>
                              </li>
                              <li>
                                <Link href="#" className="block py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                                  Weekend Casual
                                </Link>
                              </li>
                              <li>
                                <Link href="#" className="block py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                                  Special Occasion
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Featured Image */}
                      <div className="col-span-12 lg:col-span-4">
                        <div className="relative group cursor-pointer">
                          <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden">
                            <div className="w-full h-64 flex items-center justify-center">
                              <span className="text-primary-600 text-lg">Featured Collection</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg flex items-end p-6">
                            <div className="text-white">
                              <h4 className="font-semibold text-lg mb-1">{item.featuredText}</h4>
                              <p className="text-sm opacity-90">Explore latest trends</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-ui-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-ui-border">
            <h2 className="text-lg font-semibold text-primary-800">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <X className="w-5 h-5 text-secondary-600" />
            </button>
          </div>
          
          <div className="overflow-y-auto h-full pb-20">
            {Object.entries(navigationData).map(([key, item]) => (
              <div key={key} className="border-b border-ui-divider">
                <button
                  onClick={() => handleMobileCategoryToggle(key)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span>{item.icon}</span>
                    <span className="font-medium text-secondary-800">{item.title}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform ${
                    expandedMobileCategory === key ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {expandedMobileCategory === key && (
                  <div className="bg-primary-50 px-4 py-2 animate-slide-down">
                    <ul className="space-y-1">
                      {item.subcategories.map((subcat, idx) => (
                        <li key={idx}>
                          <Link
                            href={subcat.href}
                            className="block py-2 pl-8 text-sm text-secondary-600 hover:text-primary-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subcat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenu;
