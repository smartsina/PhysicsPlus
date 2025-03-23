import { Router } from 'express';
import {
  getDashboardStats,
  getWeakTopics,
  getRecentActivity,
} from '../controllers/dashboard';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/weak-topics', getWeakTopics);
router.get('/recent-activity', getRecentActivity);

export default router;
