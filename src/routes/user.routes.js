import express from 'express';
import { registerUser, loginUser, refreshToken, logoutUser, toggleUserRole } from '../controllers/user.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);
router.patch('/users/:userId/role', authMiddleware, adminMiddleware, toggleUserRole);

router.patch('/users/:userId/role', authMiddleware, adminMiddleware, toggleUserRole);
router.get('/user-logs', authMiddleware, adminMiddleware, getUserLogs);
router.delete('/user-logs/:logId', authMiddleware, adminMiddleware, deleteUserLog);

export default router;