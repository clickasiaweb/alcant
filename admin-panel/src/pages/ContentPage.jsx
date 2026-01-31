import React, { useState, useEffect, useRef } from "react";
import { FiEdit2, FiSave, FiEye, FiFileText, FiHome, FiInfo, FiMail, FiPhone, FiImage, FiShoppingBag, FiUpload, FiX, FiRefreshCw } from "react-icons/fi";
import SidebarNoAuth from "../components/SidebarNoAuth";
import { getContent, updateContent } from "../services/api-services";
import { toast } from "react-toastify";

export default function ContentPage() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [selectedSection, setSelectedSection] = useState("hero");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [livePreview, setLivePreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const fileInputRefs = useRef({});

  const pages = [
    { key: "home", name: "Home", icon: FiHome, sections: [
      { key: "hero", name: "Hero Banner", type: "hero", fields: ["title", "subtitle", "content", "buttonText", "buttonLink", "backgroundImage"] },
      { key: "newWeHave", name: "New We Have", type: "feature", fields: ["title", "content", "imageUrl", "buttonText", "buttonLink"] },
      { key: "asSeenIn", name: "As Seen In", type: "logos", fields: ["title", "items"] },
      { key: "collections", name: "Collections", type: "grid", fields: ["title", "items"] },
      { key: "automotive", name: "Alcantara for Automotive", type: "feature", fields: ["title", "content", "buttonText", "buttonLink", "imageUrl"] },
      { key: "tuners", name: "Top Tuners", type: "team", fields: ["title", "items"] },
      { key: "partner", name: "Proud Partner", type: "feature", fields: ["title", "content", "buttonText", "buttonLink", "imageUrl", "videoFile"] },
      { key: "team", name: "Team Alcantara", type: "feature", fields: ["title", "content", "buttonText", "buttonLink", "imageUrl"] },
      { key: "community", name: "Join Our Community", type: "grid", fields: ["title", "items"] },
      { key: "features", name: "Features", type: "features", fields: ["items"] }
    ]},
    { key: "about", name: "About", icon: FiInfo, sections: [
      { key: "main", name: "Main Content", type: "content", fields: ["title", "content"] },
      { key: "team", name: "Team", type: "team", fields: ["title", "items"] },
      { key: "mission", name: "Mission", type: "content", fields: ["title", "content"] }
    ]},
    { key: "contact", name: "Contact", icon: FiMail, sections: [
      { key: "info", name: "Contact Info", type: "contact", fields: ["title", "content", "items"] },
      { key: "form", name: "Contact Form", type: "content", fields: ["title", "content"] }
    ]},
    { key: "products", name: "Products", icon: FiShoppingBag, sections: [
      { key: "listing", name: "Product Listing", type: "content", fields: ["title", "content"] },
      { key: "filters", name: "Filters", type: "items", fields: ["items"] },
      { key: "featured", name: "Featured Products", type: "grid", fields: ["title", "items"] }
    ]},
    { key: "footer", name: "Footer", icon: FiFileText, sections: [
      { key: "main", name: "Main Footer", type: "content", fields: ["title", "content"] },
      { key: "links", name: "Quick Links", type: "items", fields: ["items"] },
      { key: "social", name: "Social Media", type: "social", fields: ["items"] }
    ]},
  ];

  useEffect(() => {
    loadContent(selectedPage, selectedSection);
  }, [selectedPage, selectedSection]);

  // Ensure file input refs are available
  useEffect(() => {
    console.log('File input refs updated:', Object.keys(fileInputRefs.current));
  }, [formData.items]);

  const loadContent = async (pageKey, sectionKey = "hero") => {
    try {
      setLoading(true);
      const data = await getContent(`${pageKey}-${sectionKey}`);
      setContent(data.content);
      setFormData(data.content || {
        title: "",
        subtitle: "",
        content: "",
        buttonText: "",
        buttonLink: "",
        imageUrl: "",
        backgroundImage: "",
        videoUrl: "",
        videoFile: "",
        items: [],
        metadata: {},
        isPublished: true,
      });
    } catch (error) {
      toast.error("Error loading content");
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving content:', `${selectedPage}-${selectedSection}`, formData);
      const response = await updateContent(`${selectedPage}-${selectedSection}`, formData);
      console.log('Save response:', response);
      setContent(formData);
      setEditing(false);
      toast.success("Content saved successfully!");
    } catch (error) {
      console.error('Error saving content:', error);
      
      // Handle specific payload errors
      if (error.code === 'ERR_NETWORK' || error.message?.includes('413') || error.message?.includes('PayloadTooLargeError')) {
        toast.error("Content too large. Try reducing video/image sizes or use URLs instead.");
      } else if (error.response?.status === 413) {
        toast.error("Content too large. Try reducing video/image sizes or use URLs instead.");
      } else {
        toast.error(`Error saving content: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all content for this section? This action cannot be undone.")) {
      return;
    }
    
    try {
      const defaultContent = {
        title: "",
        subtitle: "",
        content: "",
        buttonText: "",
        buttonLink: "",
        imageUrl: "",
        backgroundImage: "",
        videoUrl: "",
        videoFile: "",
        items: [],
        metadata: {},
        isPublished: true,
      };
      
      await updateContent(`${selectedPage}-${selectedSection}`, defaultContent);
      setFormData(defaultContent);
      setContent(defaultContent);
      setEditing(false);
      toast.success("Content reset successfully!");
    } catch (error) {
      console.error('Error resetting content:', error);
      toast.error(`Error resetting content: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleImageUpload = async (file, fieldName, itemIndex = null) => {
    console.log('Image upload started:', { file: file.name, size: file.size, fieldName, itemIndex });
    
    if (!file) {
      console.log('No file provided');
      return;
    }
    
    // Check file size (limit to 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB before compression");
      return;
    }
    
    const uploadKey = `${fieldName}-${itemIndex || 'main'}`;
    console.log('Setting uploading state for:', uploadKey);
    setUploadingImage(uploadKey);
    
    try {
      // Compress image with enhanced quality
      console.log('Starting image compression...');
      const compressedFile = await compressImage(file);
      console.log('Compression completed, compressed file size:', compressedFile.size);
      
      // Check if compressed file is still too large
      if (compressedFile.size > 5 * 1024 * 1024) {
        toast.error("Compressed image is still too large. Please use a smaller image.");
        setUploadingImage(null);
        return;
      }
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        console.log('File converted to base64, length:', imageUrl.length);
        
        // Check if base64 is too large (should be under 10MB after compression)
        if (imageUrl.length > 10 * 1024 * 1024) {
          toast.error("Compressed image is still too large. Please use a smaller image.");
          setUploadingImage(null);
          return;
        }
        
        if (itemIndex !== null) {
          console.log('Updating item image at index:', itemIndex);
          console.log('Current items before update:', formData.items);
          handleItemChange(itemIndex, fieldName, imageUrl);
          console.log('Items after update:', formData.items);
        } else {
          console.log('Updating main field:', fieldName);
          handleInputChange(fieldName, imageUrl);
          console.log('Form data after update:', formData);
        }
        
        setUploadingImage(null);
        
        // Show compression info
        const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
        toast.success(`Image uploaded successfully! Compressed by ${compressionRatio}%`);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setUploadingImage(null);
        toast.error("Error reading file");
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error in image upload:', error);
      setUploadingImage(null);
      toast.error("Error uploading image");
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      console.log('Starting compression for file:', file.name, 'original size:', file.size);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        console.log('Image loaded, dimensions:', img.width, 'x', img.height);
        
        // Calculate new dimensions (max 1200px width/height for better quality)
        let { width, height } = img;
        const maxSize = 1200;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        console.log('New dimensions:', width, 'x', height);
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress with better quality
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          console.log('Compression completed, blob size:', blob.size);
          console.log('Compression ratio:', ((file.size - blob.size) / file.size * 100).toFixed(2) + '%');
          resolve(blob);
        }, 'image/jpeg', 0.85); // 85% quality for better visibility
      };
      
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        resolve(file); // Return original file if compression fails
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const compressVideo = async (file) => {
    return new Promise((resolve) => {
      console.log('Starting video compression for file:', file.name, 'original size:', file.size);
      
      // Check if file is already small enough
      if (file.size <= 10 * 1024 * 1024) { // 10MB threshold
        console.log('Video is already small enough, skipping compression');
        resolve(file);
        return;
      }
      
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        console.log('Video loaded, dimensions:', video.videoWidth, 'x', video.videoHeight, 'duration:', video.duration);
        
        // Calculate new dimensions (max 800px width/height)
        let { width, height } = video;
        const maxSize = 800;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        console.log('New video dimensions:', width, 'x', height);
        
        canvas.width = width;
        canvas.height = height;
        
        video.currentTime = 0; // Start from beginning
        
        video.onseeked = () => {
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, width, height);
          
          // Convert to blob with reduced quality
          canvas.toBlob((blob) => {
            console.log('Video compression completed, blob size:', blob.size);
            console.log('Compression ratio:', ((file.size - blob.size) / file.size * 100).toFixed(2) + '%');
            
            // Create a new file with compressed data
            const compressedFile = new File([blob], file.name, {
              type: 'video/mp4',
              lastModified: Date.now()
            });
            
            resolve(compressedFile);
          }, 'video/mp4', 0.7); // 70% quality for video
        };
      };
      
      video.onerror = (error) => {
        console.error('Error loading video:', error);
        resolve(file); // Return original file if compression fails
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('video/')) {
      toast.error("Please select a video file");
      return;
    }
    
    // Check file size (limit to 50MB before compression)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video size must be less than 50MB before compression");
      return;
    }
    
    setUploadingImage('video-main');
    
    try {
      // Compress video if needed
      console.log('Starting video compression...');
      const compressedFile = await compressVideo(file);
      console.log('Video compression completed, compressed file size:', compressedFile.size);
      
      // Check if compressed file is still too large
      if (compressedFile.size > 20 * 1024 * 1024) {
        toast.error("Compressed video is still too large. Please use a smaller video or video URL.");
        setUploadingImage(null);
        return;
      }
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const videoUrl = e.target.result;
        console.log('Video converted to base64, length:', videoUrl.length);
        
        // Check if base64 is too large (should be under 40MB after compression)
        if (videoUrl.length > 40 * 1024 * 1024) {
          toast.error("Compressed video is still too large. Please use a smaller video or video URL.");
          setUploadingImage(null);
          return;
        }
        
        handleInputChange('videoFile', videoUrl);
        setUploadingImage(null);
        
        // Show compression info
        const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
        toast.success(`Video uploaded successfully! Compressed by ${compressionRatio}%`);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setUploadingImage(null);
        toast.error("Error reading video file");
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error in video upload:', error);
      setUploadingImage(null);
      toast.error("Error uploading video");
    }
  };

  const triggerVideoInput = () => {
    const videoInput = fileInputRefs.current['video-main'];
    if (videoInput) {
      console.log('Found video input ref, clicking...');
      videoInput.click();
    } else {
      console.error('Video input ref not found');
      // Create a new file input on the fly
      const newInput = document.createElement('input');
      newInput.type = 'file';
      newInput.accept = 'video/*';
      newInput.onchange = (e) => {
        if (e.target.files[0]) {
          handleVideoUpload(e.target.files[0]);
        }
      };
      newInput.click();
    }
  };

  const triggerFileInput = (fieldName, itemIndex = null) => {
    const key = `${fieldName}-${itemIndex || 'main'}`;
    console.log('Triggering file input for key:', key);
    
    // Direct approach - use the ref directly
    const fileInput = fileInputRefs.current[key];
    if (fileInput) {
      console.log('Found file input ref, clicking...');
      fileInput.click();
    } else {
      console.error('File input ref not found for key:', key);
      // Create a new file input on the fly
      const newInput = document.createElement('input');
      newInput.type = 'file';
      newInput.accept = 'image/*';
      newInput.onchange = (e) => {
        if (e.target.files[0]) {
          handleImageUpload(e.target.files[0], fieldName, itemIndex);
        }
      };
      newInput.click();
    }
  };

  const getCurrentSectionConfig = () => {
    const page = pages.find(p => p.key === selectedPage);
    return page?.sections.find(s => s.key === selectedSection);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        title: "",
        description: "",
        image: "",
        link: "",
        order: prev.items.length
      }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex">
        <SidebarNoAuth />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SidebarNoAuth />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Manage website static content and pages</p>
        </div>

        {/* Page and Section Selector */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <button
                  key={page.key}
                  onClick={() => {
                    setSelectedPage(page.key);
                    setSelectedSection(page.sections[0]?.key || "main");
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPage === page.key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    selectedPage === page.key ? "text-blue-600" : "text-gray-400"
                  }`} />
                  <div className={`text-sm font-medium ${
                    selectedPage === page.key ? "text-blue-600" : "text-gray-700"
                  }`}>
                    {page.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section Selector */}
          {pages.find(p => p.key === selectedPage)?.sections && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Section</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {pages.find(p => p.key === selectedPage).sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => setSelectedSection(section.key)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      selectedSection === section.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setEditing(!editing)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                editing
                  ? "bg-gray-600 text-white hover:bg-gray-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {editing ? <FiSave className="w-4 h-4" /> : <FiEdit2 className="w-4 h-4" />}
              <span>{editing ? "Cancel" : "Edit"}</span>
            </button>
            
            {editing && (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                >
                  <FiSave className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setLivePreview(!livePreview)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                livePreview
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FiEye className="w-4 h-4" />
              <span>{livePreview ? "Live Preview On" : "Live Preview"}</span>
            </button>
            
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                previewMode
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FiEye className="w-4 h-4" />
              <span>{previewMode ? "Exit Preview" : "Preview"}</span>
            </button>
            
            {!editing && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center space-x-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span>Reset Section</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div>
              {editing ? (
                <DynamicFieldEditor 
                  sectionConfig={getCurrentSectionConfig()}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleItemChange={handleItemChange}
                  addItem={addItem}
                  removeItem={removeItem}
                  handleImageUpload={handleImageUpload}
                  handleVideoUpload={handleVideoUpload}
                  triggerFileInput={triggerFileInput}
                  triggerVideoInput={triggerVideoInput}
                  uploadingImage={uploadingImage}
                  fileInputRefs={fileInputRefs}
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <p className="text-sm text-gray-900 mt-1">{formData.title || "No title"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                        formData.isPublished !== false
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {formData.isPublished !== false ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {formData.subtitle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                      <p className="text-sm text-gray-900 mt-1">{formData.subtitle}</p>
                    </div>
                  )}

                  {formData.content && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <p className="text-sm text-gray-900 mt-1 max-h-32 overflow-y-auto">{formData.content}</p>
                    </div>
                  )}

                  {formData.items?.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Items ({formData.items.length})
                      </label>
                      <div className="space-y-2">
                        {formData.items.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{item.title || "Untitled Item"}</h4>
                                <p className="text-xs text-gray-500 mt-1">{item.link || "No link"}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Preview */}
            {(livePreview || previewMode) && (
              <div>
                <LivePreview 
                  sectionConfig={getCurrentSectionConfig()}
                  formData={formData}
                  isLivePreview={livePreview}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dynamic Field Editor Component
const DynamicFieldEditor = ({ 
  sectionConfig, 
  formData, 
  handleInputChange, 
  handleItemChange, 
  addItem, 
  removeItem, 
  handleImageUpload,
  handleVideoUpload,
  triggerFileInput, 
  triggerVideoInput,
  uploadingImage, 
  fileInputRefs 
}) => {
  if (!sectionConfig) return <div>Select a section to edit</div>;

  const renderField = (field) => {
    switch (field) {
      case 'title':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title"
            />
          </div>
        );

      case 'subtitle':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle || ""}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subtitle"
            />
          </div>
        );

      case 'content':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={formData.content || ""}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter content"
            />
          </div>
        );

      case 'buttonText':
      case 'buttonLink':
        return (
          <div key={field} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={formData.buttonText || ""}
                onChange={(e) => handleInputChange("buttonText", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
              <input
                type="text"
                value={formData.buttonLink || ""}
                onChange={(e) => handleInputChange("buttonLink", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/products"
              />
            </div>
          </div>
        );

      case 'backgroundImage':
      case 'imageUrl':
        const imageField = field;
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field === 'backgroundImage' ? 'Background Image' : 'Image'}
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], imageField)}
                ref={(el) => fileInputRefs.current[`${imageField}-main`] = el}
                className="hidden"
              />
              <button
                onClick={() => triggerFileInput(imageField)}
                disabled={uploadingImage === `${imageField}-main`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {uploadingImage === `${imageField}-main` ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <FiUpload className="w-4 h-4" />
                )}
                <span>{uploadingImage === `${imageField}-main` ? 'Uploading...' : 'Upload Image (Max 10MB)'}</span>
              </button>
              {formData[imageField] && (
                <div className="mt-2">
                  <img src={formData[imageField]} alt="Preview" className="w-full h-32 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        );

      case 'videoFile':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>
            <div className="space-y-3">
              {/* Video Upload */}
              <div>
                <input
                  type="file"
                  accept="video/*"
                  ref={(el) => fileInputRefs.current['video-main'] = el}
                  className="hidden"
                  onChange={(e) => e.target.files[0] && handleVideoUpload(e.target.files[0])}
                />
                <button
                  onClick={triggerVideoInput}
                  disabled={uploadingImage === 'video-main'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {uploadingImage === 'video-main' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <FiUpload className="w-4 h-4" />
                  )}
                  <span>{uploadingImage === 'video-main' ? 'Uploading...' : 'Upload Video (Max 50MB)'}</span>
                </button>
              </div>
              
              {/* Video Preview */}
              {formData.videoFile && (
                <div className="mt-2">
                  <video 
                    src={formData.videoFile} 
                    controls 
                    className="w-full h-32 object-cover rounded"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              
              {/* OR Video URL Option */}
              <div className="text-center text-sm text-gray-500">OR</div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Video URL (YouTube/Vimeo)</label>
                <input
                  type="text"
                  value={formData.videoUrl || ""}
                  onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">Enter YouTube or Vimeo video URL</p>
              </div>
            </div>
          </div>
        );

      case 'items':
        return (
          <div key={field}>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">Items</label>
              <button
                onClick={addItem}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
            <div className="space-y-4">
              {formData.items?.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => handleItemChange(index, "title", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Item title"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Link</label>
                      <input
                        type="text"
                        value={item.link || ""}
                        onChange={(e) => handleItemChange(index, "link", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="/category/example"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Item description"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], "image", index)}
                      ref={(el) => fileInputRefs.current[`image-${index}`] = el}
                      className="hidden"
                    />
                    <button
                      onClick={() => triggerFileInput("image", index)}
                      disabled={uploadingImage === `image-${index}`}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center space-x-1"
                    >
                      {uploadingImage === `image-${index}` ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      ) : (
                        <FiUpload className="w-3 h-3" />
                      )}
                      <span>{uploadingImage === `image-${index}` ? 'Uploading...' : 'Upload Image'}</span>
                    </button>
                    {item.image && (
                      <img src={item.image} alt="Preview" className="mt-2 w-full h-20 object-cover rounded" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {sectionConfig.fields.map(renderField)}
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished !== false}
          onChange={(e) => handleInputChange("isPublished", e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
          Published (visible on website)
        </label>
      </div>
    </div>
  );
};

// Live Preview Component
const LivePreview = ({ sectionConfig, formData, isLivePreview }) => {
  if (!sectionConfig) return <div>Select a section to preview</div>;

  const renderPreview = () => {
    switch (sectionConfig.type) {
      case 'hero':
        return (
          <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Hero Preview</h3>
            {formData.backgroundImage && (
              <div className="mb-4">
                <img src={formData.backgroundImage} alt="Background" className="w-full h-32 object-cover rounded" />
              </div>
            )}
            <h4 className="text-xl font-bold text-gray-900">{formData.title || "Hero Title"}</h4>
            {formData.subtitle && <p className="text-gray-600">{formData.subtitle}</p>}
            <p className="text-gray-700 mt-2">{formData.content || "Hero content"}</p>
            {formData.buttonText && (
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
                {formData.buttonText}
              </button>
            )}
          </div>
        );

      case 'logos':
        return (
          <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Logos Preview</h3>
            <h4 className="text-xl font-bold text-gray-900 mb-4">{formData.title || "As Seen In"}</h4>
            <div className="flex flex-wrap gap-4">
              {formData.items?.map((item, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <span className="text-sm font-medium">{item.title || `Logo ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Grid Preview</h3>
            <h4 className="text-xl font-bold text-gray-900 mb-4">{formData.title || "Collection"}</h4>
            <div className="grid grid-cols-2 gap-3">
              {formData.items?.map((item, index) => (
                <div key={index} className="bg-white rounded border p-3">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-full h-16 object-cover rounded mb-2" />
                  )}
                  <h5 className="text-sm font-medium">{item.title || `Item ${index + 1}`}</h5>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Preview</h3>
            <h4 className="text-xl font-bold text-gray-900">{formData.title || "Title"}</h4>
            {formData.subtitle && <p className="text-gray-600">{formData.subtitle}</p>}
            <p className="text-gray-700 mt-2">{formData.content || "Content"}</p>
            {formData.items?.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">Items:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {formData.items.map((item, index) => (
                    <li key={index}>{item.title || `Item ${index + 1}`}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`${isLivePreview ? 'sticky top-4' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {isLivePreview ? '🔴 Live Preview' : 'Preview'}
        </h3>
        {isLivePreview && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        )}
      </div>
      {renderPreview()}
    </div>
  );
};
