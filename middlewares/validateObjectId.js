/**
 * Middleware to validate MongoDB ObjectId format
 * @param {string} paramName - The name of the parameter to validate (default: 'id')
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameter',
        message: `${paramName} is required`
      });
    }
    
    // MongoDB ObjectId is 24 hex characters
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        message: `Please provide a valid ${paramName}`
      });
    }
    
    next();
  };
};

module.exports = validateObjectId;

