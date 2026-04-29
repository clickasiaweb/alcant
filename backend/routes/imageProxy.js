const express = require('express');
const router = express.Router();
const { imageProxy, googleDriveProxy } = require('../controllers/imageProxyController');

// Generic image proxy endpoint
// Usage: GET /api/proxy/image?imageUrl=https://drive.google.com/uc?export=view&id=FILE_ID
router.get('/image', imageProxy);

// Google Drive specific proxy endpoint
// Usage: GET /api/proxy/drive/FILE_ID
router.get('/drive/:fileId', googleDriveProxy);

module.exports = router;
