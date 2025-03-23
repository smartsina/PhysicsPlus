import { Router } from 'express';
import {
  getExam,
  submitExam,
  getExamResult,
  listExams,
} from '../controllers/exam';

const router = Router();

router.get('/', listExams);
router.get('/:id', getExam);
router.post('/:id/submit', submitExam);
router.get('/:id/result', getExamResult);

export default router;
