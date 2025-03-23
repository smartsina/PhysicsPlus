import { User as PrismaUser } from '@prisma/client';

export interface User extends PrismaUser {
  role?: 'user' | 'admin';
  name?: string;
  studyStreak?: number;
  level?: number;
  lastLoginAt?: Date;
}

export interface Answer {
  id: number;
  userId: number;
  questionId: number;
  answer: string;
  isCorrect: boolean;
  topic: string;
  createdAt: Date;
  question?: Question;
}

export interface Question {
  id: number;
  topicId: number;
  content: string;
  correctAnswer: string;
  explanation?: string;
  difficulty: number;
  type?: string;
  topic?: string;
  correctOption?: number;
  createdAt: Date;
}

export interface ExamResult {
  id: number;
  userId: number;
  score: number;
  createdAt: Date;
}

export interface TopicStats {
  total: number;
  correct: number;
  topic: string;
}

export interface JwtPayload {
  userId: number;
  role?: string;
}