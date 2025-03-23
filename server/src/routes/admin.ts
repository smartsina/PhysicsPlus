import { Router } from 'express';
import { isAdmin } from '../middleware/auth';
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  listQuestions,
  createExam,
  updateExam,
  deleteExam,
  listExams,
  getStats,
  updateSettings,
} from '../controllers/admin';

const router = Router();

// Questions
router.get('/questions', isAdmin, listQuestions);
router.post('/questions', isAdmin, createQuestion);
router.put('/questions/:id', isAdmin, updateQuestion);
router.delete('/questions/:id', isAdmin, deleteQuestion);

// Exams
router.get('/exams', isAdmin, listExams);
router.post('/exams', isAdmin, createExam);
router.put('/exams/:id', isAdmin, updateExam);
router.delete('/exams/:id', isAdmin, deleteExam);

// Stats & Settings
router.get('/stats', isAdmin, getStats);
router.put('/settings', isAdmin, updateSettings);

export default router;
