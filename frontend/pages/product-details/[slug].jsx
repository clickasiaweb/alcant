import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { productsAPI } from '../../services/api';
import WishlistButton from '../../components/WishlistButton';
import QuickAddToCart from '../../components/QuickAddToCart';
import { useCart } from '../../contexts/CartContext';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Package,
  Tag,
  Clock,
  Award,
  Zap
} from 'lucide-react';

const ProductDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !slug) return;
    
    const loadProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with slug:', slug);
        
        // Add timeout handling
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 25000)
        );
        
        const response = await Promise.race([
          productsAPI.getBySlug(slug),
          timeoutPromise
        ]);
        
        console.log('Product response:', response);
        
        if (response && response.product) {
          setProduct(response.product);
          console.log('Product set successfully:', response.product.name);
        } else if (response && response.name) {
          // Handle case where API returns product directly
          setProduct(response);
          console.log('Product set successfully:', response.name);
        } else {
          console.log('Product not found, redirecting to 404');
          router.push('/404');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        console.error('Error details:', error.response?.data);
        
        // Handle timeout errors gracefully
        if (error.message === 'Request timeout') {
          console.log('Request timed out, showing error message');
          // You could show a timeout error message to the user here
        } else {
          router.push('/404');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, router, mounted]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      const productToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || product.image,
        category: product.category,
        variant: `${selectedSize || 'Standard'} / ${selectedColor || 'Default'}`,
        slug: product.slug
      };
      
      addToCart(productToAdd, quantity);
      console.log('Added to cart:', product.name, 'Quantity:', quantity);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleImageZoom = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
    setIsZoomed(true);
  };

  const handleImageLeave = () => {
    setIsZoomed(false);
  };

  const handleImageMove = (e) => {
    if (isZoomed) {
      const rect = e.target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
  };

  const getImageUrl = (image) => {
    if (typeof image === 'string') {
      // If it's a blob URL or full URL, return as is
      if (image.startsWith('http') || image.startsWith('blob:')) {
        return image;
      }
      // If it's a placeholder or relative path, use placeholder API
      if (image.includes('test-image') || image.includes('placeholder')) {
        return `https://picsum.photos/seed/${product.name}/600/600.jpg`;
      }
      return image;
    }
    // If it's an object with url property
    if (image?.url) {
      return getImageUrl(image.url);
    }
    // Fallback to placeholder
    return `https://picsum.photos/seed/${product.name}/600/600.jpg`;
  };

  const getImages = () => {
    if (!product.images) return [];
    
    // Handle case where images is stored as JSON string
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error('Error parsing images:', e);
        return [];
      }
    }
    
    // Handle case where images is already an array
    if (Array.isArray(product.images)) {
      return product.images;
    }
    
    return [];
  };

  if (!mounted) {
    return (
      <Layout title="Loading...">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Product Not Found">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/products" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
              Back to Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const images = getImages();
  const mainImage = images[selectedImage] || product.image || '/api/placeholder/600/600';
  const hasMultipleImages = images.length > 1;
  
  // Extract product features from description or use defaults
  const features = [
    { icon: Truck, text: 'Free Shipping' },
    { icon: Shield, text: 'Secure Payment' },
    { icon: RotateCcw, text: '30-Day Returns' },
    { icon: Package, text: 'Premium Quality' },
    { icon: Clock, text: 'Fast Delivery' },
    { icon: Award, text: 'Warranty Included' }
  ];

  // Check for special badges - handle both snake_case and camelCase
  const isNew = product.is_new || product.isNew;
  const isLimitedEdition = product.is_limited_edition || product.isLimitedEdition;
  const isBlueMondaySale = product.is_blue_monday_sale || product.isBlueMondaySale;
  
  // Handle price fields - database uses old_price, final_price
  const currentPrice = product.price || product.final_price || 0;
  const oldPrice = product.old_price || product.oldPrice;
  const discountPercentage = oldPrice && oldPrice > currentPrice ? 
    Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

  return (
    <Layout title={product.name} description={product.description}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li>/</li>
              <li><Link href="/products" className="hover:text-primary-600">Products</Link></li>
              <li>/</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={getImageUrl(mainImage)}
                    alt={product.name}
                    className="w-full h-[600px] object-cover"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/${product.name}/600/600.jpg`;
                    }}
                  />
                  
                  {/* Floating Wishlist Icon */}
                  <div className="absolute top-4 right-4 z-10">
                    {product && (
                      <WishlistButton 
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.images?.[0] || product.image,
                          category: product.category,
                          variant: `${selectedSize || 'Standard'} / ${selectedColor || 'Default'}`,
                          slug: product.slug
                        }}
                        size="lg"
                        className="bg-white shadow-lg hover:shadow-xl"
                      />
                    )}
                  </div>
                  
                  {(product.stock || 0) <= 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none">
                      <span className="text-white text-2xl font-bold">OUT OF STOCK</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <button
                        onClick={() => setSelectedImage(index)}
                        className={`border-2 rounded overflow-hidden transition-all hover:scale-105 w-full ${
                          selectedImage === index ? 'border-gray-800 shadow-lg' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={getImageUrl(img)}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-20 object-cover"
                          onError={(e) => {
                            e.target.src = `https://picsum.photos/seed/${product.name}-${index}/80/80.jpg`;
                          }}
                        />
                      </button>
                      
                      {/* Small wishlist icon on hover */}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {product && (
                          <WishlistButton 
                            product={{
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              originalPrice: product.originalPrice,
                              image: img,
                              category: product.category,
                              variant: `${selectedSize || 'Standard'} / ${selectedColor || 'Default'}`,
                              slug: product.slug
                            }}
                            size="sm"
                            className="bg-white shadow-md"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex gap-2">
                {isNew && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    NEW
                  </span>
                )}
                {isLimitedEdition && (
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    LIMITED EDITION
                  </span>
                )}
                {isBlueMondaySale && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    BLUE MONDAY SALE
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
              
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Rating and Reviews */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating || 0} ({product.reviews || 0} reviews)
                  </span>
                  {product.reviews > 0 && (
                    <Link href="#reviews" className="text-primary-600 hover:text-primary-700">
                      View all reviews
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${typeof currentPrice === 'number' ? currentPrice.toFixed(2) : currentPrice}
                  </span>
                  {oldPrice && oldPrice > currentPrice && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        ${typeof oldPrice === 'number' ? oldPrice.toFixed(2) : oldPrice}
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        Save ${typeof oldPrice === 'number' ? (oldPrice - currentPrice).toFixed(2) : '0'}
                      </span>
                    </>
                  )}
                </div>
                
                {isBlueMondaySale && (
                  <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center text-blue-800">
                      <Zap className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Blue Monday Sale - Limited Time Offer!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || product.short_description || 'No description available.'}
                </p>
              </div>
              
              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="space-y-3">
                  {product.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                  )}
                  {product.subcategory && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subcategory:</span>
                      <span className="font-medium">{product.subcategory}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium">
                      {(product.stock || 0) > 0 ? (
                        <span className="text-green-600">In Stock ({product.stock || 0} available)</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product ID:</span>
                    <span className="font-medium">{product.id || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Color: <span className="font-normal text-gray-600">{selectedColor || 'Select Color'}</span></h3>
                <div className="flex space-x-2">
                  {['Black', 'Brown', 'Red', 'Blue', 'Green'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-gray-800 ring-2 ring-gray-300' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase() === 'black' ? '#000' :
                                       color.toLowerCase() === 'brown' ? '#8B4513' :
                                       color.toLowerCase() === 'red' ? '#EF4444' :
                                       color.toLowerCase() === 'blue' ? '#3B82F6' :
                                       color.toLowerCase() === 'green' ? '#10B981' : '#6B7280'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Size: <span className="font-normal text-gray-600">{selectedSize || 'Select Size'}</span></h3>
                <div className="grid grid-cols-4 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border rounded-md transition-all ${
                        selectedSize === size
                          ? 'border-gray-800 bg-gray-800 text-white'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 border-x border-gray-300 font-semibold min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      disabled={(product.stock || 0) <= quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-900 text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={(product.stock || 0) <= 0}
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    {(product.stock || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-4">
                  {product && (
                    <WishlistButton 
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.images?.[0] || product.image,
                        category: product.category,
                        variant: `${selectedSize || 'Standard'} / ${selectedColor || 'Default'}`,
                        slug: product.slug
                      }}
                      className="flex-1"
                      size="md"
                    />
                  )}
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 font-medium transition-colors flex-1"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </button>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-4">
                  <button className="w-full text-left py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50">
                    <span className="flex items-center">
                      <Truck className="w-5 h-5 mr-3 text-gray-600" />
                      Delivery & Returns
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button className="w-full text-left py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50">
                    <span className="flex items-center">
                      <Shield className="w-5 h-5 mr-3 text-gray-600" />
                      Warranty & Support
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button className="w-full text-left py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50">
                    <span className="flex items-center">
                      <Package className="w-5 h-5 mr-3 text-gray-600" />
                      Product Care
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Social Sharing */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Share this product</h3>
                <div className="flex space-x-3">
                  <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                    <span className="text-sm font-bold">f</span>
                  </button>
                  <button className="w-10 h-10 bg-sky-400 text-white rounded-full flex items-center justify-center hover:bg-sky-500">
                    <span className="text-sm font-bold">t</span>
                  </button>
                  <button className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700">
                    <span className="text-sm font-bold">i</span>
                  </button>
                  <button className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900">
                    <span className="text-sm font-bold">@</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recommended Product 1 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/recommended1/300/300.jpg" 
                  alt="Recommended Product 1"
                  className="w-full h-48 object-cover"
                />
                <WishlistButton 
                  product={{
                    id: 'rec1',
                    name: 'Premium Leather Wallet',
                    price: 89.99,
                    image: 'https://picsum.photos/seed/recommended1/300/300.jpg',
                    category: 'Wallets',
                    variant: 'Standard',
                    slug: 'premium-leather-wallet'
                  }}
                  size="sm"
                  className="absolute top-2 right-2 bg-white shadow-md hover:shadow-lg"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Premium Leather Wallet</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">(24)</span>
                </div>
                <p className="text-lg font-bold text-gray-900">$89.99</p>
                <button className="w-full mt-3 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Recommended Product 2 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/recommended2/300/300.jpg" 
                  alt="Recommended Product 2"
                  className="w-full h-48 object-cover"
                />
                <WishlistButton 
                  product={{
                    id: 'rec2',
                    name: 'Designer Phone Case',
                    price: 45.99,
                    originalPrice: 57.99,
                    image: 'https://picsum.photos/seed/recommended2/300/300.jpg',
                    category: 'Phone Cases',
                    variant: 'iPhone 15 Pro',
                    slug: 'designer-phone-case'
                  }}
                  size="sm"
                  className="absolute top-2 right-2 bg-white shadow-md hover:shadow-lg"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  -20%
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Designer Phone Case</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <Star key={5} className="w-3 h-3 text-gray-300" />
                  </div>
                  <span className="ml-1 text-xs text-gray-500">(18)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900">$45.99</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">$57.99</span>
                </div>
                <button className="w-full mt-3 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Recommended Product 3 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/recommended3/300/300.jpg" 
                  alt="Recommended Product 3"
                  className="w-full h-48 object-cover"
                />
                <WishlistButton 
                  product={{
                    id: 'rec3',
                    name: 'Wireless Headphones',
                    price: 129.99,
                    image: 'https://picsum.photos/seed/recommended3/300/300.jpg',
                    category: 'Accessories',
                    variant: 'Bluetooth',
                    slug: 'wireless-headphones'
                  }}
                  size="sm"
                  className="absolute top-2 right-2 bg-white shadow-md hover:shadow-lg"
                />
                <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  NEW
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Luxury Car Mat Set</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">(32)</span>
                </div>
                <p className="text-lg font-bold text-gray-900">$129.99</p>
                <button className="w-full mt-3 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Recommended Product 4 */}
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/recommended4/300/300.jpg" 
                  alt="Recommended Product 4"
                  className="w-full h-48 object-cover"
                />
                <WishlistButton 
                  product={{
                    id: 'rec4',
                    name: 'Executive Bag',
                    price: 199.99,
                    image: 'https://picsum.photos/seed/recommended4/300/300.jpg',
                    category: 'Bags',
                    variant: 'Standard',
                    slug: 'executive-bag'
                  }}
                  size="sm"
                  className="absolute top-2 right-2 bg-white shadow-md hover:shadow-lg"
                />
                <span className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  LIMITED
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Executive Bag</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">(45)</span>
                </div>
                <p className="text-lg font-bold text-gray-900">$199.99</p>
                <button className="w-full mt-3 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-white py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Follow Us on Instagram</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Social Post 1 */}
            <div className="relative group cursor-pointer">
              <img 
                src="https://picsum.photos/seed/social1/400/400.jpg" 
                alt="Instagram Post 1"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-white mr-2" />
                    <span className="text-white font-semibold">234</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-white text-sm">@alcanside</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Post 2 */}
            <div className="relative group cursor-pointer">
              <img 
                src="https://picsum.photos/seed/social2/400/400.jpg" 
                alt="Instagram Post 2"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-white mr-2" />
                    <span className="text-white font-semibold">189</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-white text-sm">@alcanside</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Post 3 */}
            <div className="relative group cursor-pointer">
              <img 
                src="https://picsum.photos/seed/social3/400/400.jpg" 
                alt="Instagram Post 3"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-white mr-2" />
                    <span className="text-white font-semibold">342</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-white text-sm">@alcanside</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Post 4 */}
            <div className="relative group cursor-pointer">
              <img 
                src="https://picsum.photos/seed/social4/400/400.jpg" 
                alt="Instagram Post 4"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-white mr-2" />
                    <span className="text-white font-semibold">456</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-white text-sm">@alcanside</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
              Follow @alcanside
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
