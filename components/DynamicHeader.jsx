import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  ChevronDown,
  Menu,
  X,
  Package
} from "lucide-react";
import { categoryService } from "../services/categoryService";

export default function DynamicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const router = useRouter();
  const megaMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Refresh data function
  const refreshHeaderData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch categories with hierarchy
      const categoriesData = await categoryService.getCategoriesWithHierarchy();
      const categoriesList = categoriesData.data || [];
      
      // Transform categories for navigation
      const navigationCategories = categoriesList.map(category => ({
        title: category.name,
        href: `/category/${category.slug}`,
        description: category.description || `Premium Alcantara ${category.name.toLowerCase()}`,
        image: `https://via.placeholder.com/300x200/1a365d/ffffff?text=${encodeURIComponent(category.name)}`,
        subcategories: (category.subcategories || []).map(sub => ({
          name: sub.name,
          href: `/category/${category.slug}?subcategory=${sub.slug}`
        })),
        sub_subcategories: (category.subcategories || []).reduce((acc, sub) => {
          if (sub.sub_subcategories && sub.sub_subcategories.length > 0) {
            acc.push(...sub.sub_subcategories.map(subSub => ({
              name: subSub.name,
              href: `/category/${category.slug}?subcategory=${sub.slug}&subsubcategory=${subSub.slug}`,
              parent_subcategory: sub.name
            })));
          }
          return acc;
        }, [])
      }));

      setCategories(navigationCategories);

      // Fetch featured products
      const featuredData = await categoryService.getFeaturedProducts();
      const featuredProducts = featuredData.data?.slice(0, 3) || [];
      setFeaturedProducts(featuredProducts);
      
      setLastUpdated(Date.now());
      
    } catch (error) {
      console.error('❌ Error refreshing header data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories and featured products
  useEffect(() => {
    refreshHeaderData();
  }, [refreshHeaderData]);

  // Set up periodic refresh (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshHeaderData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refreshHeaderData]);

  // Refresh data when window gains focus (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshHeaderData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshHeaderData]);

  // Navigation structure with dynamic data
  const navigationItems = useMemo(() => [
    {
      name: "Products",
      href: "/products",
      hasMegaMenu: true,
      megaMenu: {
        title: "Product Categories",
        categories: categories,
        featured: {
          title: "Featured Products",
          products: featuredProducts.map(product => ({
            name: product.name,
            description: product.description || 'Premium Alcantara product',
            price: `$${product.price || '89.99'}`,
            image: product.image || `https://via.placeholder.com/200x150/1a365d/ffffff?text=${encodeURIComponent(product.name)}`,
            href: `/product/${product.slug || product.id}`
          }))
        }
      }
    },
    {
      name: "Collections",
      href: "/collections",
      hasMegaMenu: true,
      megaMenu: {
        title: "Product Collections",
        categories: [
          {
            title: "New Arrivals",
            href: "/products?filter=new",
            description: "Latest Alcantara products",
            image: "https://via.placeholder.com/300x200/1a365d/ffffff?text=New+Arrivals",
            subcategories: [
              { name: "This Week", href: "/products?filter=new&period=week" },
              { name: "This Month", href: "/products?filter=new&period=month" },
              { name: "Limited Edition", href: "/products?filter=limited" }
            ]
          },
          {
            title: "Best Sellers",
            href: "/products?filter=best-sellers",
            description: "Most popular Alcantara items",
            image: "https://via.placeholder.com/300x200/2c5282/ffffff?text=Best+Sellers",
            subcategories: categories.slice(0, 3).map(cat => ({
              name: cat.title,
              href: `${cat.href}?filter=best-sellers`
            }))
          }
        ],
        featured: {
          title: "Featured Collections",
          products: featuredProducts.slice(0, 3).map(product => ({
            name: product.name,
            description: `Complete ${product.category || 'Alcantara'} collection`,
            image: product.image || `https://via.placeholder.com/200x150/1a365d/ffffff?text=${encodeURIComponent(product.name)}`,
            href: `/collection/${product.slug || product.id}`
          }))
        }
      }
    },
    {
      name: "Support",
      href: "/support",
      hasMegaMenu: true,
      megaMenu: {
        title: "Customer Support & Resources",
        categories: [
          {
            title: "Product Care",
            href: "/support/product-care",
            description: "How to care for your Alcantara products",
            image: "https://via.placeholder.com/300x200/1a365d/ffffff?text=Product+Care",
            subcategories: [
              { name: "Cleaning Guide", href: "/support/product-care/cleaning" },
              { name: "Maintenance Tips", href: "/support/product-care/maintenance" },
              { name: "Warranty Info", href: "/support/product-care/warranty" }
            ]
          },
          {
            title: "Shipping & Returns",
            href: "/support/shipping",
            description: "Delivery and return policies",
            image: "https://via.placeholder.com/300x200/2c5282/ffffff?text=Shipping",
            subcategories: [
              { name: "Delivery Options", href: "/support/shipping/delivery" },
              { name: "Return Policy", href: "/support/shipping/returns" },
              { name: "Track Order", href: "/support/shipping/tracking" }
            ]
          }
        ],
        featured: {
          title: "Popular Resources",
          products: [
            {
              name: "Alcantara Care Guide",
              description: "Complete care instructions",
              image: "https://via.placeholder.com/200x150/1a365d/ffffff?text=Care+Guide",
              href: "/support/care-guide"
            },
            {
              name: "Size Guide",
              description: "Find the perfect fit",
              image: "https://via.placeholder.com/200x150/2c5282/ffffff?text=Size+Guide",
              href: "/support/size-guide"
            },
            {
              name: "FAQs",
              description: "Frequently asked questions",
              image: "https://via.placeholder.com/200x150/2c5282/ffffff?text=FAQ",
              href: "/support/faq"
            }
          ]
        }
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
  ], [categories, featuredProducts]);

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
                      
                      {/* Subcategories */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="text-sm text-gray-600 hover:text-primary-600 transition-colors block"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      {/* Sub-subcategories */}
                      {category.sub_subcategories && category.sub_subcategories.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 mb-1">More Options:</p>
                          {category.sub_subcategories
                            .filter(subSub => subSub && subSub.name) // Filter out undefined/null entries
                            .slice(0, 3)
                            .map((subSub, index) => (
                              <Link
                                key={`${subSub.name}-${index}`}
                                href={subSub.href || '#'}
                                className="text-xs text-gray-500 hover:text-primary-600 transition-colors block"
                                title={`${subSub.name} (${subSub.parent_subcategory || 'Unknown'})`}
                              >
                                {subSub.name}
                              </Link>
                            ))}
                          {category.sub_subcategories.filter(subSub => subSub && subSub.name).length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{category.sub_subcategories.filter(subSub => subSub && subSub.name).length - 3} more
                            </span>
                          )}
                        </div>
                      )}
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

  if (loading) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container">
          <div className="flex justify-between items-center py-4">
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="hidden lg:flex space-x-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

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
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 hidden sm:inline">
              ALCANSIDE
            </span>
          </Link>

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
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="max-h-96 overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => handleMegaMenuToggle(item.name)}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  {item.hasMegaMenu && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      activeMegaMenu === item.name ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>
                
                {/* Mobile Mega Menu */}
                {activeMegaMenu === item.name && item.megaMenu && (
                  <div className="bg-gray-50 px-4 py-2">
                    {item.megaMenu.categories.map((category) => (
                      <div key={category.title} className="mb-4">
                        <Link
                          href={category.href}
                          className="block font-medium text-gray-900 mb-2 hover:text-primary-600 transition-colors"
                        >
                          {category.title}
                        </Link>
                        
                        {/* Subcategories */}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="ml-4 space-y-1 mb-2">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                        
                        {/* Sub-subcategories */}
                        {category.sub_subcategories && category.sub_subcategories.length > 0 && (
                          <div className="ml-8 space-y-1">
                            <p className="text-xs font-medium text-gray-500 mb-1">More Options:</p>
                            {category.sub_subcategories
                              .filter(subSub => subSub && subSub.name) // Filter out undefined/null entries
                              .slice(0, 3)
                              .map((subSub, index) => (
                                <Link
                                  key={`${subSub.name}-${index}`}
                                  href={subSub.href || '#'}
                                  className="block text-xs text-gray-500 hover:text-primary-600 transition-colors"
                                  title={`${subSub.name} (${subSub.parent_subcategory || 'Unknown'})`}
                                >
                                  {subSub.name}
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
            
            {/* Mobile Actions */}
            <div className="border-t border-gray-200 px-4 py-4 space-y-3">
              <Link
                href="/wishlist"
                className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist ({wishlistCount})</span>
              </Link>
              <Link
                href="/cart"
                className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart ({cartCount})</span>
              </Link>
              <Link
                href="/account"
                className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Account</span>
              </Link>
              <Link
                href="/products"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center"
              >
                Shop Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
