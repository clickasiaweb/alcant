const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
  },
  position: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
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
productImageSchema.index({ product: 1 });
productImageSchema.index({ position: 1 });
productImageSchema.index({ isActive: 1 });

// Pre-save hook to update timestamps
productImageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ProductImage', productImageSchema);
