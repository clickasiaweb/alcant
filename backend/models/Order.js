const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, "Order ID is required"],
    unique: true,
    trim: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"],
    index: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, "Product ID is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    image: {
      type: String,
      trim: true,
    },
    variant: {
      color: {
        type: String,
        trim: true,
      },
      size: {
        type: String,
        trim: true,
      },
    },
  }],
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0, "Total amount cannot be negative"],
  },
  subtotal: {
    type: Number,
    required: [true, "Subtotal is required"],
    min: [0, "Subtotal cannot be negative"],
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, "Tax cannot be negative"],
  },
  shipping: {
    type: Number,
    default: 0,
    min: [0, "Shipping cost cannot be negative"],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending",
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery", "UPI", "Net Banking"],
    required: [true, "Payment method is required"],
  },
  paymentDetails: {
    transactionId: {
      type: String,
      trim: true,
    },
    gateway: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
    index: true,
  },
  trackingId: {
    type: String,
    trim: true,
    sparse: true,
  },
  shippingAddress: {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    apartment: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      default: "India",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
  },
  billingAddress: {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    apartment: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: "India",
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, "Notes cannot exceed 500 characters"],
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  estimatedDelivery: {
    type: Date,
  },
  actualDelivery: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: [500, "Cancellation reason cannot exceed 500 characters"],
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
orderSchema.index({ orderId: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ trackingId: 1 });
orderSchema.index({ "shippingAddress.email": 1 });
orderSchema.index({ "shippingAddress.phone": 1 });

// Pre-save hook to generate order ID and update timestamps
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    // Generate unique order ID with format: ORD + timestamp + random
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderId = `ORD${timestamp}${random}`;
  }

  // Copy shipping address to billing address if billing address is not provided
  if (!this.billingAddress || Object.keys(this.billingAddress).length === 0) {
    this.billingAddress = { ...this.shippingAddress };
  }

  this.updatedAt = Date.now();
  next();
});

// Method to add status to history
orderSchema.methods.addStatusHistory = function(status, note, updatedBy) {
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    note,
    updatedBy
  });
  this.orderStatus = status;
  
  // Set specific timestamps based on status
  if (status === "Delivered") {
    this.actualDelivery = new Date();
  } else if (status === "Cancelled") {
    this.cancelledAt = new Date();
  }
  
  return this.save();
};

// Method to check if order can be updated
orderSchema.methods.canUpdateStatus = function(newStatus) {
  // Cancelled orders cannot be updated
  if (this.orderStatus === "Cancelled") {
    return { allowed: false, reason: "Cancelled orders cannot be updated" };
  }
  
  // Delivered orders can only be updated to specific statuses
  if (this.orderStatus === "Delivered") {
    const allowedStatuses = ["Delivered", "Cancelled"];
    if (!allowedStatuses.includes(newStatus)) {
      return { allowed: false, reason: "Delivered orders can only be cancelled" };
    }
  }
  
  // Payment must be paid for most status updates (except cancellation)
  if (this.paymentStatus !== "Paid" && newStatus !== "Cancelled" && newStatus !== "Pending") {
    return { allowed: false, reason: "Order must be paid to update status" };
  }
  
  return { allowed: true };
};

// Method to get next possible statuses
orderSchema.methods.getNextPossibleStatuses = function() {
  const currentStatus = this.orderStatus;
  
  if (currentStatus === "Cancelled" || currentStatus === "Delivered") {
    return [];
  }
  
  const statusFlow = {
    "Pending": ["Confirmed", "Cancelled"],
    "Confirmed": ["Processing", "Cancelled"],
    "Processing": ["Shipped", "Cancelled"],
    "Shipped": ["Out for Delivery"],
    "Out for Delivery": ["Delivered"]
  };
  
  return statusFlow[currentStatus] || [];
};

// Virtual for formatted total amount
orderSchema.virtual("formattedTotalAmount").get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(this.totalAmount);
});

// Virtual for order duration
orderSchema.virtual("orderDuration").get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return "Just now";
});

// Ensure virtuals are included in JSON output
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Order", orderSchema);
