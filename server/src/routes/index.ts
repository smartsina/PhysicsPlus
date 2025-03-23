import { Router } from 'express';
import { isAuth } from '../middleware/auth';
import authRoutes from './auth';
import examRoutes from './exam';
import practiceRoutes from './practice';
import dashboardRoutes from './dashboard';
import adminRoutes from './admin';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/exam', isAuth, examRoutes);
router.use('/practice', isAuth, practiceRoutes);
router.use('/dashboard', isAuth, dashboardRoutes);
router.use('/admin', adminRoutes); // Admin routes have their own auth checks

export default router;