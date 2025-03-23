import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const [totalAnswers, correctAnswers, user] = await Promise.all([
      prisma.answer.count({
        where: { userId },
      }),
      prisma.answer.count({
        where: {
          userId,
          isCorrect: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
      }),
    ]);

    res.json({
      totalQuestions: totalAnswers,
      correctPercentage: totalAnswers > 0
        ? Math.round((correctAnswers / totalAnswers) * 100)
        : 0,
      studyStreak: user?.studyStreak || 0,
      level: user?.level || 1,
      xpPoints: user?.xpPoints || 0,
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}

export async function getWeakTopics(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const answers = await prisma.answer.findMany({
      where: { userId },
      include: {
        question: {
          select: {
            topic: true,
          },
        },
      },
    });

    const topicStats = answers.reduce((acc, answer) => {
      const topic = answer.question.topic;
      if (!acc[topic]) {
        acc[topic] = { total: 0, correct: 0 };
      }
      acc[topic].total++;
      if (answer.isCorrect) {
        acc[topic].correct++;
      }
      return acc;
    }, {} as Record<string, { total: number; correct: number }>);

    const weakTopics = Object.entries(topicStats)
      .map(([topic, stats]) => ({
        name: topic,
        correctPercentage: Math.round((stats.correct / stats.total) * 100),
      }))
      .sort((a, b) => a.correctPercentage - b.correctPercentage)
      .slice(0, 5);

    res.json(weakTopics);
  } catch (error) {
    logger.error('Get weak topics error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}

export async function getRecentActivity(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const activities = await prisma.answer.findMany({
      where: { userId },
      include: {
        question: {
          select: {
            topic: true,
            type: true,
          },
        },
        exam: {
          select: {
            score: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.question.type,
      topic: activity.question.topic,
      score: activity.exam?.score,
      date: activity.createdAt,
    }));

    res.json(formattedActivities);
  } catch (error) {
    logger.error('Get recent activity error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}
