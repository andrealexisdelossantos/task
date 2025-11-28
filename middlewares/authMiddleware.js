const authMiddleware = (req, res, next) => {
  try {
    const apiKey = req.header('x-api-key');
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'API key is required. Include x-api-key header.'
      });
    }
    
    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }
    
    next();
  } catch (err) {
    res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  }
};

module.exports = authMiddleware;