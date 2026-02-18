import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(4);
  const router = useRouter();
  const megaMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Navigation structure with mega menu data
  const navigationItems = [
    {
      name: "Products",
      href: "/products",
      hasMegaMenu: true,
      megaMenu: {
        title: "Product Categories",
        categories: [
          {
            title: "Phone Cases",
            href: "/category/phone-cases",
            description: "Premium Alcantara cases for your smartphones",
            image: "https://via.placeholder.com/300x200/1a365d/ffffff?text=Phone+Cases",
            subcategories: [
              { name: "iPhone Cases", href: "/category/phone-cases?filter=iphone" },
              { name: "Samsung Cases", href: "/category/phone-cases?filter=samsung" },
              { name: "Universal Cases", href: "/category/phone-cases?filter=universal" }
            ]
          },
          {
            title: "Accessories",
            href: "/category/accessories",
            description: "Premium Alcantara accessories for your devices",
            image: "https://via.placeholder.com/300x200/2c5282/ffffff?text=Accessories",
            subcategories: [
              { name: "Screen Protectors", href: "/category/accessories?filter=screen-protectors" },
              { name: "Chargers & Cables", href: "/category/accessories?filter=chargers" },
              { name: "Phone Stands", href: "/category/accessories?filter=stands" }
            ]
          },
          {
            title: "Wallets",
            href: "/category/wallets",
            description: "Premium Alcantara wallets and card holders",
            image: "https://via.placeholder.com/300x200/2b6cb0/ffffff?text=Wallets",
            subcategories: [
              { name: "Card Holders", href: "/category/wallets?filter=card-holders" },
              { name: "Bifold Wallets", href: "/category/wallets?filter=bifold" },
              { name: "Travel Wallets", href: "/category/wallets?filter=travel" }
            ]
          },
          {
            title: "Car & Travel",
            href: "/category/car-travel",
            description: "Premium Alcantara car and travel accessories",
            image: "https://via.placeholder.com/300x200/3182ce/ffffff?text=Car+Travel",
            subcategories: [
              { name: "Car Accessories", href: "/category/car-travel?filter=car" },
              { name: "Travel Cases", href: "/category/car-travel?filter=travel" },
              { name: "Luggage Tags", href: "/category/car-travel?filter=luggage" }
            ]
          },
          {
            title: "Office",
            href: "/category/office",
            description: "Premium Alcantara office accessories",
            image: "https://via.placeholder.com/300x200/2d3748/ffffff?text=Office",
            subcategories: [
              { name: "Desk Mats", href: "/category/office?filter=desk-mats" },
              { name: "Mouse Pads", href: "/category/office?filter=mouse-pads" },
              { name: "Organizers", href: "/category/office?filter=organizers" }
            ]
          },
          {
            title: "Sale",
            href: "/category/sale",
            description: "Special offers and discounted items",
            image: "https://via.placeholder.com/300x200/dc2626/ffffff?text=Sale",
            subcategories: [
              { name: "Blue Monday Sale", href: "/category/sale?filter=blue-monday" },
              { name: "Clearance Items", href: "/category/sale?filter=clearance" },
              { name: "Limited Offers", href: "/category/sale?filter=limited" }
            ]
          }
        ],
        featured: {
          title: "Featured Products",
          products: [
            {
              name: "Premium Phone Case - iPhone 17 Pro",
              price: "$89.99",
              image: "https://via.placeholder.com/200x150/1a365d/ffffff?text=iPhone+Case",
              href: "/category/phone-cases/iphone-17-pro"
            },
            {
              name: "Alcantara Wallet - Classic Black",
              price: "$129.99",
              image: "https://via.placeholder.com/200x150/2c5282/ffffff?text=Wallet",
              href: "/category/wallets/classic-black"
            },
            {
              name: "Car Seat Cover Set - Premium",
              price: "$299.99",
              image: "https://via.placeholder.com/200x150/2b6cb0/ffffff?text=Car+Cover",
              href: "/category/car-travel/seat-covers"
            }
          ]
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
            href: "/category/accessories?filter=new",
            description: "Latest Alcantara products",
            image: "https://via.placeholder.com/300x200/1a365d/ffffff?text=New+Arrivals",
            subcategories: [
              { name: "This Week", href: "/category/accessories?filter=this-week" },
              { name: "This Month", href: "/category/accessories?filter=this-month" },
              { name: "Limited Edition", href: "/category/accessories?filter=limited" }
            ]
          },
          {
            title: "Best Sellers",
            href: "/products?filter=best-sellers",
            description: "Most popular Alcantara items",
            image: "https://via.placeholder.com/300x200/2c5282/ffffff?text=Best+Sellers",
            subcategories: [
              { name: "Phone Cases", href: "/category/phone-cases?filter=best-sellers" },
              { name: "Wallets", href: "/category/wallets?filter=best-sellers" },
              { name: "Car Accessories", href: "/category/car-travel?filter=best-sellers" }
            ]
          },
          {
            title: "Gift Sets",
            href: "/collections/gift-sets",
            description: "Curated Alcantara gift collections",
            image: "https://via.placeholder.com/300x200/2b6cb0/ffffff?text=Gift+Sets",
            subcategories: [
              { name: "Premium Sets", href: "/collections/gift-sets?filter=premium" },
              { name: "Corporate Gifts", href: "/collections/gift-sets?filter=corporate" },
              { name: "Personal Gifts", href: "/collections/gift-sets?filter=personal" }
            ]
          }
        ],
        featured: {
          title: "Featured Collections",
          products: [
            {
              name: "Complete Phone Protection Kit",
              description: "Full Alcantara phone accessory set",
              image: "https://via.placeholder.com/200x150/1a365d/ffffff?text=Phone+Kit",
              href: "/collections/phone-protection"
            },
            {
              name: "Executive Office Set",
              description: "Premium Alcantara office collection",
              image: "https://via.placeholder.com/200x150/2c5282/ffffff?text=Office+Set",
              href: "/collections/executive-office"
            },
            {
              name: "Car Interior Premium Pack",
              description: "Complete Alcantara car accessories",
              image: "https://via.placeholder.com/200x150/2b6cb0/ffffff?text=Car+Pack",
              href: "/collections/car-premium"
            }
          ]
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
          },
          {
            title: "Contact Us",
            href: "/contact",
            description: "Get in touch with our team",
            image: "https://via.placeholder.com/300x200/2b6cb0/ffffff?text=Contact",
            subcategories: [
              { name: "Customer Service", href: "/contact/customer-service" },
              { name: "Technical Support", href: "/contact/technical" },
              { name: "Partnership Inquiries", href: "/contact/partnerships" }
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
              image: "https://via.placeholder.com/200x150/2b6cb0/ffffff?text=FAQ",
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
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="text-sm text-gray-600 hover:text-primary-600 transition-colors block"
                          >
                            {sub.name}
                          </Link>
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
                        <div className="ml-4 space-y-1">
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
