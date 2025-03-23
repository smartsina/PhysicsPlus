import { Router } from 'express';
import { submitExamAnswer } from '../controllers/exam';
import { isAuth } from '../middleware/auth';

const router = Router();

router.post('/submit-answer', isAuth, submitExamAnswer);

export default router;