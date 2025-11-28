const express = require('express');
const router = express.Router();

const validateTask = require('../middlewares/validateTask');
const authMiddleware = require('../middlewares/authMiddleware');
const controller = require('../controllers/taskController');

// Advanced features - Filter and search
router.get('/status/:status', controller.filterByStatus);
router.get('/search/title', controller.searchByTitle);

// Core CRUD Routes
router.get('/', controller.getAllTasks);
router.get('/:id', controller.getTaskById);
router.post('/', authMiddleware, validateTask, controller.createTask);
router.put('/:id', authMiddleware, validateTask, controller.updateTask);
router.patch('/:id', authMiddleware, controller.patchTask);
router.delete('/:id', authMiddleware, controller.deleteTask);

// Progress and completion routes
router.put('/:id/complete', authMiddleware, controller.markComplete);
router.put('/:id/progress', authMiddleware, controller.updateProgress);

// Assignment routes
router.post('/:id/assign', authMiddleware, controller.assignTask);

module.exports = router;