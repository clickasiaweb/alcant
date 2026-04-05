const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// POST /api/reviews - Create a new review
router.post('/', reviewController.createReview);

// GET /api/reviews/:product_id - Get reviews for a product
router.get('/:product_id', reviewController.getProductReviews);

// GET /api/reviews/summary/:product_id - Get rating summary for a product
router.get('/summary/:product_id', reviewController.getProductRatingSummary);

// GET /api/reviews/user/:user_id - Get reviews by a user
router.get('/user/:user_id', reviewController.getUserReviews);

// PUT /api/reviews/:review_id - Update a review
router.put('/:review_id', reviewController.updateReview);

// DELETE /api/reviews/:review_id - Delete a review
router.delete('/:review_id', reviewController.deleteReview);

module.exports = router;
