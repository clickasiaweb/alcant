import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import X from "lucide-react/dist/esm/icons/x";

const CategoryMegaMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // Fetch categories from backend
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const data = await res.json();
        if (!mounted) return;
        const items = (data.categories || []).map((c) => ({
          id: c._id,
          name: c.name,
          icon: "📁",
          subcategories: (c.subcategories || []).map((s) => s.name),
          image: "/api/placeholder/400/300",
          color: "#1a365d",
          slug: c.slug,
          subcategorySlugs: (c.subcategories || []).map((s) => s.slug),
        }));
        setCategories(items);
      } catch (e) {
        // fail silently to not block header UI
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle mouse enter with delay
  const handleMouseEnter = (categoryId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(categoryId);
    }, 150);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 350); // PRD: 300–400ms close delay
  };

  // Close dropdown when clicking outside
  const handleDropdownClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveCategory(null);
    }
  };

  // Close on escape key
  const handleEscapeKey = (event) => {
    if (event.key === "Escape") setActiveCategory(null);
  };

  // Mobile category toggle
  const toggleMobileCategory = (categoryId) => {
    setExpandedMobileCategory(expandedMobileCategory === categoryId ? null : categoryId);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedMobileCategory(null);
  };

  // Click outside / keydown
  useEffect(() => {
    document.addEventListener("mousedown", handleDropdownClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleDropdownClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Get active category data
  const activeCategoryData = categories.find((cat) => cat.id === activeCategory);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block border-b border-gray-200 bg-white">
        <div className="container">
          <div className="flex items-center justify-center space-x-8 py-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-900 transition-colors duration-200 font-medium py-2"
                  aria-expanded={activeCategory === category.id}
                  aria-controls={`mega-dropdown-${category.id}`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.name}</span>
                  <ChevronRight className="w-4 h-4 transform rotate-90" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mega Dropdown */}
        {activeCategory && activeCategoryData && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-30 transition-all duration-300 ease-in-out"
            style={{
              maxHeight: "calc(100vh - 120px)",
              overflow: "hidden",
              transform: "translateY(8px)",
            }}
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveCategory(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Close dropdown"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <div className="container" style={{ maxWidth: "1100px" }}>
              <div
                className="grid grid-cols-12 gap-6 p-6"
                style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
              >
                {/* Left Column - Categories */}
                <div className="col-span-3">
                  <h3 className="text-base font-semibold text-primary-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center space-x-2 text-left p-2 rounded-md transition-all duration-200 ${
                          activeCategory === category.id
                            ? "bg-primary-50 text-primary-900 border-l-4 border-primary-900"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="text-lg transform transition-transform duration-200 hover:scale-110">
                          {category.icon}
                        </span>
                        <span className="font-medium text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Middle Columns - Subcategories */}
                <div className="col-span-6">
                  <h3 className="text-base font-semibold text-primary-900 mb-4">{activeCategoryData.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {activeCategoryData.subcategories.map((subcategory, index) => (
                      <Link
                        key={index}
                        href={`/category/${activeCategoryData.slug}/${activeCategoryData.subcategorySlugs[index]}`}
                        className="group flex items-center space-x-2 text-gray-600 hover:text-primary-900 transition-colors duration-200 py-1"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <span className="border-b border-transparent group-hover:border-primary-900 transition-colors duration-200 text-sm">
                          {subcategory}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right Panel - Image */}
                <div className="col-span-3 hidden lg:block">
                  <div className="relative overflow-hidden rounded-lg">
                    <div
                      className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center transition-opacity duration-300"
                      style={{ backgroundColor: activeCategoryData.color + "20" }}
                    >
                      <span className="text-gray-500 text-sm">{activeCategoryData.name} Collection</span>
                    </div>
                    <div className="mt-3 text-center">
                      <Link
                        href={`/category/${activeCategoryData.slug}`}
                        className="inline-flex items-center bg-primary-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800 transition-colors duration-200"
                      >
                        View Collection
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-primary-900">Categories</h2>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-primary-900 text-white"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />

            {/* Slide-in Panel */}
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-lg font-semibold text-primary-900">Menu</h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Categories List */}
                  <div className="p-4">
                    {categories.map((category) => (
                      <div key={category.id} className="border-b border-gray-100">
                        <button
                          onClick={() => toggleMobileCategory(category.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                          style={{ minHeight: "44px" }}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-medium text-gray-900">{category.name}</span>
                          </div>
                          <ChevronRight
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                              expandedMobileCategory === category.id ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {/* Subcategories Accordion */}
                        {expandedMobileCategory === category.id && (
                          <div className="bg-gray-50 px-4 py-3 animate-fade-in">
                            <div className="space-y-3">
                              {category.subcategories.map((subcategory, index) => (
                                <Link
                                  key={index}
                                  href={`/category/${category.slug}/${category.subcategorySlugs[index]}`}
                                  className="block py-2 text-gray-600 hover:text-primary-900 transition-colors duration-200"
                                  onClick={closeMobileMenu}
                                >
                                  {subcategory}
                                </Link>
                              ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <Link
                                href={`/category/${category.slug}`}
                                className="inline-flex items-center bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors duration-200"
                                onClick={closeMobileMenu}
                              >
                                View Collection
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default CategoryMegaMenu;
