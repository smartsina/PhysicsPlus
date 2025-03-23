import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export async function login(data: { username: string; password: string }) {
  const response = await api.post('/auth/login', data);
  return response.data;
}

export async function register(data: {
  username: string;
  password: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'PARENT';
}) {
  const response = await api.post('/auth/register', data);
  return response.data;
}

// Dashboard
export async function fetchDashboardData() {
  const [stats, weakTopics, recentActivities] = await Promise.all([
    api.get('/dashboard/stats').then((res) => res.data),
    api.get('/dashboard/weak-topics').then((res) => res.data),
    api.get('/dashboard/recent-activity').then((res) => res.data),
  ]);

  return {
    stats,
    weakTopics,
    recentActivities,
  };
}

// Exam
export async function fetchExam(id: string) {
  const response = await api.get(`/exam/${id}`);
  return response.data;
}

export async function submitExam(id: string, answers: Record<string, number>) {
  const response = await api.post(`/exam/${id}/submit`, { answers });
  return response.data;
}

export async function fetchExamResult(id: string) {
  const response = await api.get(`/exam/${id}/result`);
  return response.data;
}

// Practice
export async function fetchPracticeQuestions(topic: string) {
  const response = await api.get('/practice', {
    params: { topic },
  });
  return response.data;
}

export async function submitPracticeAnswer(id: string, data: {
  selectedOption: number;
  confidenceLevel: number;
  responseTime: number;
}) {
  const response = await api.post(`/practice/${id}/answer`, data);
  return response.data;
}
