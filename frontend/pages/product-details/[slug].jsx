import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { productsAPI } from "../../services/api";
import ProductImage from "../../components/product-details/ProductImage";
import ProductInfo from "../../components/product-details/ProductInfo";
import ProductBreadcrumb from "../../components/product-details/ProductBreadcrumb";
import ProductLoader from "../../components/product-details/ProductLoader";
import ProductNotFound from "../../components/product-details/ProductNotFound";
import ProductFeaturesSection from "../../components/product-details/ProductFeaturesSection";
import ProductVideoSection from "../../components/product-details/ProductVideoSection";
import RelatedProducts from "../../components/product-details/RelatedProducts";
import CustomerTrustSection from "../../components/product-details/CustomerTrustSection";
import ProductFAQ from "../../components/product-details/ProductFAQ";
import CustomerReviews from "../../components/product-details/CustomerReviews";
import ProductAccordionSections from "../../components/product-details/ProductAccordionSections";

// ✅ This forces dynamic rendering in Pages Router (replaces force-dynamic)
export async function getServerSideProps(context) {
  const { slug } = context.params;
  return {
    props: { slugFromServer: slug },
  };
}

const ProductDetailPage = ({ slugFromServer }) => {
  const router = useRouter();
  
  // ✅ Use slugFromServer first, fall back to router.query
  // This prevents the "slug is undefined on first render" bug
  const slug = slugFromServer || router.query.slug;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        console.log('🔍 Loading product with slug:', slug);

        const response = await productsAPI.getBySlug(slug);
        console.log('📦 API Response:', response);

        if (response && typeof response === "object" && Object.keys(response).length > 0) {
          setProduct(response);
        } else {
          // ✅ Don't set fake fallback products - let ProductNotFound handle it
          setProduct(null);
        }
      } catch (error) {
        console.error("❌ Error loading product:", error.message);
        setProduct(null); // ✅ Let ProductNotFound render cleanly
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', product?.name, 'Quantity:', quantity);
  };

  const handleColorChange = (newImages) => {
    setCurrentImages(newImages);
    setSelectedImage(0); // Reset to first image when color changes
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getImages = () => {
    // Use color-specific images if available, otherwise use default product images
    const imagesToUse = currentImages.length > 0 ? currentImages : [];
    
    if (imagesToUse.length > 0) return imagesToUse;
    
    if (!product?.images) return [];
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    }
    if (Array.isArray(product.images)) return product.images;
    if (typeof product.images === 'object') return [product.images];
    return [];
  };

  if (loading) return <ProductLoader />;
  if (!product) return <ProductNotFound />;

  const displayName = product.name || product.title || "Product";
  const displayDescription = product.description || product.short_description || "No description available.";
  const currentPrice = product.price || product.final_price || 0;
  const oldPrice = product.old_price || product.oldPrice;

  const images = getImages();
  
  // ✅ Fixed: use placehold.co instead of /api/placeholder which doesn't exist
  const mainImage = images[selectedImage] 
    || product.image 
    || `https://placehold.co/600x600?text=${encodeURIComponent(displayName)}`;
  
  const hasMultipleImages = images.length > 1;

  return (
    <Layout title={displayName} description={displayDescription}>
      <div className="min-h-screen bg-gray-50">
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
              handleImageChange={setSelectedImage}
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
              onColorChange={handleColorChange}
              images={images}
            />
          </div>
        </div>
        
        {/* Additional Sections */}
        <CustomerReviews product={product} />
        <ProductAccordionSections product={product} />
        <ProductFeaturesSection product={product} />
        <ProductVideoSection product={product} />
        <RelatedProducts currentProduct={product} />
        <CustomerTrustSection />
        <ProductFAQ product={product} />
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
