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
  const [filters, setFilters] = useState({
    colors: [],
    iphoneModel: [],
    typeCase: [],
    magSafe: false,
    partnership: [],
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

      // Add color filters - map colors to API format
      if (currentFilters.colors && currentFilters.colors.length > 0) {
        apiParams.colors = currentFilters.colors.join(",");
      }

      // Add iPhone model filters
      if (currentFilters.iphoneModel && currentFilters.iphoneModel.length > 0) {
        apiParams.iphoneModel = currentFilters.iphoneModel.join(",");
      }

      // Add type case filters
      if (currentFilters.typeCase && currentFilters.typeCase.length > 0) {
        apiParams.typeCase = currentFilters.typeCase.join(",");
      }

      // Add MagSafe filter
      if (currentFilters.magSafe) {
        apiParams.magSafe = true;
      }

      // Add partnership filters
      if (currentFilters.partnership && currentFilters.partnership.length > 0) {
        apiParams.partnership = currentFilters.partnership.join(",");
      }

      console.log("Fetching products with params:", apiParams);

      const response = await apiClient.get("/products", { params: apiParams });
      let products = response.data.products || [];

      // Client-side filtering if API doesn't support all filters
      if (currentFilters.colors && currentFilters.colors.length > 0) {
        products = products.filter((product) => {
          if (product.colors && Array.isArray(product.colors)) {
            return currentFilters.colors.some((color) =>
              product.colors.some((productColor) =>
                productColor.toLowerCase().includes(color.toLowerCase()) ||
                color.toLowerCase().includes(productColor.toLowerCase())
              )
            );
          }
          return false;
        });
      }

      if (currentFilters.magSafe) {
        products = products.filter((product) => product.magSafeCompatible);
      }

      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Set some mock products for demonstration
      setProducts([
        {
          _id: "1",
          name: "iPhone 17 Pro Max - Alcantara Case - Space Grey",
          price: "7,700.00",
          originalPrice: "11,000.00",
          rating: 4.5,
          reviews: 5642,
          slug: "iphone-17-pro-max-alcantara-case-space-grey",
          colors: ["#3D3D3D"],
          magSafeCompatible: true,
          images: [],
        },
        {
          _id: "2",
          name: "iPhone 16 Pro - Alcantara Case - Navy Blue",
          price: "6,500.00",
          originalPrice: "9,000.00",
          rating: 4.3,
          reviews: 3421,
          slug: "iphone-16-pro-alcantara-case-navy-blue",
          colors: ["#1E3A8A"],
          magSafeCompatible: true,
          images: [],
        },
        {
          _id: "3",
          name: "iPhone 15 - Alcantara Case - Rose Gold",
          price: "5,200.00",
          originalPrice: "7,500.00",
          rating: 4.7,
          reviews: 8932,
          slug: "iphone-15-alcantara-case-rose-gold",
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
        iphoneModel: [],
        typeCase: [],
        magSafe: false,
        partnership: [],
        search: "",
      };
    } else if (filterType === 'colors') {
      newFilters = { ...filters, colors: value };
    } else if (filterType === 'magSafe') {
      newFilters = { ...filters, magSafe: value };
    } else if (filterType === 'iphoneModel') {
      const currentModels = [...filters.iphoneModel];
      if (value.checked) {
        currentModels.push(value.model);
      } else {
        const index = currentModels.indexOf(value.model);
        if (index > -1) currentModels.splice(index, 1);
      }
      newFilters = { ...filters, iphoneModel: currentModels };
    } else if (filterType === 'typeCase') {
      const currentTypes = [...filters.typeCase];
      if (value.checked) {
        currentTypes.push(value.type);
      } else {
        const index = currentTypes.indexOf(value.type);
        if (index > -1) currentTypes.splice(index, 1);
      }
      newFilters = { ...filters, typeCase: currentTypes };
    } else if (filterType === 'partnership') {
      const currentPartners = [...filters.partnership];
      if (value.checked) {
        currentPartners.push(value.partner);
      } else {
        const index = currentPartners.indexOf(value.partner);
        if (index > -1) currentPartners.splice(index, 1);
      }
      newFilters = { ...filters, partnership: currentPartners };
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64">
              <FilterSidebar onFilterChange={handleFilterChange} filters={filters} />
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-900">
                        {products.length}
                      </span>{" "}
                      phone accessories
                    </p>
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
