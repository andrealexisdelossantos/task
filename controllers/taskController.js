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
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
};

const patchTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
};

const markComplete = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const updateProgress = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const filterByStatus = async (req, res, next) => {
  try {
    const tasks = await Task.find({ status: req.params.status }).populate('assignedTo', 'name email');
    res.json({ success: true, data: tasks });
  } catch (err) { next(err); }
};

const searchByTitle = async (req, res, next) => {
  try {
    const regex = new RegExp(req.query.q, 'i');
    const tasks = await Task.find({ title: regex }).populate('assignedTo', 'name email');
    res.json({ success: true, data: tasks });
  } catch (err) { next(err); }
};

const assignTask = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const task = await Task.findByIdAndUpdate(req.params.id, { assignedTo: user._id }, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
};

module.exports = {
  getAllTasks, getTaskById, createTask, updateTask, patchTask, deleteTask,
  markComplete, updateProgress, filterByStatus, searchByTitle, assignTask
};