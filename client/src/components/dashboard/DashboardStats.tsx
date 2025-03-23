import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

type Stats = {
  totalQuestions: number;
  correctPercentage: number;
  studyStreak: number;
  studyTime: number;
};

type Props = {
  stats: Stats;
};

export function DashboardStats({ stats }: Props) {
  const items = [
    {
      title: 'سوالات حل شده',
      value: stats.totalQuestions,
      icon: AcademicCapIcon,
      color: 'bg-primary',
    },
    {
      title: 'درصد پاسخ صحیح',
      value: `${stats.correctPercentage}%`,
      icon: TrophyIcon,
      color: 'bg-secondary',
    },
    {
      title: 'روزهای پیاپی',
      value: stats.studyStreak,
      icon: FireIcon,
      color: 'bg-accent',
    },
    {
      title: 'زمان مطالعه',
      value: `${Math.floor(stats.studyTime / 60)} ساعت`,
      icon: ClockIcon,
      color: 'bg-success',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="card flex flex-col items-center justify-center text-center"
        >
          <div className={`p-3 rounded-full ${item.color} text-white mb-4`}>
            <item.icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 font-yekan mb-1">
            {item.title}
          </h3>
          <p className="text-2xl font-bold text-gray-700 font-yekan">
            {item.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
