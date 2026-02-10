const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/out')));

// API Routes
app.use('/api', require('./routes'));

// Serve frontend for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/out/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend not built. Please run: cd frontend && npm run build');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Alcant Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});
