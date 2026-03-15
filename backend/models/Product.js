const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [200, "Name cannot exceed 200 characters"],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    minlength: [10, "Description must be at least 10 characters"],
  },
  shortDescription: {
    type: String,
    maxlength: [500, "Short description cannot exceed 500 characters"],
  },
  brand: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
  salePrice: {
    type: Number,
    min: [0, "Sale price cannot be negative"],
  },
  oldPrice: {
    type: Number,
    min: [0, "Old price cannot be negative"],
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
    index: true,
  },
  subcategory: {
    type: String,
    required: [true, "Subcategory is required"],
    trim: true,
  },
  subSubCategory: {
    type: String,
    trim: true,
  },
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    trim: true,
    index: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  color: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    trim: true,
  },
  weight: {
    type: Number,
    min: [0, "Weight cannot be negative"],
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  isNew: {
    type: Boolean,
    default: false,
    index: true,
  },
  isLimitedEdition: {
    type: Boolean,
    default: false,
    index: true,
  },
  isBlueMondaySale: {
    type: Boolean,
    default: false,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isNew: 1 });
productSchema.index({ isLimitedEdition: 1 });
productSchema.index({ isBlueMondaySale: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Pre-save hook to generate slug and calculate final price
productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Calculate final price based on sale price or old price
  if (this.salePrice && this.salePrice < this.price) {
    this.finalPrice = this.salePrice;
  } else if (this.oldPrice && this.oldPrice > this.price) {
    this.finalPrice = this.price;
  } else {
    this.finalPrice = this.price;
  }

  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);
