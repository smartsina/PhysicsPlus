export type User = {
  id: string;
  username: string;
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  studyStreak: number;
  xpPoints: number;
  level: number;
  badges: string[];
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctOption?: number;
  explanation?: string;
  imageUrl?: string;
  topic: string;
  type: 'PRACTICE' | 'EXAM';
  difficultyStatic: number;
  difficultyDynamic: number;
};

export type Answer = {
  id: string;
  userId: string;
  questionId: string;
  examId?: string;
  selectedOption: number;
  isCorrect: boolean;
  responseTime: number;
  confidenceLevel: number;
  createdAt: string;
};

export type Exam = {
  id: string;
  userId: string;
  score: number;
  duration: number;
  questions: Question[];
  answers: Answer[];
  createdAt: string;
  completedAt?: string;
};

export type DashboardStats = {
  totalQuestions: number;
  correctPercentage: number;
  studyStreak: number;
  level: number;
  xpPoints: number;
};

export type WeakTopic = {
  name: string;
  correctPercentage: number;
};

export type RecentActivity = {
  id: string;
  type: 'EXAM' | 'PRACTICE';
  topic: string;
  score?: number;
  date: string;
};
