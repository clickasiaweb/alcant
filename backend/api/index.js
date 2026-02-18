const app = require('../server');

// Export for Vercel serverless functions
module.exports = (req, res) => {
  app(req, res);
};
