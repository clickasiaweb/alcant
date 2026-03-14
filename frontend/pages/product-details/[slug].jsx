import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import { productsAPI } from "../../services/api";

const ProductDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getBySlug(slug);
        
        let productData = null;
        if (response && typeof response === "object") {
          if (response.data && typeof response.data === "object") {
            productData = response.data;
          } else if (response.name || response.title || response.price !== undefined) {
            productData = response;
          } else if (response.product && typeof response.product === "object") {
            productData = response.product;
          }
        }
        
        if (productData && Object.keys(productData).length > 0) {
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error loading product:", error);
        if (error.response?.status === 404) {
          router.push("/404");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, router]);

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
            <p className="text-gray-600 mb-8">The product you are looking for does not exist.</p>
            <Link href="/products" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
              Back to Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const displayName = product.name || product.title || "Product";
  const displayDescription = product.description || product.short_description || "No description available.";
  const currentPrice = product.price || product.final_price || 0;

  return (
    <Layout title={displayName} description={displayDescription}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li>/</li>
              <li><Link href="/products" className="hover:text-primary-600">Products</Link></li>
              <li>/</li>
              <li className="text-gray-900">{displayName}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-square">
                  <img
                    src={product.image || `https://picsum.photos/seed/${displayName}/600/600.jpg`}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{displayName}</h1>
                <div className="flex items-baseline space-x-3 mb-4">
                  <span className="text-3xl font-bold text-primary-600">
                    ${typeof currentPrice === "number" ? currentPrice.toFixed(2) : currentPrice}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {displayDescription}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Availability:</span>
                  <span className="text-sm font-medium text-green-600">
                    In Stock
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