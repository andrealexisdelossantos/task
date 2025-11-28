const Task = require('../models/task');

const getTasksByUser = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId }).populate('assignedTo', 'name email');
    res.json({ success: true, data: tasks });
  } catch (err) { next(err); }
};

module.exports = { getTasksByUser };