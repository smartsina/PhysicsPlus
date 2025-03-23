import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User, TopicStats } from '../types';

const prisma = new PrismaClient();

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;

    // Get user data with achievements
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: true,
        answers: {
          include: {
            question: {
              include: {
                topic: true
              }
            }
          }
        },
        examResults: true,
        activityLogs: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate topic statistics
    const topicStats = user.answers.reduce((acc: Record<string, TopicStats>, answer) => {
      const topicName = answer.question.topic.name;
      if (!acc[topicName]) {
        acc[topicName] = {
          topic: topicName,
          total: 0,
          correct: 0
        };
      }
      acc[topicName].total++;
      if (answer.isCorrect) {
        acc[topicName].correct++;
      }
      return acc;
    }, {});

    // Calculate weak topics (accuracy < 60%)
    const weakTopics = Object.values(topicStats)
      .filter(stats => stats.total >= 5 && (stats.correct / stats.total) < 0.6)
      .map(stats => stats.topic);

    // Calculate overall statistics
    const totalAnswers = user.answers.length;
    const correctAnswers = user.answers.filter(a => a.isCorrect).length;
    const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

    // Get recent achievements
    const recentAchievements = user.achievements
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    // Format response
    const dashboardData = {
      user: {
        username: user.username,
        xpPoints: user.xpPoints,
        level: Math.floor(user.xpPoints / 100) + 1
      },
      stats: {
        totalAnswers,
        correctAnswers,
        accuracy: Math.round(accuracy * 10) / 10,
        examsTaken: user.examResults.length,
        averageExamScore: user.examResults.length > 0
          ? Math.round(user.examResults.reduce((sum, exam) => sum + exam.score, 0) / user.examResults.length)
          : 0
      },
      topicStats: Object.values(topicStats),
      weakTopics,
      recentAchievements,
      recentActivity: user.activityLogs
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};