const express = require('express');
const router = express.Router();
const { upload, uploadImage, uploadMultipleImages, deleteImage, ensureProductsBucket } = require('../controllers/supabaseImageUploadController');

// Upload single image
router.post('/image', upload.single('image'), uploadImage);

// Upload multiple images
router.post('/images', upload.array('images', 10), uploadMultipleImages);

// Delete image
router.delete('/image/:filename', deleteImage);

// Ensure products bucket exists and is public
router.post('/ensure-bucket', async (req, res) => {
  try {
    const success = await ensureProductsBucket();
    if (success) {
      res.json({
        success: true,
        message: 'Products bucket is ready'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to ensure products bucket'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking products bucket',
      error: error.message
    });
  }
});

module.exports = router;
