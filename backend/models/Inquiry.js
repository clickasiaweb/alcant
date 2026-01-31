const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  company: String,
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  status: {
    type: String,
    enum: ["new", "read", "responded", "closed"],
    default: "new",
  },
  response: String,
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  respondedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Inquiry", inquirySchema);
