import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '../types';

const prisma = new PrismaClient();

interface TopicProgress {
  total: number;
  correct: number;
}

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        answers: true,
        examResults: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate user stats
    const stats = {
      totalQuestions: user.answers.length,
      correctAnswers: user.answers.filter(a => a.isCorrect).length,
      examsTaken: user.examResults.length,
      averageScore: user.examResults.length > 0
        ? user.examResults.reduce((acc, exam) => acc + exam.score, 0) / user.examResults.length
        : 0,
      xpPoints: user.xpPoints,
      level: Math.floor(user.xpPoints / 100) + 1,
      studyStreak: 0 // This will be implemented with activity tracking
    };

    // Get topic progress
    const topics = await prisma.topic.findMany();
    const answers = await prisma.answer.findMany({
      where: { userId }
    });

    const topicProgress: Record<string, TopicProgress> = {};
    
    topics.forEach(topic => {
      const topicAnswers = answers.filter(a => a.topic === topic.name);
      topicProgress[topic.name] = {
        total: topicAnswers.length,
        correct: topicAnswers.filter(a => a.isCorrect).length
      };
    });

    // Get recent activity
    const recentQuestions = await prisma.answer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        question: true
      }
    });

    const recentActivity = recentQuestions.map(activity => ({
      id: activity.id,
      type: 'question',
      topic: activity.topic,
      isCorrect: activity.isCorrect,
      createdAt: activity.createdAt,
      score: activity.isCorrect ? 10 : 0
    }));

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        xpPoints: user.xpPoints,
        level: stats.level
      },
      stats,
      topicProgress,
      recentActivity
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};