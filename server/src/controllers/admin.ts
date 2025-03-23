import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        xpPoints: true,
        createdAt: true,
        _count: {
          select: {
            answers: true,
            examResults: true,
            achievements: true
          }
        }
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        topic: true,
        _count: {
          select: {
            answers: true
          }
        }
      }
    });

    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { text, options, correctAnswer, difficulty, topicId } = req.body;

    const question = await prisma.question.create({
      data: {
        text,
        options,
        correctAnswer,
        difficulty: Number(difficulty),
        topicId: Number(topicId)
      },
      include: {
        topic: true
      }
    });

    res.status(201).json(question);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, options, correctAnswer, difficulty, topicId } = req.body;

    const question = await prisma.question.update({
      where: { id: Number(id) },
      data: {
        text,
        options,
        correctAnswer,
        difficulty: Number(difficulty),
        topicId: Number(topicId)
      },
      include: {
        topic: true
      }
    });

    res.json(question);
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.question.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};