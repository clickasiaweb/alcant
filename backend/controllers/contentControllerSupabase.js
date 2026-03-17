const { createClient } = require('@supabase/supabase-js');

// Debug environment variables
console.log('🔑 Environment check in controller:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'MISSING',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
});

// Use service client for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

// Get content by page key
exports.getContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    console.log('🏠 Supabase Controller: Getting content for pageKey:', pageKey);
    
    const { data: content, error } = await supabase
      .from('content')
      .select('*')
      .eq('page_key', pageKey)
      .single();

    console.log('🏠 Supabase Controller: Database query result:', { content, error });

    if (error || !content) {
      console.log('🏠 Supabase Controller: No content found, returning empty structure');
      // Return empty content structure instead of 404
      return res.json({ 
        content: {
          title: "",
          subtitle: "",
          content: "",
          buttonText: "",
          buttonLink: "",
          backgroundImage: "",
          imageUrl: "",
          items: [],
          sections: [],
          metadata: {},
          bannerImage: "",
          isPublished: true,
        }
      });
    }

    // Convert snake_case to camelCase for frontend
    const camelCaseContent = {
      id: content.id,
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
      updatedAt: content.updated_at
    };

    console.log('🏠 Supabase Controller: Found content:', camelCaseContent);
    res.json({ content: camelCaseContent });
  } catch (error) {
    console.error('🏠 Supabase Controller: Error getting content:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update content (Admin)
exports.updateContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const updates = req.body;

    // Convert camelCase to snake_case for database
    const snakeCaseUpdates = {
      title: updates.title,
      subtitle: updates.subtitle,
      content: updates.content,
      button_text: updates.buttonText,
      button_link: updates.buttonLink,
      background_image: updates.backgroundImage,
      image_url: updates.imageUrl,
      video_url: updates.videoUrl,
      video_file: updates.videoFile,
      items: updates.items,
      sections: updates.sections,
      metadata: updates.metadata,
      banner_image: updates.bannerImage,
      is_published: updates.isPublished,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(snakeCaseUpdates).forEach(key => {
      if (snakeCaseUpdates[key] === undefined) {
        delete snakeCaseUpdates[key];
      }
    });

    console.log('🏠 Supabase Controller: Updating content with:', snakeCaseUpdates);

    // First check if content exists
    const { data: existingContent, error: checkError } = await supabase
      .from('content')
      .select('id')
      .eq('page_key', pageKey)
      .single();

    console.log('🏠 Supabase Controller: Existing content check:', { existingContent, checkError });

    let result;
    
    if (existingContent && !checkError) {
      console.log('🏠 Supabase Controller: Updating existing content');
      // Update existing content - use simple update approach
      const updateData = {
        ...snakeCaseUpdates,
        id: existingContent.id
      };
      
      const { data, error } = await supabase
        .from('content')
        .update(snakeCaseUpdates)
        .eq('id', existingContent.id)
        .select()
        .single();
      
      console.log('🏠 Supabase Controller: Update result:', { data: data?.id, error });
      result = { data, error };
    } else {
      console.log('🏠 Supabase Controller: Creating new content');
      // Create new content
      snakeCaseUpdates.page_key = pageKey;
      snakeCaseUpdates.created_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('content')
        .insert(snakeCaseUpdates)
        .select()
        .single();
      
      result = { data, error };
    }

    if (result.error) {
      console.error('Error updating content:', result.error);
      return res.status(500).json({ error: result.error.message });
    }

    if (!result.data) {
      console.error('No data returned from update operation');
      return res.status(500).json({ error: 'Failed to update content - no data returned' });
    }

    // Convert back to camelCase for response
    const camelCaseResponse = {
      id: result.data.id,
      pageKey: result.data.page_key,
      title: result.data.title,
      subtitle: result.data.subtitle,
      content: result.data.content,
      buttonText: result.data.button_text,
      buttonLink: result.data.button_link,
      backgroundImage: result.data.background_image,
      imageUrl: result.data.image_url,
      videoUrl: result.data.video_url,
      videoFile: result.data.video_file,
      items: result.data.items,
      sections: result.data.sections,
      metadata: result.data.metadata,
      bannerImage: result.data.banner_image,
      isPublished: result.data.is_published,
      createdAt: result.data.created_at,
      updatedAt: result.data.updated_at
    };

    res.json({
      message: "Content updated successfully",
      content: camelCaseResponse,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: error.message });
  }
};
