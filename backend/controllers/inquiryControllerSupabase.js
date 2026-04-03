const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Create inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { name, email, phone, company, subject, message, productId } = req.body;

    const inquiryData = {
      name,
      email,
      phone: phone || null,
      company: company || null,
      subject,
      message,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    // Store productId separately if needed (in memory or logs for now)
    if (productId) {
      console.log('Inquiry for product:', productId);
    }

    res.status(201).json({
      message: "Inquiry submitted successfully",
      data: data,
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all inquiries (Admin)
exports.getInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('inquiries')
      .select('*, products(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      data: data || [],
      pagination: {
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update inquiry status (Admin)
exports.updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    if (response) {
      updateData.response = response;
      updateData.responded_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select('*, products(name)')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    res.json({
      message: "Inquiry updated successfully",
      data: data,
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete inquiry (Admin)
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};
