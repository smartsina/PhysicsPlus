import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '../types';

const prisma = new PrismaClient();

export const submitExamAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId, selectedOption } = req.body;
    const userId = (req.user as User).id;

    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) }
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
        topic: question.topic || 'general'
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
    console.error('Submit exam answer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};