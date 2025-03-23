import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export async function getPracticeQuestions(req: Request, res: Response) {
  try {
    const { topic } = req.query;
    const userId = req.user!.id;

    const questions = await prisma.question.findMany({
      where: {
        topic: topic as string,
        type: 'PRACTICE',
      },
      select: {
        id: true,
        text: true,
        options: true,
        imageUrl: true,
        topic: true,
        difficulty_static: true,
      },
      orderBy: {
        difficulty_static: 'asc',
      },
      take: 10,
    });

    res.json(questions);
  } catch (error) {
    logger.error('Get practice questions error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}

export async function submitPracticeAnswer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { selectedOption, confidenceLevel, responseTime } = req.body;
    const userId = req.user!.id;

    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return res.status(404).json({ message: 'سوال یافت نشد' });
    }

    const isCorrect = question.correctOption === selectedOption;

    await prisma.$transaction([
      prisma.answer.create({
        data: {
          userId,
          questionId: id,
          selectedOption,
          isCorrect,
          confidenceLevel,
          responseTime,
        },
      }),
      prisma.question.update({
        where: { id },
        data: {
          difficulty_dynamic: {
            increment: isCorrect ? -0.1 : 0.1,
          },
        },
      }),
    ]);

    res.json({
      isCorrect,
      explanation: question.explanation,
    });
  } catch (error) {
    logger.error('Submit practice answer error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}
