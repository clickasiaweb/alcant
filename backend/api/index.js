const app = require('../server');

// Export for Vercel serverless
module.exports = async (req, res) => {
  app(req, res);
};
