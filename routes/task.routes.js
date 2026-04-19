const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const dataValidator = require('../middleware/dataValidatorMiddleware');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { createTaskBodySchema, createTaskParamsSchema, taskRetrievalSchema, taskByIdRetrievalSchema, updateTaskBodySchema, updateTaskParamsSchema, deleteTaskSchema } = require('../schemas/task.schema');

const router = express.Router();

router.post('/projects/:projectId/tasks', authMiddleware, dataValidator({ body: createTaskBodySchema, params: createTaskParamsSchema }), createTask);
router.get('/projects/:projectId/tasks', authMiddleware, dataValidator({ params: taskRetrievalSchema }), getTasks);
router.get('/projects/:projectId/tasks/:taskId', authMiddleware, dataValidator({ params: taskByIdRetrievalSchema }), getTaskById);
router.patch('/projects/:projectId/tasks/:taskId', authMiddleware, dataValidator({ body: updateTaskBodySchema, params: updateTaskParamsSchema }), updateTask);
router.delete('/projects/:projectId/tasks/:taskId', authMiddleware, dataValidator({ params: deleteTaskSchema }), deleteTask);

module.exports = router;