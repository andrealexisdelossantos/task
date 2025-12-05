const Task = require('../models/task');
const User = require('../models/user');


const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json({ success: true, data: tasks });
  } catch (err) { next(err); }
};

const getTaskById = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format',
        message: 'Please provide a valid task ID' 
      });
    }
    
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const createTask = async (req, res, next) => {
  try {
    // Set completed status based on status field
    const taskData = { ...req.body };
    if (taskData.status === 'completed') {
      taskData.completed = true;
    } else if (!taskData.completed) {
      taskData.completed = false;
    }
    
    const task = await Task.create(taskData);
    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
    res.status(201).json({ success: true, data: populatedTask });
  } catch (err) { next(err); }
};

const patchTask = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format',
        message: 'Please provide a valid task ID' 
      });
    }
    
    // Only update provided fields (partial update)
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.status !== undefined) {
      // Validate status if provided
      if (!['pending', 'in-progress', 'completed'].includes(req.body.status)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Validation error',
          message: 'status must be one of: pending, in-progress, completed' 
        });
      }
      updateData.status = req.body.status;
    }
    if (req.body.completed !== undefined) updateData.completed = req.body.completed;
    if (req.body.dueDate !== undefined) updateData.dueDate = req.body.dueDate;
    if (req.body.assignedTo !== undefined) updateData.assignedTo = req.body.assignedTo;
    
    // Update completed status based on status field
    if (updateData.status === 'completed') {
      updateData.completed = true;
    } else if (updateData.status && updateData.status !== 'completed') {
      updateData.completed = false;
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format',
        message: 'Please provide a valid task ID' 
      });
    }
    
    // Update completed status based on status field
    if (req.body.status === 'completed') {
      req.body.completed = true;
    } else if (req.body.status && req.body.status !== 'completed') {
      req.body.completed = false;
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format',
        message: 'Please provide a valid task ID' 
      });
    }
    
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) { next(err); }
};

const markComplete = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format',
        message: 'Please provide a valid task ID' 
      });
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      { status: 'completed', completed: true }, 
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const updateProgress = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format',
        message: 'Please provide a valid task ID' 
      });
    }
    
    // Validate status
    if (!req.body.status || !['pending', 'in-progress', 'completed'].includes(req.body.status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error',
        message: 'status must be one of: pending, in-progress, completed' 
      });
    }
    
    const updateData = { status: req.body.status };
    if (req.body.status === 'completed') {
      updateData.completed = true;
    } else {
      updateData.completed = false;
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const filterByStatus = async (req, res, next) => {
  try {
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(req.params.status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error',
        message: 'status must be one of: pending, in-progress, completed' 
      });
    }
    
    const tasks = await Task.find({ status: req.params.status }).populate('assignedTo', 'name email');
    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (err) { next(err); }
};

const searchByTitle = async (req, res, next) => {
  try {
    if (!req.query.q || req.query.q.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error',
        message: 'Query parameter "q" is required' 
      });
    }
    
    const regex = new RegExp(req.query.q.trim(), 'i');
    const tasks = await Task.find({ title: regex }).populate('assignedTo', 'name email');
    res.json({ success: true, data: tasks, count: tasks.length, query: req.query.q });
  } catch (err) { next(err); }
};

const assignTask = async (req, res, next) => {
  try {
    // Validate ObjectId format for task
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format',
        message: 'Please provide a valid task ID' 
      });
    }
    
    // Validate userId
    if (!req.body.userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error',
        message: 'userId is required' 
      });
    }
    
    if (!req.body.userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format',
        message: 'Please provide a valid user ID' 
      });
    }
    
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      { assignedTo: user._id }, 
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(200).json({ success: true, data: task });
  } catch (err) { next(err); }
};

module.exports = {
  getAllTasks, getTaskById, createTask, updateTask, patchTask, deleteTask,
  markComplete, updateProgress, filterByStatus, searchByTitle, assignTask
};