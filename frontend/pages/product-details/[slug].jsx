import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { productsAPI } from "../../services/api";
import ProductImage from "../../components/product-details/ProductImage";
import ProductInfo from "../../components/product-details/ProductInfo";
import ProductBreadcrumb from "../../components/product-details/ProductBreadcrumb";
import ProductLoader from "../../components/product-details/ProductLoader";
import ProductNotFound from "../../components/product-details/ProductNotFound";

const ProductDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!slug) return;
    
    const loadProduct = async () => {
      try {
        setLoading(true);
        console.log('🔍 Loading product with slug:', slug);
        console.log('🔍 Browser:', navigator.userAgent);
        console.log('🔍 Current URL:', window.location.href);
        
        const response = await productsAPI.getBySlug(slug);
        console.log('📦 API Response:', response);
        
        let productData = null;
        if (response && typeof response === "object") {
          if (response.data && typeof response.data === "object") {
            productData = response.data;
            console.log('✅ Using response.data');
          } else if (response.name || response.title || response.price !== undefined) {
            productData = response;
            console.log('✅ Using direct response');
          } else if (response.product && typeof response.product === "object") {
            productData = response.product;
            console.log('✅ Using response.product');
          } else {
            console.log('❌ Unknown response structure:', Object.keys(response));
          }
        } else {
          console.log('❌ No response or invalid response');
        }
        
        if (productData && Object.keys(productData).length > 0) {
          console.log('🎉 Product data set:', productData.name || productData.title);
          setProduct(productData);
        } else {
          console.log('❌ No valid product data found');
        }
      } catch (error) {
        console.error("❌ Error loading product:", error);
        console.error("❌ Error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        if (error.response?.status === 404) {
          router.push("/404");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, router]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', product?.name, 'Quantity:', quantity);
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

  const getImages = () => {
    if (!product?.images) return [];
    
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error('Error parsing images:', e);
        return [];
      }
    }
    
    if (Array.isArray(product.images)) {
      return product.images;
    }
    
    if (typeof product.images === 'object' && product.images !== null) {
      return [product.images];
    }
    
    return [];
  };

  if (loading) {
    return <ProductLoader />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const displayName = product.name || product.title || "Product";
  const displayDescription = product.description || product.short_description || "No description available.";
  const currentPrice = product.price || product.final_price || 0;
  const oldPrice = product.old_price || product.oldPrice;
  
  const images = getImages();
  const mainImage = images[selectedImage] || product.image || `https://picsum.photos/seed/${displayName}/600/600.jpg`;
  const hasMultipleImages = images.length > 1;

  return (
    <Layout title={displayName} description={displayDescription}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <ProductBreadcrumb displayName={displayName} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductImage 
              product={product}
              displayName={displayName}
              mainImage={mainImage}
              selectedImage={selectedImage}
              images={images}
              hasMultipleImages={hasMultipleImages}
              handleImageChange={handleImageChange}
            />
            
            <ProductInfo 
              product={product}
              displayName={displayName}
              displayDescription={displayDescription}
              currentPrice={currentPrice}
              oldPrice={oldPrice}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
              handleAddToCart={handleAddToCart}
              handleShare={handleShare}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;