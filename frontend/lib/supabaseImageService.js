import { supabase } from './supabase'

/**
 * Service for handling image uploads to Supabase Storage
 */
export const supabaseImageService = {
  /**
   * Upload a single image to Supabase storage
   * @param {File} file - The image file to upload
   * @param {string} folder - Optional folder name (default: 'products')
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  uploadImage: async (file, folder = 'products') => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Only image files are allowed'
        }
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: 'File size must be less than 5MB'
        }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(folder)
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        return {
          success: false,
          error: error.message || 'Failed to upload image'
        }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(folder)
        .getPublicUrl(filePath)

      return {
        success: true,
        url: urlData.publicUrl,
        path: data.path,
        fileName: fileName
      }

    } catch (error) {
      console.error('Image upload error:', error)
      return {
        success: false,
        error: error.message || 'Failed to upload image'
      }
    }
  },

  /**
   * Upload multiple images
   * @param {File[]} files - Array of image files
   * @param {string} folder - Optional folder name
   * @returns {Promise<{success: boolean, results: Array, error?: string}>}
   */
  uploadMultipleImages: async (files, folder = 'products') => {
    try {
      const uploadPromises = files.map(file => 
        supabaseImageService.uploadImage(file, folder)
      )

      const results = await Promise.all(uploadPromises)
      
      const successful = results.filter(result => result.success)
      const failed = results.filter(result => !result.success)

      return {
        success: failed.length === 0,
        results: results,
        successful: successful,
        failed: failed,
        message: `Uploaded ${successful.length} of ${files.length} images successfully`
      }

    } catch (error) {
      console.error('Multiple images upload error:', error)
      return {
        success: false,
        results: [],
        error: error.message || 'Failed to upload images'
      }
    }
  },

  /**
   * Delete an image from Supabase storage
   * @param {string} path - The file path in storage
   * @param {string} folder - Optional folder name
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  deleteImage: async (path, folder = 'products') => {
    try {
      const { error } = await supabase.storage
        .from(folder)
        .remove([path])

      if (error) {
        console.error('Supabase delete error:', error)
        return {
          success: false,
          error: error.message || 'Failed to delete image'
        }
      }

      return { success: true }

    } catch (error) {
      console.error('Image deletion error:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete image'
      }
    }
  },

  /**
   * Get public URL for a file path
   * @param {string} path - The file path in storage
   * @param {string} folder - Optional folder name
   * @returns {string} The public URL
   */
  getPublicUrl: (path, folder = 'products') => {
    const { data } = supabase.storage
      .from(folder)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  /**
   * Validate image file
   * @param {File} file - The file to validate
   * @returns {Object} Validation result
   */
  validateImage: (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, GIF, and WebP images are allowed'
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 5MB'
      }
    }

    return { valid: true }
  }
}

export default supabaseImageService
