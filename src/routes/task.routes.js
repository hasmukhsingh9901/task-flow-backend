import { Router } from "express";


const router = Router();

import { fetchAllTasks, removeTask, task, tasks } from "../controllers/task.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

router.get('/tasks', authMiddleware, fetchAllTasks);
router.delete('/tasks/:taskId', authMiddleware, removeTask);
router.get('/tasks/:taskId', authMiddleware, task);
router.post('/tasks', authMiddleware, tasks);

export default router;