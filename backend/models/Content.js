const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  pageKey: {
    type: String,
    required: true,
    unique: true,
  },
  title: String,
  subtitle: String,
  content: String,
  buttonText: String,
  buttonLink: String,
  backgroundImage: String,
  imageUrl: String,
  items: [
    {
      title: String,
      description: String,
      image: String,
      link: String,
      order: Number,
    },
  ],
  sections: [
    {
      name: String,
      content: String,
      order: Number,
    },
  ],
  metadata: mongoose.Schema.Types.Mixed,
  bannerImage: String,
  isPublished: {
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

module.exports = mongoose.model("Content", contentSchema);
