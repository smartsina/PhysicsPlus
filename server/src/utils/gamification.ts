import { PrismaClient } from '@prisma/client';
import { User, Answer, ExamResult, TopicStats } from '../types';

const prisma = new PrismaClient();

interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: (user: User) => Promise<boolean>;
  points: number;
}

const achievements: Achievement[] = [
  {
    id: 'first_correct_answer',
    title: 'First Success',
    description: 'Get your first correct answer',
    condition: async (user: User) => {
      const answers = await prisma.answer.findMany({
        where: { userId: user.id }
      });
      return answers.some(answer => answer.isCorrect);
    },
    points: 10
  },
  {
    id: 'perfect_exam',
    title: 'Perfect Score',
    description: 'Get 100% on an exam',
    condition: async (user: User) => {
      const exams = await prisma.examResult.findMany({
        where: { userId: user.id }
      });
      return exams.some(exam => exam.score === 100);
    },
    points: 50
  },
  {
    id: 'topic_master',
    title: 'Topic Master',
    description: 'Get 90% or higher accuracy in a topic with at least 10 questions',
    condition: async (user: User) => {
      const answers = await prisma.answer.findMany({
        where: { userId: user.id }
      });

      const topicStats = answers.reduce((acc: Record<string, TopicStats>, answer) => {
        if (!acc[answer.topic]) {
          acc[answer.topic] = {
            total: 0,
            correct: 0,
            topic: answer.topic
          };
        }
        acc[answer.topic].total++;
        if (answer.isCorrect) {
          acc[answer.topic].correct++;
        }
        return acc;
      }, {});

      return Object.values(topicStats).some((stats: TopicStats) => 
        stats.total >= 10 &&
        stats.correct / stats.total >= 0.9 &&
        stats.topic
      );
    },
    points: 100
  }
];

export async function checkAchievements(userId: number): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const existingAchievements = await prisma.userAchievement.findMany({
      where: { userId }
    });

    const existingAchievementIds = new Set(
      existingAchievements.map(achievement => achievement.achievementId)
    );

    for (const achievement of achievements) {
      if (!existingAchievementIds.has(achievement.id)) {
        const achieved = await achievement.condition(user);
        if (achieved) {
          await prisma.userAchievement.create({
            data: {
              userId,
              achievementId: achievement.id
            }
          });

          await prisma.user.update({
            where: { id: userId },
            data: {
              xpPoints: {
                increment: achievement.points
              }
            }
          });

          await prisma.activityLog.create({
            data: {
              userId,
              type: 'achievement_earned',
              details: {
                achievementId: achievement.id,
                points: achievement.points
              }
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Check achievements error:', error);
    throw error;
  }
}