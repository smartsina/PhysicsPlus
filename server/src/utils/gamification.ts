import { PrismaClient } from '@prisma/client';
import { redis } from './redis';

const prisma = new PrismaClient();

const BADGES = {
  FIRST_CORRECT: {
    id: 'first_correct',
    name: 'اولین پاسخ صحیح',
    description: 'اولین پاسخ صحیح خود را دادید',
  },
  PERFECT_EXAM: {
    id: 'perfect_exam',
    name: 'آزمون کامل',
    description: 'یک آزمون را با نمره کامل پشت سر گذاشتید',
  },
  STUDY_STREAK_7: {
    id: 'study_streak_7',
    name: 'هفت روز پیاپی',
    description: 'هفت روز پشت سر هم مطالعه کردید',
  },
  MASTER_TOPIC: {
    id: 'master_topic',
    name: 'استاد موضوع',
    description: 'در یک موضوع به تسلط رسیدید',
  },
};

export async function updateStudyStreak(userId: string) {
  const lastActivityKey = `user:${userId}:last_activity`;
  const lastActivity = await redis.get(lastActivityKey);
  const today = new Date().toISOString().split('T')[0];

  if (lastActivity) {
    const lastDate = new Date(lastActivity).toISOString().split('T')[0];
    if (lastDate === today) return;

    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    if (lastDate === yesterday) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          studyStreak: { increment: 1 },
        },
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          studyStreak: 1,
        },
      });
    }
  }

  await redis.set(lastActivityKey, new Date().toISOString());
}

export async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      answers: true,
      exams: true,
    },
  });

  if (!user) return;

  const badges = new Set(user.badges);

  // First correct answer
  if (
    user.answers.some((a) => a.isCorrect) &&
    !badges.has(BADGES.FIRST_CORRECT.id)
  ) {
    badges.add(BADGES.FIRST_CORRECT.id);
  }

  // Perfect exam
  if (
    user.exams.some((e) => e.score === 100) &&
    !badges.has(BADGES.PERFECT_EXAM.id)
  ) {
    badges.add(BADGES.PERFECT_EXAM.id);
  }

  // 7-day study streak
  if (user.studyStreak >= 7 && !badges.has(BADGES.STUDY_STREAK_7.id)) {
    badges.add(BADGES.STUDY_STREAK_7.id);
  }

  // Topic mastery (90% correct answers in a topic)
  const topicStats = user.answers.reduce((acc, answer) => {
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

  Object.entries(topicStats).forEach(([topic, stats]) => {
    if (
      stats.total >= 10 &&
      stats.correct / stats.total >= 0.9 &&
      !badges.has(`${BADGES.MASTER_TOPIC.id}_${topic}`)
    ) {
      badges.add(`${BADGES.MASTER_TOPIC.id}_${topic}`);
    }
  });

  if (badges.size > user.badges.length) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        badges: Array.from(badges),
      },
    });
  }
}
