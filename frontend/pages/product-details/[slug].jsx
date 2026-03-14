import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { productsAPI } from '../../services/api';
import WishlistButton from '../../components/WishlistButton';
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

const ProductDetailPage = ({ slug: initialSlug }) => {
  const router = useRouter();
  const { slug } = router.query;
  const finalSlug = slug || initialSlug;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !finalSlug) return;
    
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        const response = await productsAPI.getBySlug(slug);
        
        if (response && Object.keys(response).length > 0) {
          setProduct(response);
          return;
        }
        
      } catch (error) {
        console.error('Error loading product:', error);
        
        if (error.response?.status === 404) {
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
    // Add to cart functionality here
    console.log('Added to cart:', product.name, 'Quantity:', quantity);
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

  const handleImageChange = (index) => {
    setSelectedImage(index);
  };

  const handleZoom = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
    setIsZoomed(true);
  };

  const getImageUrl = (image) => {
    // If it's already a full URL, return as is
    if (image?.startsWith('http')) {
      return image;
    }
    
    // If it's a blob URL, return as is
    if (image?.startsWith('blob:')) {
      return image;
    }
    
    // If it's a relative path, make it absolute
    if (image?.startsWith('/')) {
      return image;
    }
    
    // If it's a placeholder or test image, use picsum
    if (image?.includes('test-image') || image?.includes('placeholder')) {
      return `https://picsum.photos/seed/${product.name}/600/600.jpg`;
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
    
    // Handle case where images is an object
    if (typeof product.images === 'object' && product.images !== null) {
      return [product.images];
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
  const mainImage = images[selectedImage] || product.image || `https://picsum.photos/seed/${product?.name || 'product'}/600/600.jpg`;
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
                <div 
                  className="aspect-square cursor-zoom-in"
                  onMouseMove={handleZoom}
                  onMouseLeave={() => setIsZoomed(false)}
                >
                  <img
                    src={getImageUrl(mainImage)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {isNew && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      NEW
                    </span>
                  )}
                  {isLimitedEdition && (
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      LIMITED
                    </span>
                  )}
                  {isBlueMondaySale && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      SALE {discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <div className="absolute top-4 right-4">
                  <WishlistButton 
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: currentPrice,
                      image: mainImage
                    }}
                    size="lg"
                  />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-primary-600 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                <div className="flex items-baseline space-x-3 mb-4">
                  <span className="text-3xl font-bold text-primary-600">
                    ${currentPrice}
                  </span>
                  {oldPrice && oldPrice > currentPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ${oldPrice}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-6">
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
                  <span className="text-sm text-gray-600">
                    {product.rating || 0}.0 ({product.reviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Why Choose Us?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <feature.icon className="w-5 h-5 text-primary-600" />
                      <span className="text-sm text-gray-600">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Availability:</span>
                  <span className={`text-sm font-medium ${
                    (product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(product.stock || 0) > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;