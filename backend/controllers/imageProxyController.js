const axios = require('axios');
const express = require('express');

// Image proxy controller to handle CORS and hotlinking issues
const imageProxy = async (req, res) => {
  try {
    const { imageUrl } = req.query;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }
    
    console.log('Proxying image:', imageUrl);
    
    // Fetch the image from the original URL
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://drive.google.com/',
        'Cache-Control': 'no-cache'
      }
    });
    
    // Set appropriate headers
    const contentType = response.headers['content-type'];
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', response.data.length);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Send the image data
    res.send(response.data);
    
    console.log('✅ Image proxied successfully:', {
      url: imageUrl,
      contentType,
      size: response.data.length
    });
    
  } catch (error) {
    console.error('❌ Image proxy failed:', error.message);
    
    // Send a fallback image or error
    if (error.response?.status === 403) {
      // 403 means forbidden (likely hotlink protection)
      res.status(403).json({
        success: false,
        message: 'Image access forbidden - likely due to hotlink protection',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to proxy image',
        error: error.message
      });
    }
  }
};

// Alternative: Google Drive specific proxy
const googleDriveProxy = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'Google Drive file ID is required'
      });
    }
    
    // Construct the Google Drive direct URL
    const driveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    
    console.log('Proxying Google Drive image:', driveUrl);
    
    // Fetch the image from Google Drive
    const response = await axios.get(driveUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://drive.google.com/'
      }
    });
    
    // Set appropriate headers
    const contentType = response.headers['content-type'];
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', response.data.length);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Send the image data
    res.send(response.data);
    
    console.log('✅ Google Drive image proxied successfully:', {
      fileId,
      contentType,
      size: response.data.length
    });
    
  } catch (error) {
    console.error('❌ Google Drive proxy failed:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to proxy Google Drive image',
      error: error.message
    });
  }
};

module.exports = {
  imageProxy,
  googleDriveProxy
};
