import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '../types';

const prisma = new PrismaClient();

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { topic, difficulty } = req.query;

    const questions = await prisma.question.findMany({
      where: {
        topic: {
          name: topic as string
        },
        difficulty: difficulty ? parseInt(difficulty as string) : undefined
      },
      select: {
        id: true,
        content: true,
        difficulty: true,
        topic: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        difficulty: 'asc'
      },
      take: 10
    });

    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId, selectedOption } = req.body;
    const userId = (req.user as User).id;

    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId) }
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = question.correctAnswer === selectedOption.toString();

    const answer = await prisma.answer.create({
      data: {
        userId,
        questionId: parseInt(questionId),
        answer: selectedOption.toString(),
        isCorrect,
        topic: (await prisma.topic.findUnique({
          where: { id: question.topicId }
        }))?.name || 'general'
      }
    });

    // Update question difficulty based on answers
    const questionAnswers = await prisma.answer.findMany({
      where: { questionId: parseInt(questionId) }
    });

    const correctRate = questionAnswers.filter(a => a.isCorrect).length / questionAnswers.length;
    const newDifficulty = Math.min(Math.max(Math.round((1 - correctRate) * 5), 1), 5);

    await prisma.question.update({
      where: { id: parseInt(questionId) },
      data: {
        difficulty: newDifficulty
      }
    });

    // Update user XP
    await prisma.user.update({
      where: { id: userId },
      data: {
        xpPoints: {
          increment: isCorrect ? 10 : 1
        }
      }
    });

    res.json({
      success: true,
      answer,
      xpGained: isCorrect ? 10 : 1
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};