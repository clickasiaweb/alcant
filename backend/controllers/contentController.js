const SupabaseContent = require("../models/SupabaseContent");

// Get content by page key
exports.getContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    
    let content = await SupabaseContent.findOne({ pageKey });

    if (!content) {
      // Create default content if none exists
      const defaultContent = {
        pageKey,
        title: "",
        subtitle: "",
        content: "",
        buttonText: "",
        buttonLink: "",
        backgroundImage: "",
        imageUrl: "",
        videoUrl: "",
        videoFile: "",
        items: [],
        sections: [],
        metadata: {},
        bannerImage: "",
        isPublished: true,
      };
      
      content = await SupabaseContent.create(defaultContent);
    }

    // Convert snake_case to camelCase for frontend
    const frontendContent = {
      pageKey: content.page_key,
      title: content.title,
      subtitle: content.subtitle,
      content: content.content,
      buttonText: content.button_text,
      buttonLink: content.button_link,
      backgroundImage: content.background_image,
      imageUrl: content.image_url,
      videoUrl: content.video_url,
      videoFile: content.video_file,
      items: content.items,
      sections: content.sections,
      metadata: content.metadata,
      bannerImage: content.banner_image,
      isPublished: content.is_published,
      createdAt: content.created_at,
      updatedAt: content.updated_at,
    };

    res.json({ content: frontendContent });
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update content (Admin)
exports.updateContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const updates = req.body;

    console.log('Updating content for:', pageKey, 'with data keys:', Object.keys(updates));

    // Find existing content or create new
    let content = await SupabaseContent.findOne({ pageKey });
    
    if (content) {
      // Update existing content
      content = await SupabaseContent.findByIdAndUpdate(pageKey, updates);
    } else {
      // Create new content
      const newContent = {
        pageKey,
        ...updates,
        isPublished: updates.isPublished !== undefined ? updates.isPublished : true,
      };
      content = await SupabaseContent.create(newContent);
    }

    // Convert snake_case to camelCase for frontend response
    const frontendContent = {
      pageKey: content.page_key,
      title: content.title,
      subtitle: content.subtitle,
      content: content.content,
      buttonText: content.button_text,
      buttonLink: content.button_link,
      backgroundImage: content.background_image,
      imageUrl: content.image_url,
      videoUrl: content.video_url,
      videoFile: content.video_file,
      items: content.items,
      sections: content.sections,
      metadata: content.metadata,
      bannerImage: content.banner_image,
      isPublished: content.is_published,
      createdAt: content.created_at,
      updatedAt: content.updated_at,
    };

    console.log('Content updated successfully for page:', pageKey);

    res.json({
      message: "Content updated successfully",
      content: frontendContent,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: error.message });
  }
};
