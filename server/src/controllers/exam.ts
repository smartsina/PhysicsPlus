import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export async function getExam(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            imageUrl: true,
            topic: true,
          },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({ message: 'آزمون یافت نشد' });
    }

    res.json(exam);
  } catch (error) {
    logger.error('Get exam error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}

export async function submitExam(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user!.id;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!exam) {
      return res.status(404).json({ message: 'آزمون یافت نشد' });
    }

    const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
      userId,
      questionId,
      examId: id,
      selectedOption: selectedOption as number,
      isCorrect: exam.questions.find(q => q.id === questionId)?.correctOption === selectedOption,
    }));

    await prisma.$transaction([
      prisma.answer.createMany({
        data: answersArray,
      }),
      prisma.exam.update({
        where: { id },
        data: {
          completedAt: new Date(),
          score: Math.round(
            (answersArray.filter(a => a.isCorrect).length / answersArray.length) * 100
          ),
        },
      }),
    ]);

    res.json({ message: 'آزمون با موفقیت ثبت شد' });
  } catch (error) {
    logger.error('Submit exam error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}

export async function getExamResult(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const exam = await prisma.exam.findFirst({
      where: {
        id,
        userId,
        completedAt: { not: null },
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({ message: 'نتیجه آزمون یافت نشد' });
    }

    res.json(exam);
  } catch (error) {
    logger.error('Get exam result error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}

export async function listExams(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const exams = await prisma.exam.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(exams);
  } catch (error) {
    logger.error('List exams error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}
