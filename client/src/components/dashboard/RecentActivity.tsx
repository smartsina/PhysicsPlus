import { motion } from 'framer-motion';
import { format } from 'date-fns-jalali';

type Activity = {
  id: string;
  type: 'EXAM' | 'PRACTICE';
  score?: number;
  date: string;
  topic: string;
};

type Props = {
  activities: Activity[];
};

export function RecentActivity({ activities }: Props) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 font-yekan">فعالیت‌های اخیر</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h3 className="font-yekan text-gray-900">
                {activity.type === 'EXAM' ? 'آزمون' : 'تمرین'} {activity.topic}
              </h3>
              <p className="text-sm text-gray-500 font-iransans">
                {format(new Date(activity.date), 'yyyy/MM/dd HH:mm')}
              </p>
            </div>
            {activity.score !== undefined && (
              <div className="text-lg font-bold font-yekan text-primary">
                {activity.score}%
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
