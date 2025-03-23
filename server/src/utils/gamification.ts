import { pool } from '../config/db';
import { User, Answer, ExamResult, TopicStats } from '../types';

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
      return user.answers.some((answer: Answer) => answer.isCorrect);
    },
    points: 10
  },
  {
    id: 'perfect_exam',
    title: 'Perfect Score',
    description: 'Get 100% on an exam',
    condition: async (user: User) => {
      return user.exams.some((exam: ExamResult) => exam.score === 100);
    },
    points: 50
  },
  {
    id: 'topic_master',
    title: 'Topic Master',
    description: 'Get 90% or higher accuracy in a topic with at least 10 questions',
    condition: async (user: User) => {
      const topicStats = user.answers.reduce((acc: Record<string, TopicStats>, answer: Answer) => {
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
      }, {} as Record<string, TopicStats>);

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
    // Get user data with related information
    const userResult = await pool.query<User>(
      `SELECT u.*, 
              json_agg(DISTINCT a.*) as answers,
              json_agg(DISTINCT e.*) as exams
       FROM users u
       LEFT JOIN answers a ON u.id = a.user_id
       LEFT JOIN exam_results e ON u.id = e.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );
    const user = userResult.rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    // Get existing achievements
    const existingAchievementsResult = await pool.query<{ achievement_id: string }>(
      'SELECT achievement_id FROM user_achievements WHERE user_id = $1',
      [userId]
    );
    const existingAchievements = new Set(
      existingAchievementsResult.rows.map(row => row.achievement_id)
    );

    // Check for new achievements
    for (const achievement of achievements) {
      if (!existingAchievements.has(achievement.id)) {
        const achieved = await achievement.condition(user);
        if (achieved) {
          // Award the achievement
          await pool.query(
            `INSERT INTO user_achievements (user_id, achievement_id, earned_at)
             VALUES ($1, $2, NOW())`,
            [userId, achievement.id]
          );

          // Add XP points
          await pool.query(
            'UPDATE users SET xp_points = xp_points + $1 WHERE id = $2',
            [achievement.points, userId]
          );

          // Log the activity
          await pool.query(
            `INSERT INTO activity_logs (user_id, type, details)
             VALUES ($1, 'achievement_earned', $2)`,
            [userId, JSON.stringify({ achievementId: achievement.id, points: achievement.points })]
          );
        }
      }
    }
  } catch (error) {
    console.error('Check achievements error:', error);
    throw error;
  }
}