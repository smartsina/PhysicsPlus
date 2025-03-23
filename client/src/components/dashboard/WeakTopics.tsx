import { motion } from 'framer-motion';

type Topic = {
  name: string;
  correctPercentage: number;
};

type Props = {
  topics: Topic[];
};

export function WeakTopics({ topics }: Props) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 font-yekan">موضوعات نیازمند تمرین</h2>
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-yekan text-gray-700">{topic.name}</span>
              <span className="font-yekan text-sm text-gray-500">
                {topic.correctPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{ width: `${topic.correctPercentage}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
