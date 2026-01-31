const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Get content by page key
exports.getContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    
    const { data: content, error } = await supabase
      .from('content')
      .select('*')
      .eq('pageKey', pageKey)
      .single();

    if (error || !content) {
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

    res.json({ content });
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

    // First check if content exists
    const { data: existingContent } = await supabase
      .from('content')
      .select('id')
      .eq('pageKey', pageKey)
      .single();

    let result;
    
    if (existingContent) {
      // Update existing content
      const { data, error } = await supabase
        .from('content')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('pageKey', pageKey)
        .select()
        .single();
      
      result = { data, error };
    } else {
      // Create new content
      const { data, error } = await supabase
        .from('content')
        .insert({
          pageKey,
          ...updates,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();
      
      result = { data, error };
    }

    if (result.error) {
      console.error('Error updating content:', result.error);
      return res.status(500).json({ error: result.error.message });
    }

    res.json({
      message: "Content updated successfully",
      content: result.data,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: error.message });
  }
};
