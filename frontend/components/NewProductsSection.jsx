import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Eye from "lucide-react/dist/esm/icons/eye";
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart";
import Heart from "lucide-react/dist/esm/icons/heart";
import Star from "lucide-react/dist/esm/icons/star";
import Link from "next/link";
import { productsAPI } from "../services/api";

// Force client-side only rendering
const NewProductsSection = () => {
  const [mounted, setMounted] = useState(false);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchNewProducts();
    }
  }, [mounted]);

  const fetchNewProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching new products...');
      
      const data = await productsAPI.getNew();
      console.log('New products received:', data);
      console.log('Products array:', data.products);
      console.log('Products length:', data.products?.length);
      
      setNewProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching new products:", error);
      console.error("Error details:", error.response?.data);
      setError(error.message);
      // Fallback to hardcoded products if API fails
      setNewProducts([
        {
          id: 1,
          name: "iPhone 15 Pro Case - Black",
          price: 89.99,
          image: "/api/placeholder/300/400",
          color: "Black",
        },
        {
          id: 2,
          name: "iPhone 15 Pro Case - Brown",
          price: 89.99,
          image: "/api/placeholder/300/400",
          color: "Brown",
        },
        {
          id: 3,
          name: "iPhone 15 Pro Case - Red",
          price: 89.99,
          image: "/api/placeholder/300/400",
          color: "Red",
        },
        {
          id: 4,
          name: "iPhone 15 Pro Case - Blue",
          price: 89.99,
          image: "/api/placeholder/300/400",
          color: "Blue",
        },
        {
          id: 5,
          name: "iPhone 15 Pro Case - Green",
          price: 89.99,
          image: "/api/placeholder/300/400",
          color: "Green",
        },
        {
          id: 6,
          name: "iPhone 15 Pro Case - Gray",
          price: 89.99,
          image: "/api/placeholder/300/400",
          color: "Gray",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (product) => {
    // Use the actual slug from the database, not generate one from name
    const slug = product.slug || (
      product.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
    window.location.href = `/product-details/${slug}`;
  };

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product.name);
    // Add cart functionality here
  };

  const handleWishlist = (productId) => {
    const newWishlisted = new Set(wishlisted);
    if (newWishlisted.has(productId)) {
      newWishlisted.delete(productId);
    } else {
      newWishlisted.add(productId);
    }
    setWishlisted(newWishlisted);
  };

  const getProductImageUrl = (product) => {
    // Handle different image formats
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') {
        if (firstImage.startsWith('http') || firstImage.startsWith('blob:')) {
          return firstImage;
        }
        if (firstImage.includes('test-image') || firstImage.includes('placeholder')) {
          return `https://picsum.photos/seed/${product.name}/300/400.jpg`;
        }
        return firstImage;
      }
      if (firstImage?.url) {
        return getProductImageUrl({ ...product, images: [firstImage.url] });
      }
    }
    
    // Handle case where images is stored as JSON string
    if (product.images && typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        const imageArray = Array.isArray(parsed) ? parsed : [parsed];
        if (imageArray.length > 0 && imageArray[0].url) {
          return imageArray[0].url;
        }
      } catch (e) {
        console.error('Error parsing product images:', e);
      }
    }
    
    // Fallback to main image field
    if (product.image) {
      if (product.image.startsWith('http') || product.image.startsWith('blob:')) {
        return product.image;
      }
      if (product.image.includes('test-image') || product.image.includes('placeholder')) {
        return `https://picsum.photos/seed/${product.name}/300/400.jpg`;
      }
      return product.image;
    }
    
    // Final fallback
    return `https://picsum.photos/seed/${product.name}/300/400.jpg`;
  };

  const getProductSlug = (product) => {
    return product.slug || (
      product.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
  };

  const getProductPrice = (product) => {
    const price = product.price || product.final_price || 0;
    return typeof price === 'number' ? price.toFixed(2) : price;
  };

  const getOldPrice = (product) => {
    const oldPrice = product.old_price || product.oldPrice;
    const currentPrice = product.price || product.final_price || 0;
    if (!oldPrice || oldPrice <= currentPrice) return null;
    return typeof oldPrice === 'number' ? oldPrice.toFixed(2) : oldPrice;
  };

  const isProductNew = (product) => {
    return product.is_new || product.isNew;
  };

  const isProductLimited = (product) => {
    return product.is_limited_edition || product.isLimitedEdition;
  };

  const isProductOnSale = (product) => {
    return product.is_blue_monday_sale || product.isBlueMondaySale || 
           (product.old_price && product.old_price > (product.price || product.final_price));
  };

  if (!mounted) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
            New Arrivals
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
            New Arrivals
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          {error && (
            <div className="text-center text-red-500 mt-4">
              <p>Error loading products: {error}</p>
              <p className="text-sm">Showing fallback products...</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (error && !loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
            New Arrivals
          </h2>
          <div className="text-center text-red-500 mb-8">
            <p>Error loading products: {error}</p>
            <p className="text-sm">Showing fallback products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
          New Arrivals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newProducts.length > 0 ? (
            newProducts.map((product) => {
              const slug = getProductSlug(product);
              const price = getProductPrice(product);
              const oldPrice = getOldPrice(product);
              const isNew = isProductNew(product);
              const isLimited = isProductLimited(product);
              const isOnSale = isProductOnSale(product);
              const inWishlist = wishlisted.has(product._id || product.id);
              
              return (
                <div key={product._id || product.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Product Image */}
                  <div className="relative">
                    <Link href={`/product-details/${slug}`}>
                      <div className="bg-gray-100 rounded-t-lg h-64 flex items-center justify-center group-hover:bg-gray-200 transition overflow-hidden cursor-pointer">
                        <img
                          src={getProductImageUrl(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = `https://picsum.photos/seed/${product.name}/300/400.jpg`;
                          }}
                        />
                      </div>
                    </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isNew && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          NEW
                        </span>
                      )}
                      {isLimited && (
                        <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          LIMITED
                        </span>
                      )}
                      {isOnSale && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          SALE
                        </span>
                      )}
                    </div>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleWishlist(product._id || product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                    
                    {/* Quick Actions */}
                    <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleQuickView(product)}
                        className="flex-1 bg-black bg-opacity-80 text-white py-2 px-3 rounded text-xs font-medium hover:bg-opacity-90 transition flex items-center justify-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Quick View
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-primary-600 text-white py-2 px-3 rounded text-xs font-medium hover:bg-primary-700 transition flex items-center justify-center"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating || 0) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">
                        ({product.reviews || 0})
                      </span>
                    </div>
                    
                    {/* Product Name */}
                    <Link href={`/product-details/${slug}`}>
                      <h3 className="text-sm font-medium text-primary-900 mb-2 line-clamp-2 hover:text-primary-600 transition cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-lg font-bold text-primary-800">
                          ${price}
                          {oldPrice && (
                            <span className="text-gray-500 line-through ml-2 text-sm">
                              ${oldPrice}
                            </span>
                          )}
                        </p>
                        {product.category && (
                          <p className="text-xs text-gray-500">{product.category}</p>
                        )}
                      </div>
                      
                      {/* Stock Status */}
                      <div className="text-right">
                        {(product.stock || 0) > 0 ? (
                          <span className="text-xs text-green-600 font-medium">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Main Action Button */}
                    <button
                      onClick={() => handleQuickView(product)}
                      className="w-full bg-primary-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No new products available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewProductsSection;
