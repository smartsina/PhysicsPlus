import { motion } from 'framer-motion';

const topics = [
  { id: 'mechanics', name: 'مکانیک' },
  { id: 'thermodynamics', name: 'ترمودینامیک' },
  { id: 'electricity', name: 'الکتریسیته' },
  { id: 'magnetism', name: 'مغناطیس' },
  { id: 'waves', name: 'امواج' },
  { id: 'optics', name: 'نور' },
  { id: 'modern', name: 'فیزیک جدید' },
];

type Props = {
  selectedTopic: string;
  onTopicSelect: (topic: string) => void;
};

export function TopicSelector({ selectedTopic, onTopicSelect }: Props) {
  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-4 font-yekan">موضوعات</h2>
      <div className="space-y-2">
        {topics.map((topic, index) => (
          <motion.button
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => onTopicSelect(topic.id)}
            className={`
              w-full p-3 rounded-lg text-right font-yekan transition-colors
              ${selectedTopic === topic.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
            `}
          >
            {topic.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
