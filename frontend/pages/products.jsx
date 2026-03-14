import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import PhoneAccessoriesHeader from "../components/PhoneAccessoriesHeader";
import Link from "next/link";
import { ArrowRight, Filter, Grid, List } from "lucide-react";
import apiClient from "../lib/api";

const ProductsPage = () => {
  const router = useRouter();
  const { subcategory, search, compatibility, brand } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subcategory: subcategory || "",
    search: search || "",
    compatibility: compatibility || "",
    brand: brand || "",
  });
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const phoneAccessoriesSubcategories = [
    "Mobile Cases & Covers",
    "Screen Protectors",
    "Chargers & Cables",
    "Power Banks",
    "Earphones & Headphones",
    "Mobile Stands & Holders",
    "Camera Lenses",
    "Mobile Skins",
    "Wireless Accessories",
  ];

  const compatibilityOptions = ["Android", "iOS", "Universal"];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/products", { params: filters });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Update URL
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) queryParams.append(key, val);
    });

    router.push(`/products?${queryParams.toString()}`, undefined, {
      shallow: true,
    });
  };

  const clearFilters = () => {
    const clearedFilters = {
      subcategory: "",
      search: "",
      compatibility: "",
      brand: "",
    };
    setFilters(clearedFilters);
    router.push("/products", undefined, { shallow: true });
  };

  if (loading) {
    return (
      <Layout
        title="Phone Accessories"
        description="Browse our phone accessories"
      >
        <PhoneAccessoriesHeader />
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
      <PhoneAccessoriesHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Premium Phone Accessories
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
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
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>

                {/* Subcategory Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.subcategory}
                    onChange={(e) =>
                      handleFilterChange("subcategory", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {phoneAccessoriesSubcategories.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Compatibility Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compatibility
                  </label>
                  <select
                    value={filters.compatibility}
                    onChange={(e) =>
                      handleFilterChange("compatibility", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Devices</option>
                    {compatibilityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={filters.brand}
                    onChange={(e) =>
                      handleFilterChange("brand", e.target.value)
                    }
                    placeholder="Search by brand..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="Search accessories..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
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
                    {filters.subcategory && (
                      <p className="text-sm text-primary-600">
                        in {filters.subcategory}
                      </p>
                    )}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${viewMode === "grid" ? "bg-primary-100 text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${viewMode === "list" ? "bg-primary-100 text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
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
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      <Link href={`/product-details/${product.slug}`}>
                        <div className="p-6">
                          {/* Product Image */}
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0].url}
                                alt={product.images[0].altText || product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400 text-lg">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                              {product.name}
                            </h3>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {product.compatibility &&
                                  product.compatibility.map((comp) => (
                                    <span
                                      key={comp}
                                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                    >
                                      {comp}
                                    </span>
                                  ))}
                              </div>

                              {product.isNew && (
                                <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                                  NEW
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-900">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>

                            {product.shortDescription && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {product.shortDescription}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
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
