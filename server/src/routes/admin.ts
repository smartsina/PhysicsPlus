import { Router } from 'express';
import {
  getUsers,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/admin';
import { isAuth, isAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require both authentication and admin role
router.use(isAuth, isAdmin);

// User management
router.get('/users', getUsers);

// Question management
router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;