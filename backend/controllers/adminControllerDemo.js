const { getProducts, createProduct, updateProduct, deleteProduct } = require('./productController');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('./categoryController');
const { getInquiries, updateInquiry } = require('./inquiryController');

// Demo admin controller without authentication
const getDashboardSummary = async (req, res) => {
  try {
    // Mock dashboard data for demo
    const mockData = {
      kpis: {
        totalProducts: 12,
        activeCategories: 5,
        pendingInquiries: 3
      },
      recentActivity: {
        recentProducts: [
          {
            _id: '1',
            name: 'iPhone 15 Pro Case',
            category: 'Phone Cases',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2', 
            name: 'MacBook Air Sleeve',
            category: 'Laptop Accessories',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        recentInquiries: [
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Bulk Order Inquiry',
            status: 'new',
            createdAt: new Date().toISOString()
          }
        ]
      }
    };
    
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    // Use existing product controller but bypass auth
    req.query = req.query || {};
    const result = await getProducts(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminCategories = async (req, res) => {
  try {
    // Mock categories data for demo
    const mockCategories = [
      {
        _id: '1',
        name: 'Phone Cases',
        slug: 'phone-cases',
        description: 'Protective cases for smartphones',
        icon: 'phone',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Laptop Accessories',
        slug: 'laptop-accessories',
        description: 'Accessories for laptops',
        icon: 'laptop',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    
    res.json({ categories: mockCategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAdminCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, isActive } = req.body;
    
    // Mock category creation
    const newCategory = {
      _id: Date.now().toString(),
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      icon: icon || 'folder',
      isActive: isActive !== false,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAdminCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Mock category update
    const updatedCategory = {
      _id: id,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock category deletion
    res.json({ message: 'Category deleted successfully', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Mock product status update
    res.json({ 
      message: 'Product status updated successfully',
      id,
      status 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getAdminProducts,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteCategory,
  updateProductStatus
};
