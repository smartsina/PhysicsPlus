import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '../types';

const prisma = new PrismaClient();

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { topic, difficulty } = req.query;
    const userId = (req.user as User).id;

    const questions = await prisma.question.findMany({
      where: {
        ...(topic && { topic: { name: topic.toString() } }),
        ...(difficulty && { difficulty: parseInt(difficulty.toString()) }),
        NOT: {
          answers: {
            some: {
              userId
            }
          }
        }
      },
      include: {
        topic: true
      },
      take: 10
    });

    res.json(questions);
  } catch (error) {
    console.error('Get practice questions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId, selectedOption } = req.body;
    const userId = (req.user as User).id;

    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) },
      include: {
        topic: true
      }
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = question.correctAnswer === selectedOption.toString();

    const answer = await prisma.answer.create({
      data: {
        userId,
        questionId: Number(questionId),
        answer: selectedOption.toString(),
        isCorrect,
        topic: question.topic.name
      }
    });

    // Update user XP
    await prisma.user.update({
      where: { id: userId },
      data: {
        xpPoints: {
          increment: isCorrect ? 5 : 1
        }
      }
    });

    res.json({
      success: true,
      answer,
      xpGained: isCorrect ? 5 : 1
    });
  } catch (error) {
    console.error('Submit practice answer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};