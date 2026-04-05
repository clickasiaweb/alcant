import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import CompactProductCard from "../components/CompactProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import apiClient from "../lib/api";

const ProductsPage = () => {
  const router = useRouter();
  const { subcategory, search, compatibility, brand } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    colors: [],
    brands: [],
    priceRanges: [],
    magSafe: false,
    isNew: false,
    isLimitedEdition: false,
    hasDiscount: false,
    search: search || "",
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async (filterOverrides = null) => {
    try {
      setLoading(true);
      const currentFilters = filterOverrides || filters;

      // Build API params
      const apiParams = {};

      // Add search if present
      if (currentFilters.search) {
        apiParams.search = currentFilters.search;
      }

      // Add color filters
      if (currentFilters.colors && currentFilters.colors.length > 0) {
        apiParams.colors = currentFilters.colors.join(",");
      }

      // Add brand filters
      if (currentFilters.brands && currentFilters.brands.length > 0) {
        apiParams.brands = currentFilters.brands.join(",");
      }

      // Add boolean filters
      if (currentFilters.magSafe) {
        apiParams.magSafe = "true";
      }

      if (currentFilters.isNew) {
        apiParams.isNew = "true";
      }

      if (currentFilters.isLimitedEdition) {
        apiParams.isLimitedEdition = "true";
      }

      if (currentFilters.hasDiscount) {
        apiParams.hasDiscount = "true";
      }

      // Add price range filtering
      if (currentFilters.priceRanges && currentFilters.priceRanges.length > 0) {
        const priceRanges = currentFilters.priceRanges.map(range => {
          const [min, max] = range.split('-').map(Number);
          if (max === Infinity) return { min: min.toString() };
          return { min: min.toString(), max: max.toString() };
        });
        
        // For now, just use the first range for simplicity
        if (priceRanges.length > 0) {
          const range = priceRanges[0];
          apiParams.min_price = range.min;
          if (range.max) apiParams.max_price = range.max;
        }
      }

      console.log("Fetching products with params:", apiParams);

      const response = await apiClient.get("/products", { params: apiParams });
      let products = response.data.products || [];

      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Set some mock products for demonstration
      setProducts([
        {
          _id: "1",
          name: "iPhone 17 Pro Max - ΛʟcΛɴᴛ Case - Space Grey",
          price: "7,700.00",
          originalPrice: "11,000.00",
          rating: 4.5,
          reviews: 5642,
          slug: "iphone-17-pro-max-ΛʟcΛɴᴛ-case-space-grey",
          colors: ["#3D3D3D"],
          magSafeCompatible: true,
          images: [],
        },
        {
          _id: "2",
          name: "iPhone 16 Pro - ΛʟcΛɴᴛ Case - Navy Blue",
          price: "6,500.00",
          originalPrice: "9,000.00",
          rating: 4.3,
          reviews: 3421,
          slug: "iphone-16-pro-ΛʟcΛɴᴛ-case-navy-blue",
          colors: ["#1E3A8A"],
          magSafeCompatible: true,
          images: [],
        },
        {
          _id: "3",
          name: "iPhone 15 - ΛʟcΛɴᴛ Case - Rose Gold",
          price: "5,200.00",
          originalPrice: "7,500.00",
          rating: 4.7,
          reviews: 8932,
          slug: "iphone-15-ΛʟcΛɴᴛ-case-rose-gold",
          colors: ["#F59E0B"],
          magSafeCompatible: false,
          images: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    let newFilters;

    if (filterType === "clearAll") {
      newFilters = {
        colors: [],
        brands: [],
        priceRanges: [],
        magSafe: false,
        isNew: false,
        isLimitedEdition: false,
        hasDiscount: false,
        search: "",
      };
    } else if (filterType === 'colors') {
      newFilters = { ...filters, colors: value };
    } else if (filterType === 'brands') {
      newFilters = { ...filters, brands: value };
    } else if (filterType === 'priceRanges') {
      newFilters = { ...filters, priceRanges: value };
    } else if (filterType === 'magSafe') {
      newFilters = { ...filters, magSafe: value };
    } else if (filterType === 'isNew') {
      newFilters = { ...filters, isNew: value };
    } else if (filterType === 'isLimitedEdition') {
      newFilters = { ...filters, isLimitedEdition: value };
    } else if (filterType === 'hasDiscount') {
      newFilters = { ...filters, hasDiscount: value };
    }

    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  if (loading) {
    return (
      <Layout
        title="Phone Accessories"
        description="Browse our phone accessories"
      >
        <div className="bg-gray-50 py-16">
          <div className="container">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Phone Accessories"
      description="Browse our phone accessories"
    >

      {/* Hero Section */}
      <div className="bg-gray-100 text-primary-900 py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Premium Phone Accessories
            </h1>
            <p className="text-xl text-primary-700 max-w-2xl mx-auto">
              Discover our complete collection of high-quality phone accessories
              designed to enhance your mobile experience
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Results Section */}
      <div className="bg-gray-50 py-8">
        <div className="container">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-between bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <span className="font-medium text-gray-900">Filters</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop always visible, Mobile toggle */}
            <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block lg:w-64`}>
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Close filters
                </button>
              </div>
              <FilterSidebar onFilterChange={handleFilterChange} filters={filters} />
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-900">
                        {products.length}
                      </span>{" "}
                      phone accessories
                    </p>
                    {/* Active filters summary for mobile */}
                    <div className="lg:hidden mt-2">
                      {(filters.colors.length > 0 || filters.brands.length > 0 || filters.priceRanges.length > 0 || filters.magSafe || filters.isNew || filters.isLimitedEdition || filters.hasDiscount) && (
                        <div className="flex flex-wrap gap-1">
                          {filters.colors.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {filters.colors.length} colors
                            </span>
                          )}
                          {filters.brands.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {filters.brands.length} brands
                            </span>
                          )}
                          {filters.priceRanges.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {filters.priceRanges.length} price ranges
                            </span>
                          )}
                          {filters.magSafe && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              MagSafe
                            </span>
                          )}
                          {filters.isNew && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                          {filters.isLimitedEdition && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Limited Edition
                            </span>
                          )}
                          {filters.hasDiscount && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              On Sale
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium mb-2">
                      No phone accessories found
                    </p>
                    <p className="text-sm">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <CompactProductCard
                      key={product._id}
                      product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        rating: product.rating || 4.5,
                        reviews: product.reviews || Math.floor(Math.random() * 1000) + 100,
                        isBestseller: index === 0, // First product is bestseller
                        discount: index === 1 ? 30 : null, // Second product has 30% off
                        isLimited: index === 2, // Third product is limited edition
                        isNew: product.isNew,
                        slug: product.slug,
                        image: product.images && product.images.length > 0 ? product.images[0].url : null,
                        colorCount: product.colors ? product.colors.length : 8
                      }}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
