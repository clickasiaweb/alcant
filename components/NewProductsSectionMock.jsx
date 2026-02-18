import React, { useState, useEffect } from "react";
import Eye from "lucide-react/dist/esm/icons/eye";
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart";
import Heart from "lucide-react/dist/esm/icons/heart";
import Star from "lucide-react/dist/esm/icons/star";
import Link from "next/link";
import { useCart } from '../contexts/CartContext';

// Mock version that doesn't make API calls
const NewProductsSectionMock = () => {
  const [mounted, setMounted] = useState(false);
  const [newProducts, setNewProducts] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
    setIsClient(true);
    // Use mock data instead of API call
    setNewProducts([
      {
        id: 1,
        name: "iPhone 15 Pro Case - Black",
        price: 89.99,
        image: "https://picsum.photos/seed/iphone-black/300/400.jpg",
        color: "Black",
        rating: 4.5,
        reviews: 128,
        stock: 10,
        is_new: true,
        slug: "iphone-15-pro-case-black"
      },
      {
        id: 2,
        name: "iPhone 15 Pro Case - Brown",
        price: 89.99,
        image: "https://picsum.photos/seed/iphone-brown/300/400.jpg",
        color: "Brown",
        rating: 4.7,
        reviews: 95,
        stock: 8,
        is_new: true,
        slug: "iphone-15-pro-case-brown"
      },
      {
        id: 3,
        name: "iPhone 15 Pro Case - Red",
        price: 89.99,
        image: "https://picsum.photos/seed/iphone-red/300/400.jpg",
        color: "Red",
        rating: 4.3,
        reviews: 67,
        stock: 15,
        is_new: true,
        slug: "iphone-15-pro-case-red"
      },
      {
        id: 4,
        name: "iPhone 15 Pro Case - Blue",
        price: 89.99,
        image: "https://picsum.photos/seed/iphone-blue/300/400.jpg",
        color: "Blue",
        rating: 4.6,
        reviews: 112,
        stock: 12,
        is_new: true,
        slug: "iphone-15-pro-case-blue"
      }
    ]);
  }, []);

  const handleQuickView = (product) => {
    window.location.href = `/product-details/${product.slug}`;
  };

  const handleAddToCart = (product) => {
    if (!isClient) return;
    
    console.log('Adding to cart from NewProductsSection:', product.name);
    try {
      addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleWishlist = (productId) => {
    console.log('Wishlist toggled for product:', productId);
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

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
          New Arrivals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Product Image */}
              <div className="relative">
                <Link href={`/product-details/${product.slug}`}>
                  <div className="bg-gray-100 rounded-t-lg h-64 flex items-center justify-center group-hover:bg-gray-200 transition overflow-hidden cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                
                {/* Badges */}
                <div className="absolute top-2 left-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    NEW
                  </span>
                </div>
                
                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <Heart className="w-4 h-4 text-gray-600" />
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
                <Link href={`/product-details/${product.slug}`}>
                  <h3 className="text-sm font-medium text-primary-900 mb-2 line-clamp-2 hover:text-primary-600 transition cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-primary-800">
                      ${product.price}
                    </p>
                    <p className="text-xs text-gray-500">{product.color}</p>
                  </div>
                  
                  {/* Stock Status */}
                  <div className="text-right">
                    <span className="text-xs text-green-600 font-medium">In Stock</span>
                  </div>
                </div>
                
                {/* Main Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleQuickView(product)}
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewProductsSectionMock;
