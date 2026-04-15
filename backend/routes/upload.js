const express = require('express');
const router = express.Router();
const { upload, uploadImage, uploadMultipleImages, deleteImage } = require('../controllers/imageUploadController');

// Upload single image
router.post('/image', upload.single('image'), uploadImage);

// Upload multiple images
router.post('/images', upload.array('images', 10), uploadMultipleImages);

// Delete image
router.delete('/image/:filename', deleteImage);

module.exports = router;
