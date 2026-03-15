const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  sku: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance
productVariantSchema.index({ product: 1 });
productVariantSchema.index({ sku: 1 });
productVariantSchema.index({ color: 1, size: 1 });
productVariantSchema.index({ isActive: 1 });

// Pre-save hook to generate SKU if not provided
productVariantSchema.pre('save', function(next) {
  if (!this.sku && this.product && this.color && this.size) {
    // Generate SKU based on product, color, and size
    this.sku = `${this.product}-${this.color}-${this.size}`.toUpperCase().replace(/\s+/g, '-');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ProductVariant', productVariantSchema);
