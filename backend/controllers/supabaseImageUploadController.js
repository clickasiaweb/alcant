const { supabaseService } = require('../config/supabase');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (files will be uploaded to Supabase)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload single image to Supabase storage
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const fileName = `product-${uniqueSuffix}${ext}`;

    // Upload to Supabase storage
    const { data, error } = await supabaseService.storage
      .from('products')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image to Supabase',
        error: error.message
      });
    }

    // Get public URL
    const { data: urlData } = supabaseService.storage
      .from('products')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    res.json({
      success: true,
      message: 'Image uploaded successfully to Supabase',
      url: publicUrl,
      filename: fileName,
      originalName: req.file.originalname,
      size: req.file.size,
      path: data.path
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

// Upload multiple images to Supabase storage
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const fileName = `product-${uniqueSuffix}${ext}`;

      // Upload to Supabase storage
      const { data, error } = await supabaseService.storage
        .from('products')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabaseService.storage
        .from('products')
        .getPublicUrl(fileName);

      return {
        url: urlData.publicUrl,
        filename: fileName,
        originalName: file.originalname,
        size: file.size,
        path: data.path
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully to Supabase`,
      images: uploadedImages
    });

  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
};

// Delete image from Supabase storage
const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    // Delete from Supabase storage
    const { data, error } = await supabaseService.storage
      .from('products')
      .remove([filename]);

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete image from Supabase',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully from Supabase',
      data: data
    });

  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
};

// Check if products bucket exists, create if it doesn't
const ensureProductsBucket = async () => {
  try {
    const { data, error } = await supabaseService.storage.getBucket('products');
    
    if (error && error.message.includes('not found')) {
      // Create the bucket
      const { data: newBucket, error: createError } = await supabaseService.storage.createBucket('products', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error('Error creating products bucket:', createError);
        return false;
      }
      
      console.log('Products bucket created successfully');
      return true;
    } else if (error) {
      console.error('Error checking products bucket:', error);
      return false;
    }
    
    // Check if bucket is public
    if (data && !data.public) {
      const { error: updateError } = await supabaseService.storage.updateBucket('products', {
        public: true
      });
      
      if (updateError) {
        console.error('Error updating products bucket to public:', updateError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring products bucket:', error);
    return false;
  }
};

module.exports = {
  upload,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  ensureProductsBucket
};
