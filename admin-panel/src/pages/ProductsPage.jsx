import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiFilter,
  FiImage,
  FiDollarSign,
  FiPackage,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import SidebarNoAuth from "../components/SidebarNoAuth";
import ProductFormModal from "../components/ProductFormModal";
import {
  getAdminProducts,
  getAdminCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  bulkDeleteProducts,
  uploadImages,
} from "../services/api-services";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSubcategory, setFilterSubcategory] = useState("all");
  const [filterSubSubcategory, setFilterSubSubcategory] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    brand: "", // ✅ Add missing brand field
    category: "",
    subcategory: "",
    subSubcategory: "",
    subSubcategoryId: "",
    price: "",
    oldPrice: "",
    images: [],
    stock: "",
    isActive: true,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    rating: 0,
    reviews: 0,
    seoMetaTitle: "",
    seoMetaDescription: "",
    keywords: "",
    taxPercentage: "",
    stockStatus: "in_stock",
    featured: false,
    status: "active",
  });

  useEffect(() => {
    const action = searchParams.get("action");
    const id = searchParams.get("id");
    if (action === "add") {
      setShowForm(true);
    } else if (action === "edit" && id) {
      // Load product for editing
      loadProductForEdit(id);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, []);

  // Reload data when filters or search changes
  useEffect(() => {
    loadData(1); // Reset to first page when filters change
  }, [
    searchTerm,
    filterStatus,
    filterCategory,
    filterSubcategory,
    filterSubSubcategory,
    pagination.limit,
  ]);

  const loadData = async (page = 1) => {
    try {
      console.log("Loading data...");
      setLoading(true);

      // Prepare query parameters for pagination and filtering
      const params = {
        page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterCategory !== "all" && { categoryId: filterCategory }),
        ...(filterSubcategory !== "all" && {
          subCategoryId: filterSubcategory,
        }),
        ...(filterSubSubcategory !== "all" && {
          subSubCategoryId: filterSubSubcategory,
        }),
      };

      const [productsData, categoriesData] = await Promise.all([
        getAdminProducts(params),
        fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:5001/api"}/categories/hierarchy`,
        ).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch categories");
          return res.json();
        }),
      ]);

      const productsList = productsData.products || productsData.data || [];
      const categoriesList = categoriesData.data || [];
      const paginationData = productsData.pagination || {};

      // Extract subcategories and sub-subcategories from hierarchy data
      const subcategoriesList = [];
      const subSubcategoriesList = [];

      categoriesList.forEach((category) => {
        if (category.subcategories) {
          category.subcategories.forEach((subcategory) => {
            subcategoriesList.push({
              ...subcategory,
              category_id: category.id,
            });

            if (subcategory.sub_subcategories) {
              subcategory.sub_subcategories.forEach((subSub) => {
                subSubcategoriesList.push({
                  ...subSub,
                  category_id: category.id,
                  subcategory_id: subcategory.id,
                });
              });
            }
          });
        }
      });

      console.log("Products loaded:", productsList.length);
      console.log("Categories loaded:", categoriesList.length);
      console.log("Subcategories loaded:", subcategoriesList.length);
      console.log("Sub-subcategories loaded:", subSubcategoriesList.length);
      console.log("Pagination:", paginationData);

      // Debug: Show sample product data
      if (productsList.length > 0) {
        console.log("Sample product data:", productsList[0]);
        console.log("Product category fields:", {
          category: productsList[0].category,
          subcategory: productsList[0].subcategory,
          sub_subcategory: productsList[0].sub_subcategory,
          category_type: typeof productsList[0].category,
          subcategory_type: typeof productsList[0].subcategory,
          sub_subcategory_type: typeof productsList[0].sub_subcategory,
        });
      }

      // Debug: Show filter values and types
      console.log("Current filter values:", {
        filterCategory,
        filterSubcategory,
        filterSubSubcategory,
        filterCategory_type: typeof filterCategory,
        filterSubcategory_type: typeof filterSubcategory,
        filterSubSubcategory_type: typeof filterSubSubcategory,
      });

      // Debug: Show sub-subcategory data structure
      if (subSubcategoriesList.length > 0) {
        console.log("Sample sub-subcategory data:", subSubcategoriesList[0]);
      }

      setProducts(Array.isArray(productsList) ? productsList : []);
      setCategories(Array.isArray(categoriesList) ? categoriesList : []);
      setSubcategories(
        Array.isArray(subcategoriesList) ? subcategoriesList : [],
      );
      setSubSubcategories(
        Array.isArray(subSubcategoriesList) ? subSubcategoriesList : [],
      );

      // Update pagination state
      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || pagination.limit,
        total: paginationData.total || 0,
        pages: paginationData.pages || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  const loadProductForEdit = async (id) => {
    try {
      // ✅ FIX: Use consistent ID (Supabase uses 'id' only)
      const product = products.find((p) => p.id === id);
      if (product) {
        console.log("🔍 Loading product for edit:", product.name);
        console.log("📸 Existing images:", product.images);
        console.log("🖼️ Main image:", product.image);
        setEditingProduct(product);
        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          shortDescription: product.short_description || "",
          description: product.description || "",
          brand: product.brand || "", // ✅ Add brand field
          category: product.category || "",
          subcategory: product.subcategory || "",
          subSubcategory: product.sub_subcategory || "",
          price: product.price || product.final_price || "",
          oldPrice: product.old_price || "",
          images: product.images || [],
          stock: product.stock || "",
          isActive: product.is_active !== undefined ? product.is_active : true,
          isNew: product.is_new || false,
          isLimitedEdition: product.is_limited_edition || false,
          isBlueMondaySale: product.is_blue_monday_sale || false,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          seoMetaTitle: product.seo_meta_title || "",
          seoMetaDescription: product.seo_meta_description || "",
          keywords: product.keywords || "",
          taxPercentage: product.tax_percentage || "",
          stockStatus: product.stock_status || "in_stock",
          featured: product.featured || false,
          status: product.status || "active",
        });
        console.log("📝 Form data set with images:", product.images || []);
        setShowForm(true);
      }
    } catch (error) {
      toast.error("Error loading product");
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    console.log(`Input change: ${name} = ${value} (type: ${type})`);

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (
      type === "text" ||
      type === "textarea" ||
      type === "number" ||
      type === "email"
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (type === "select-one") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      // For other input types
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  // Helper function to get correct image URL for products
  const getProductImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    // If it's a relative URL, add the backend URL
    return `${process.env.REACT_APP_API_URL || "http://localhost:5001"}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    console.log("Starting image upload for", files.length, "files");

    const compressImage = (file) => {
      return new Promise((resolve) => {
        console.log(
          "Starting compression for file:",
          file.name,
          "original size:",
          file.size,
        );

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          let { width, height } = img;
          const maxSize = 1200;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            "image/jpeg",
            0.85,
          );
        };

        img.onerror = () => {
          resolve(file);
        };

        img.src = URL.createObjectURL(file);
      });
    };

    try {
      const base64Images = [];

      for (const file of files) {
        if (!file) continue;

        // Match ContentPage behavior: reject very large uploads before compression
        if (file.size > 10 * 1024 * 1024) {
          toast.error("Image size must be less than 10MB before compression");
          continue;
        }

        const compressedFile = await compressImage(file);

        if (compressedFile.size > 5 * 1024 * 1024) {
          toast.error(
            "Compressed image is still too large. Please use a smaller image.",
          );
          continue;
        }

        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(compressedFile);
        });

        // basic sanity: keep within same rough “10MB after compression” intent
        if (typeof base64 === "string" && base64.length > 10 * 1024 * 1024) {
          toast.error(
            "Compressed image is still too large. Please use a smaller image.",
          );
          continue;
        }

        base64Images.push(base64);
      }

      if (base64Images.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...base64Images],
        }));
        toast.success(`${base64Images.length} image(s) added successfully!`);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Error uploading images");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Product images are now stored as base64 data URLs in formData.images.
  // Keep this helper for backward compatibility with the existing submit logic.
  const uploadBlobImages = async (images) => {
    if (!Array.isArray(images)) return [];
    // Accept base64 strings directly; ignore legacy preview objects.
    return images.filter((img) => typeof img === "string");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Enhanced validation
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Product name must be at least 2 characters long");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      console.log("🔥 Form submission started!");
      console.log(
        "📝 Form data before submission:",
        JSON.stringify(formData, null, 2),
      );

      // Get correct product ID for Supabase (UUID format) - only for updates
      const productId = editingProduct?.id;

      // For updates, validate UUID format
      if (editingProduct && productId) {
        if (
          typeof productId === "string" &&
          !productId.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          )
        ) {
          toast.error("Invalid product ID format");
          return;
        }
      }

      // ✅ ENHANCED: Process images with better error handling
      let processedImages = [];
      let mainImage = "";
      let hasImageErrors = false;

      // Process only manual file uploads
      let allImages = [];

      if (formData.images && formData.images.length > 0) {
        console.log("🔄 Processing uploaded files...");
        console.log("📸 Form images:", formData.images);

        try {
          // Upload blob URLs and get final URLs
          const uploadedImages = await uploadBlobImages(formData.images);
          if (uploadedImages.length > 0) {
            // Upload base64 images to backend which will store them in Supabase
            try {
              const uploadResult = await uploadImages(uploadedImages);
              // uploadResult.images should be an array of { url, filename, ... }
              if (uploadResult && uploadResult.images && uploadResult.images.length > 0) {
                allImages = uploadResult.images.map((img) => img.url || img.publicUrl || img);
                console.log("✅ Manual uploads processed successfully:", uploadResult.images);
              } else {
                console.error('❌ Upload result missing images field', uploadResult);
                hasImageErrors = true;
              }
            } catch (uploadErr) {
              console.error('❌ Error uploading images to backend:', uploadErr);
              hasImageErrors = true;
            }
          }

          // Check if any images failed to upload
          if (uploadedImages.length === 0 && formData.images.length > 0) {
            hasImageErrors = true;
            toast.error("Manual image uploads failed. Please try again.");
          }
        } catch (imageError) {
          console.error("❌ Manual upload processing error:", imageError);
          hasImageErrors = true;
          toast.error("Image upload failed. Please try again.");
        }
      }

      // Set final processed images
      if (allImages.length > 0) {
        processedImages = allImages;
        mainImage = allImages[0] || "";
        console.log("✅ Final processed images:", processedImages);
        console.log("🖼️ Main image:", mainImage);
      }
      // Only fallback to existing images if this is creating a new product (not editing)
      // For editing, if no images are provided, it means user wants to remove them
      else if (!editingProduct) {
        // This case shouldn't happen for new products, but handle it gracefully
        console.log("� No images provided for new product");
        processedImages = [];
        mainImage = "";
      }
      // For editing products with no images, it means images were intentionally removed
      else if (editingProduct) {
        processedImages = [];
        mainImage = "";
        console.log("🗑️ Images intentionally removed from existing product");
      }

      // ✅ ENHANCED: Generate unique slug if not provided
      const generateUniqueSlug = (name, existingSlug = null) => {
        if (existingSlug && existingSlug.trim()) {
          return existingSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        }
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const timestamp = Date.now();
        return `${baseSlug}-${timestamp}`;
      };

      // ✅ SCHEMA COMPLIANT: Only fields that exist in Supabase
      const productData = {
        name: formData.name.trim(),
        slug: generateUniqueSlug(formData.name, formData.slug),
        description:
          formData.description?.trim() ||
          formData.shortDescription?.trim() ||
          "Product description", // ✅ Required field
        price: parseFloat(formData.price) || 0,
        old_price: parseFloat(formData.oldPrice) || null,
        final_price: parseFloat(formData.price) || 0,
        category: formData.category,
        subcategory: formData.subcategory || "uncategorized", // ✅ Required field, cannot be null
        sub_subcategory: formData.subSubcategory || null, // ✅ Add sub-subcategory field (text)
        sub_subcategory_id: formData.subSubcategoryId || null, // ✅ Add sub-subcategory ID field (UUID)
        brand: formData.brand?.trim() || "Unknown Brand", // ✅ Add brand field with default
        images: processedImages,
        image: mainImage,
        stock: parseInt(formData.stock) || 0,
        is_active: formData.isActive !== false,
        is_new: formData.isNew || false,
        is_limited_edition: formData.isLimitedEdition || false,
        is_blue_monday_sale: formData.isBlueMondaySale || false,
        featured: formData.featured || false,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        // ❌ REMOVED: Fields not in Supabase schema
        // short_description, seo_meta_title, seo_meta_description, keywords
      };

      console.log(
        "🚀 Product data being sent:",
        JSON.stringify(productData, null, 2),
      );
      console.log("🎯 Editing product ID:", productId);
      console.log("📸 Final images:", processedImages);
      console.log("🖼️ Main image:", mainImage);

      // ✅ ENHANCED: Show loading state
      const loadingMessage = editingProduct
        ? "Updating product..."
        : "Creating product...";
      const loadingToast = toast.loading(loadingMessage);

      try {
        let result;
        if (editingProduct) {
          console.log("📝 Updating product...");
          result = await updateProduct(productId, productData);
          console.log("✅ Update result:", result);
          toast.success("Product updated successfully!");
        } else {
          console.log("➕ Creating new product...");
          result = await createProduct(productData);
          console.log("✅ Create result:", result);
          toast.success("Product created successfully!");
        }

        // ✅ Success feedback
        toast.dismiss(loadingToast);
        resetForm();
        loadData();

        // ✅ Additional success message with image status
        if (hasImageErrors) {
          toast.info(
            "Product saved but some images had issues. You can add images later.",
          );
        } else if (processedImages.length > 0) {
          toast.success(
            `Product saved with ${processedImages.length} image(s)`,
          );
        }
      } catch (apiError) {
        toast.dismiss(loadingToast);
        throw apiError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error("❌ Product submission error:", error);
      console.error("❌ Error response:", error.response?.data);

      // ✅ ENHANCED: Better error handling
      let errorMessage = "Error saving product";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      // Handle specific error cases
      if (
        errorMessage.includes("duplicate") ||
        errorMessage.includes("already exists")
      ) {
        errorMessage =
          "A product with this name or slug already exists. Please use a different name.";
      } else if (
        errorMessage.includes("validation") ||
        errorMessage.includes("required")
      ) {
        errorMessage = "Please fill in all required fields correctly.";
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("connection")
      ) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast.error(errorMessage);
    }
  };

  const handleEdit = (product) => {
    // ✅ FIX: Force consistent ID usage (Supabase uses 'id' only)
    const productId = product.id;

    if (!productId) {
      toast.error("Invalid product ID");
      return;
    }

    setEditingProduct(product);

    // ✅ FIX: Properly handle existing images
    const existingImages = product.images || [];
    console.log("📸 Loading existing images for edit:", existingImages);

    setFormData({
      name: product.name || product.title || "",
      slug: product.slug || "",
      shortDescription: product.short_description || "",
      description: product.description || "",
      brand: product.brand || "", // ✅ Add brand field
      category: product.category || "",
      subcategory: product.subcategory || "",
      subSubcategory: product.sub_subcategory || "",
      subSubcategoryId: product.sub_subcategory_id || "",
      price: product.price || product.final_price || "",
      oldPrice: product.old_price || "",
      images: existingImages, // ✅ Load existing images properly
      imageUrls: existingImages.join("\n") || "", // ✅ Also populate image URLs field
      imageUrl1: existingImages[0] || "", // ✅ Populate individual URL fields
      imageUrl2: existingImages[1] || "",
      imageUrl3: existingImages[2] || "",
      imageUrl4: existingImages[3] || "",
      stock: product.stock || 0,
      isActive: product.is_active !== false,
      isNew: product.is_new || false,
      isLimitedEdition: product.is_limited_edition || false,
      isBlueMondaySale: product.is_blue_monday_sale || false,
      featured: product.featured || false,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      seoMetaTitle: product.seo_meta_title || "",
      seoMetaDescription: product.seo_meta_description || "",
      keywords: product.keywords || "",
      taxPercentage: product.tax_percentage || "",
      stockStatus: product.stock_status || "in_stock",
      status: product.status || "active",
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted successfully!");
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting product");
      }
    }
  };

  const handleSelectProduct = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p._id || p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      toast.error("No products selected for deletion");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedProducts.size} product(s)? This action cannot be undone.`,
      )
    ) {
      try {
        await bulkDeleteProducts(Array.from(selectedProducts));
        toast.success(
          `${selectedProducts.size} product(s) deleted successfully!`,
        );
        setSelectedProducts(new Set());
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting products");
      }
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = !product.isActive;
      await updateProductStatus(product._id, newStatus);
      toast.success(
        `Product ${newStatus ? "activated" : "deactivated"} successfully!`,
      );
      loadData();
    } catch (error) {
      toast.error("Error updating product status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      brand: "", // ✅ Add brand field
      category: "",
      subcategory: "",
      subSubcategory: "",
      subSubcategoryId: "",
      price: "",
      oldPrice: "",
      images: [],
      stock: "",
      isActive: true,
      isNew: false,
      isLimitedEdition: false,
      isBlueMondaySale: false,
      rating: 0,
      reviews: 0,
      seoMetaTitle: "",
      seoMetaDescription: "",
      keywords: "",
      taxPercentage: "",
      stockStatus: "in_stock",
      featured: false,
      status: "active",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name || product.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (product.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && product.is_active) ||
      (filterStatus === "inactive" && !product.is_active);
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    // Handle subcategory matching - support both ID and name matching
    let matchesSubcategory = filterSubcategory === "all";
    if (filterSubcategory !== "all") {
      // Find the selected subcategory object to get its name
      const selectedSub = subcategories.find(
        (sub) => (sub._id || sub.id) === filterSubcategory,
      );

      if (selectedSub) {
        // Match by ID or by name
        matchesSubcategory =
          product.subcategory === filterSubcategory ||
          product.subcategory === selectedSub.name;
      }
    }

    // Handle sub-subcategory matching - support both ID and name matching
    let matchesSubSubcategory = filterSubSubcategory === "all";
    if (filterSubSubcategory !== "all") {
      // Find the selected sub-subcategory object to get its name
      const selectedSubSub = subSubcategories.find(
        (subSub) => (subSub._id || subSub.id) === filterSubSubcategory,
      );

      if (selectedSubSub) {
        // Match by ID or by name
        matchesSubSubcategory =
          product.sub_subcategory === filterSubSubcategory ||
          product.sub_subcategory === selectedSubSub.name;
      }
    }

    console.log("Filtering product:", {
      name: product.name,
      is_active: product.is_active,
      category: product.category,
      subcategory: product.subcategory,
      sub_subcategory: product.sub_subcategory,
      matchesSearch,
      matchesStatus,
      matchesCategory,
      matchesSubcategory,
      matchesSubSubcategory,
      searchTerm,
      filterStatus,
      filterCategory,
      filterSubcategory,
      filterSubSubcategory,
    });

    // Debug: Show why a product might be filtered out
    if (!matchesSubSubcategory && filterSubSubcategory !== "all") {
      const selectedSubSub = subSubcategories.find(
        (subSub) => (subSub._id || subSub.id) === filterSubSubcategory,
      );
      console.log(
        `Product "${product.name}" filtered out - sub_subcategory mismatch:`,
        {
          product_sub_subcategory: product.sub_subcategory,
          filter_sub_subcategory: filterSubSubcategory,
          selected_sub_sub_name: selectedSubSub?.name,
          comparison_by_id: product.sub_subcategory === filterSubSubcategory,
          comparison_by_name: product.sub_subcategory === selectedSubSub?.name,
        },
      );
    }

    if (!matchesSubcategory && filterSubcategory !== "all") {
      const selectedSub = subcategories.find(
        (sub) => (sub._id || sub.id) === filterSubcategory,
      );
      console.log(
        `Product "${product.name}" filtered out - subcategory mismatch:`,
        {
          product_subcategory: product.subcategory,
          filter_subcategory: filterSubcategory,
          selected_sub_name: selectedSub?.name,
          comparison_by_id: product.subcategory === filterSubcategory,
          comparison_by_name: product.subcategory === selectedSub?.name,
        },
      );
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesSubcategory &&
      matchesSubSubcategory
    );
  });

  console.log("Filter results:", {
    totalProducts: products.length,
    filteredProducts: filteredProducts.length,
    searchTerm,
    filterStatus,
    filterCategory,
    filterSubcategory,
    filterSubSubcategory,
  });

  if (loading) {
    console.log("ProductsPage: Still loading...");
    return (
      <div className="flex">
        <SidebarNoAuth />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log(
    "ProductsPage: Rendering with products:",
    products.length,
    "products",
  );

  return (
    <div className="flex">
      <SidebarNoAuth />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Products Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setFilterSubcategory("all"); // Reset subcategory when category changes
                  setFilterSubSubcategory("all"); // Reset sub-subcategory when category changes
                }}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option
                    key={category._id || category.id}
                    value={category._id || category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={filterSubcategory}
                onChange={(e) => {
                  setFilterSubcategory(e.target.value);
                  setFilterSubSubcategory("all"); // Reset sub-subcategory when subcategory changes
                }}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={filterCategory === "all"}
              >
                <option value="all">All Subcategories</option>
                {subcategories
                  .filter(
                    (sub) =>
                      filterCategory === "all" ||
                      sub.category_id === filterCategory,
                  )
                  .map((subcategory) => (
                    <option
                      key={subcategory._id || subcategory.id}
                      value={subcategory._id || subcategory.id}
                    >
                      {subcategory.name}
                    </option>
                  ))}
              </select>

              <select
                value={filterSubSubcategory}
                onChange={(e) => setFilterSubSubcategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={filterSubcategory === "all"}
              >
                <option value="all">All Sub-Subcategories</option>
                {subSubcategories
                  .filter(
                    (subSub) =>
                      filterSubcategory === "all" ||
                      subSub.subcategory_id === filterSubcategory,
                  )
                  .map((subSubcategory) => (
                    <option
                      key={subSubcategory._id || subSubcategory.id}
                      value={subSubcategory._id || subSubcategory.id}
                    >
                      {subSubcategory.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-2">
              {selectedProducts.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                  Delete Selected ({selectedProducts.size})
                </button>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={handleSelectAll}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                      >
                        {selectedProducts.size === filteredProducts.length &&
                        filteredProducts.length > 0 ? (
                          <FiCheckSquare className="w-4 h-4" />
                        ) : (
                          <FiSquare className="w-4 h-4" />
                        )}
                        Select
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id || product.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleSelectProduct(product._id || product.id)
                          }
                          className="text-gray-600 hover:text-gray-900"
                        >
                          {selectedProducts.has(product._id || product.id) ? (
                            <FiCheckSquare className="w-4 h-4" />
                          ) : (
                            <FiSquare className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.image && (
                            <img
                              src={getProductImageUrl(product.image)}
                              alt={product.name || product.title}
                              className="w-12 h-12 object-cover rounded-md mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name || product.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {product.category || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{product.price || product.final_price}
                          {product.old_price &&
                            product.old_price > product.price && (
                              <span className="text-gray-500 line-through ml-2">
                                ₹{product.old_price}
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(product._id || product.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                ? "No products found matching your search criteria."
                : "No products found. Add your first product to get started."}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="bg-white rounded-lg shadow-md p-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} products
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadData(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    pagination.page <= 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {/* Show page numbers */}
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => loadData(pageNum)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            pagination.page === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() => loadData(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    pagination.page >= pagination.pages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <ProductFormModal
            formData={formData}
            editingProduct={editingProduct}
            categories={categories}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />
        )}
      </div>
    </div>
  );
}
