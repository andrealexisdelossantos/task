const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const controller = require('../controllers/userController');

router.get('/:userId/tasks', authMiddleware, controller.getTasksByUser);

module.exports = router;