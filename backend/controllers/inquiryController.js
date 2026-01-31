const Inquiry = require("../models/Inquiry");

// Create inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { name, email, phone, company, subject, message, productId } =
      req.body;

    const inquiry = new Inquiry({
      name,
      email,
      phone,
      company,
      subject,
      message,
      productId,
    });

    await inquiry.save();
    res.status(201).json({
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all inquiries (Admin)
exports.getInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const inquiries = await Inquiry.find(query)
      .populate("productId", "name")
      .populate("respondedBy", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Inquiry.countDocuments(query);

    res.json({
      data: inquiries,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update inquiry status (Admin)
exports.updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      {
        status,
        response,
        respondedBy: req.user.userId,
        respondedAt: new Date(),
      },
      { new: true },
    ).populate("productId", "name");

    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    res.json({
      message: "Inquiry updated successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete inquiry (Admin)
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
