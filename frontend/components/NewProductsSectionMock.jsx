import React, { useState, useEffect } from "react";
import CompactProductCard from "./CompactProductCard";
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
    // Use mock data that matches CompactProductCard format
    setNewProducts([
      {
        id: 1,
        name: "iPhone 17 Pro Max - ΛʟcΛɴᴛ Case - Space Grey",
        price: "7,700.00",
        originalPrice: "11,000.00",
        image: "https://picsum.photos/seed/iphone-space-grey/300/400.jpg",
        rating: 4.5,
        reviews: 5642,
        isBestseller: true,
        slug: "iphone-17-pro-max-ΛʟcΛɴᴛ-case-space-grey",
        colorCount: 8
      },
      {
        id: 2,
        name: "iPhone 16 Pro - ΛʟcΛɴᴛ Case - Navy Blue",
        price: "6,500.00",
        originalPrice: "9,000.00",
        image: "https://picsum.photos/seed/iphone-navy-blue/300/400.jpg",
        rating: 4.3,
        reviews: 3421,
        discount: 30,
        slug: "iphone-16-pro-ΛʟcΛɴᴛ-case-navy-blue",
        colorCount: 6
      },
      {
        id: 3,
        name: "iPhone 15 - ΛʟcΛɴᴛ Case - Rose Gold",
        price: "5,200.00",
        originalPrice: "7,500.00",
        image: "https://picsum.photos/seed/iphone-rose-gold/300/400.jpg",
        rating: 4.7,
        reviews: 8932,
        isLimited: true,
        slug: "iphone-15-ΛʟcΛɴᴛ-case-rose-gold",
        colorCount: 5
      },
      {
        id: 4,
        name: "iPhone 14 Pro - ΛʟcΛɴᴛ Case - Forest Green",
        price: "4,800.00",
        originalPrice: "6,900.00",
        image: "https://picsum.photos/seed/iphone-forest-green/300/400.jpg",
        rating: 4.6,
        reviews: 2156,
        slug: "iphone-14-pro-ΛʟcΛɴᴛ-case-forest-green",
        colorCount: 7
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {newProducts.map((product, index) => (
            <CompactProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                rating: product.rating,
                reviews: product.reviews,
                isBestseller: product.isBestseller,
                discount: product.discount,
                isLimited: product.isLimited,
                slug: product.slug,
                image: product.image,
                colorCount: product.colorCount
              }}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewProductsSectionMock;
