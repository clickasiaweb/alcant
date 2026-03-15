import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { productsAPI } from "../../services/api";
import ProductImage from "../../components/product-details/ProductImage";
import ProductInfo from "../../components/product-details/ProductInfo";
import ProductBreadcrumb from "../../components/product-details/ProductBreadcrumb";
import ProductLoader from "../../components/product-details/ProductLoader";
import ProductNotFound from "../../components/product-details/ProductNotFound";

// For static export, we need to generate static params
export async function getStaticPaths() {
  // Return empty paths for now, let Next.js handle dynamic routing
  return {
    paths: [],
    fallback: 'blocking' // This will generate pages on-demand
  };
}

export async function getStaticProps({ params }) {
  try {
    const response = await productsAPI.getBySlug(params.slug);
    
    if (!response) {
      return { notFound: true };
    }
    
    return {
      props: {
        product: response,
        slug: params.slug
      }
    };
  } catch (error) {
    return { notFound: true };
  }
}

const ProductDetailPage = ({ product: initialProduct, slug: initialSlug }) => {
  const router = useRouter();
  const { slug } = router.query;
  const finalSlug = slug || initialSlug;
  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!finalSlug) return;
    
    const loadProduct = async () => {
      try {
        setLoading(true);
        console.log('🔍 Loading product with slug:', finalSlug);
        console.log('🔍 Browser:', navigator.userAgent);
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api');
        
        const response = await productsAPI.getBySlug(finalSlug);
        console.log('📦 API Response:', response);
        
        // The API already returns response.data, so response is the product data
        let productData = response;
        
        if (productData && typeof productData === "object") {
          console.log('✅ Using direct response (API already unwrapped)');
          if (Object.keys(productData).length > 0) {
            console.log('🎉 Product data set:', productData.name || productData.title);
            setProduct(productData);
          } else {
            console.log('❌ Empty product data object');
            // Set a fallback product to prevent infinite loading
            setProduct({
              name: 'Product Loading...',
              description: `Please wait while we load the product details for "${finalSlug}".`,
              price: 0,
              image: null
            });
          }
        } else {
          console.log('❌ Invalid response format:', typeof response);
          // Set a fallback product to prevent infinite loading
          setProduct({
            name: 'Product Not Available',
            description: `The product with slug "${finalSlug}" is currently unavailable or does not exist.`,
            price: 0,
            image: null
          });
        }
      } catch (error) {
        console.error("❌ Error loading product:", error);
        console.error("❌ Error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          requestedSlug: finalSlug
        });
        if (error.response?.status === 404) {
          console.log('❌ Product not found (404) for slug:', finalSlug);
          // Set a fallback product instead of redirecting
          setProduct({
            name: 'Product Not Found',
            description: `The product with slug "${finalSlug}" was not found in our database.`,
            price: 0,
            image: null
          });
        } else {
          // Set a fallback product for other errors
          setProduct({
            name: 'Product Error',
            description: `There was an error loading the product "${finalSlug}". Please try again later.`,
            price: 0,
            image: null
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [finalSlug, router]);

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