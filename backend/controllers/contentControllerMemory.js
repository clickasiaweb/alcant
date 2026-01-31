// In-memory storage for testing (replace with real database later)
let contentStore = {};

// Get content by page key
exports.getContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    
    const content = contentStore[pageKey];

    if (!content) {
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
          videoUrl: "",
          videoFile: "",
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

    console.log('Updating content for:', pageKey, 'with data:', updates);

    // Update or create content
    contentStore[pageKey] = {
      ...contentStore[pageKey],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    console.log('Content updated successfully:', contentStore[pageKey]);

    res.json({
      message: "Content updated successfully",
      content: contentStore[pageKey],
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: error.message });
  }
};
