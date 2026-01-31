const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000"
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data storage
let categories = [
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

let products = [
  {
    _id: '1',
    name: 'iPhone 15 Pro Case',
    slug: 'iphone-15-pro-case',
    category: 'Phone Cases',
    price: 29.99,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

let inquiries = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Bulk Order Inquiry',
    message: 'I would like to place a bulk order',
    status: 'new',
    createdAt: new Date().toISOString()
  }
];

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Demo Server is running",
    timestamp: new Date().toISOString()
  });
});

// Admin Dashboard Summary
app.get("/api/admin/dashboard-summary", (req, res) => {
  res.json({
    kpis: {
      totalProducts: products.length,
      activeCategories: categories.filter(c => c.isActive).length,
      pendingInquiries: inquiries.filter(i => i.status === 'new').length
    },
    recentActivity: {
      recentProducts: products.slice(0, 5),
      recentInquiries: inquiries.slice(0, 5)
    }
  });
});

// Admin Categories
app.get("/api/admin/categories", (req, res) => {
  res.json({ categories });
});

app.post("/api/admin/categories", (req, res) => {
  const { name, slug, description, icon, isActive } = req.body;
  
  const newCategory = {
    _id: Date.now().toString(),
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description,
    icon: icon || 'folder',
    isActive: isActive !== false,
    createdAt: new Date().toISOString()
  };
  
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.put("/api/admin/categories/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const index = categories.findIndex(c => c._id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  categories[index] = { ...categories[index], ...updateData, updatedAt: new Date().toISOString() };
  res.json(categories[index]);
});

app.delete("/api/admin/categories/:id", (req, res) => {
  const { id } = req.params;
  
  const index = categories.findIndex(c => c._id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  categories.splice(index, 1);
  res.json({ message: 'Category deleted successfully', id });
});

// Admin Products
app.get("/api/admin/products", (req, res) => {
  res.json({ products });
});

app.patch("/api/admin/product/status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const index = products.findIndex(p => p._id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products[index].isActive = status;
  products[index].updatedAt = new Date().toISOString();
  
  res.json({ 
    message: 'Product status updated successfully',
    id,
    status 
  });
});

// Admin Inquiries
app.get("/api/admin/inquiries", (req, res) => {
  res.json({ inquiries });
});

app.patch("/api/admin/inquiries/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const index = inquiries.findIndex(i => i._id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  
  inquiries[index].status = status;
  inquiries[index].updatedAt = new Date().toISOString();
  
  res.json({ 
    message: 'Inquiry status updated successfully',
    id,
    status 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Demo Server running on port ${PORT}`);
  console.log(`📊 Admin API available at http://localhost:${PORT}/api/admin`);
});

module.exports = app;
