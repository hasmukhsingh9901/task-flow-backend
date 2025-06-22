import express from 'express';
import { fetchAllTasks, removeTask, updateTask, createTask } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get('/tasks', authMiddleware, fetchAllTasks);
router.post('/tasks', authMiddleware, createTask);
router.put('/tasks/:taskId', authMiddleware, updateTask);
router.delete('/tasks/:taskId', authMiddleware, removeTask);

export default router;