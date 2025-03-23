import { Router } from 'express';
import { getQuestions, submitAnswer } from '../controllers/practice';
import { isAuth } from '../middleware/auth';

const router = Router();

router.get('/questions', isAuth, getQuestions);
router.post('/submit', isAuth, submitAnswer);

export default router;