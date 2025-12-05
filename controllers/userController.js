const Task = require('../models/task');
const User = require('../models/user');

const getTasksByUser = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format',
        message: 'Please provide a valid user ID' 
      });
    }
    
    // Check if user exists
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found',
        message: 'The specified user does not exist' 
      });
    }
    
    const tasks = await Task.find({ assignedTo: req.params.userId }).populate('assignedTo', 'name email');
    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (err) { next(err); }
};

module.exports = { getTasksByUser };