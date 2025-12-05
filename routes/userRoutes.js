const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');


router.get('/:userId/tasks', controller.getTasksByUser);

module.exports = router;

/**
 * @swagger
 * /api/v1/users/{userId}/tasks:
 *   get:
 *     summary: Get all tasks assigned to a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: '507f1f77bcf86cd799439012'
 *     responses:
 *       200:
 *         description: User's tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 count:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Invalid user ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
