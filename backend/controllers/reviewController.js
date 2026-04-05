const SupabaseReview = require("../models/SupabaseReview");
const { body, validationResult } = require("express-validator");
const { supabase, supabaseService } = require('../config/supabase');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// POST /api/reviews - Create a new review
exports.createReview = [
  // Validation
  body("product_id")
    .notEmpty()
    .withMessage("Product ID is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review_text")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review text must be between 10 and 1000 characters"),

  handleValidationErrors,

  async (req, res) => {
    try {
      const { product_id, rating, review_text } = req.body;
      
      // TODO: Get user_id from authentication (for now, use a placeholder)
      const user_id = req.user?.id || '00000000-0000-0000-0000-000000000000'; // Placeholder user ID
      
      // Check if user already reviewed this product
      const existingReviews = await SupabaseReview.findByProductId(product_id);
      const userExistingReview = existingReviews.find(review => review.user_id === user_id);
      
      if (userExistingReview) {
        return res.status(400).json({
          error: "You have already reviewed this product",
          existing_review: userExistingReview
        });
      }
      
      // Create the review
      const reviewData = {
        product_id,
        user_id,
        rating,
        review_text
      };
      
      const review = await SupabaseReview.create(reviewData);
      
      // Update product's average rating and review count
      await SupabaseReview.updateProductRating(product_id);
      
      res.status(201).json({
        message: "Review created successfully",
        data: review
      });
    } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ error: error.message });
    }
  },
];

// GET /api/reviews/:product_id - Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    // Get reviews with pagination
    const reviews = await SupabaseReview.findByProductId(product_id, {
      limit: limitNum,
      offset
    });
    
    // Get rating summary
    const ratingData = await SupabaseReview.calculateAverageRating(product_id);
    
    // Get rating distribution
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', product_id);
    
    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };
    
    allReviews?.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });
    
    res.json({
      reviews,
      summary: {
        ...ratingData,
        distribution: ratingDistribution
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: ratingData.review_count,
        hasMore: offset + reviews.length < ratingData.review_count
      }
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/reviews/user/:user_id - Get reviews by a user
exports.getUserReviews = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    const reviews = await SupabaseReview.findByUserId(user_id, {
      limit: limitNum
    });
    
    res.json({
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: reviews.length
      }
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/reviews/:review_id - Update a review
exports.updateReview = [
  // Validation
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review_text")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review text must be between 10 and 1000 characters"),

  handleValidationErrors,

  async (req, res) => {
    try {
      const { review_id } = req.params;
      const { rating, review_text } = req.body;
      
      // TODO: Get user_id from authentication and verify ownership
      const user_id = req.user?.id || '00000000-0000-0000-0000-000000000000'; // Placeholder user ID
      
      // First get the existing review to verify ownership
      const existingReview = await SupabaseReview.findById(review_id);
      
      if (!existingReview) {
        return res.status(404).json({ error: "Review not found" });
      }
      
      if (existingReview.user_id !== user_id) {
        return res.status(403).json({ error: "You can only update your own reviews" });
      }
      
      // Update the review
      const updateData = {};
      if (rating !== undefined) updateData.rating = rating;
      if (review_text !== undefined) updateData.review_text = review_text;
      
      const { data, error } = await supabaseService
        .from('reviews')
        .update(updateData)
        .eq('id', review_id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update product's average rating
      await SupabaseReview.updateProductRating(existingReview.product_id);
      
      res.json({
        message: "Review updated successfully",
        data
      });
    } catch (error) {
      console.error("Update review error:", error);
      res.status(500).json({ error: error.message });
    }
  },
];

// DELETE /api/reviews/:review_id - Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    
    // TODO: Get user_id from authentication and verify ownership
    const user_id = req.user?.id || '00000000-0000-0000-0000-000000000000'; // Placeholder user ID
    
    const review = await SupabaseReview.delete(review_id, user_id);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found or you don't have permission to delete it" });
    }
    
    res.json({
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/reviews/summary/:product_id - Get rating summary for a product
exports.getProductRatingSummary = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    const ratingData = await SupabaseReview.calculateAverageRating(product_id);
    
    // Get rating distribution
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', product_id);
    
    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };
    
    allReviews?.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });
    
    res.json({
      ...ratingData,
      distribution: ratingDistribution
    });
  } catch (error) {
    console.error("Get rating summary error:", error);
    res.status(500).json({ error: error.message });
  }
};
