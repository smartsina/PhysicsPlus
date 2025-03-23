import { Router } from 'express';
import authRoutes from './auth';
import examRoutes from './exam';
import practiceRoutes from './practice';
import dashboardRoutes from './dashboard';
import adminRoutes from './admin';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use('/auth', authRoutes);
router.use('/exam', authenticateJWT, examRoutes);
router.use('/practice', authenticateJWT, practiceRoutes);
router.use('/dashboard', authenticateJWT, dashboardRoutes);
router.use('/admin', authenticateJWT, adminRoutes);

export { router as routes };
