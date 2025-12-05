const validateTask = (req, res, next) => {
  try {
    const { title, status, dueDate } = req.body;

    // Validate title - required, non-empty string
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'title is required'
      });
    }

    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'title must be a non-empty string'
      });
    }

    // Validate status - must be one of allowed values
    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'status must be one of: pending, in-progress, completed'
      });
    }

    // Validate dueDate - must be valid date if provided
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'dueDate must be a valid ISO 8601 date string'
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: err.message
    });
  }
};

module.exports = validateTask;