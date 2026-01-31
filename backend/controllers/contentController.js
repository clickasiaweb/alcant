const Content = require("../models/Content");

// Get content by page key
exports.getContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const content = await Content.findOne({ pageKey });

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
          items: [],
          sections: [],
          metadata: {},
          bannerImage: "",
          isPublished: true,
        }
      });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update content (Admin)
exports.updateContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const updates = req.body;

    let content = await Content.findOne({ pageKey });

    if (!content) {
      content = new Content({ pageKey, ...updates });
    } else {
      Object.assign(content, updates);
    }

    await content.save();

    res.json({
      message: "Content updated successfully",
      data: content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
