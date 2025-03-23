import { Router } from 'express';
import {
  getPracticeQuestions,
  submitPracticeAnswer,
} from '../controllers/practice';

const router = Router();

router.get('/', getPracticeQuestions);
router.post('/:id/answer', submitPracticeAnswer);

export default router;
