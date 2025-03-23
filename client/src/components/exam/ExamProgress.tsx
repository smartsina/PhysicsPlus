import { motion } from 'framer-motion';

type Props = {
  totalQuestions: number;
  answeredQuestions: number;
  currentQuestion: number;
  onQuestionSelect: (index: number) => void;
  answers: Record<string, number>;
};

export function ExamProgress({
  totalQuestions,
  answeredQuestions,
  currentQuestion,
  onQuestionSelect,
  answers,
}: Props) {
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="card sticky top-4">
      <h3 className="text-lg font-bold mb-4 font-yekan">پیشرفت آزمون</h3>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500 font-yekan">
            {answeredQuestions} از {totalQuestions}
          </span>
          <span className="text-sm text-gray-500 font-yekan">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <button
            key={index}
            onClick={() => onQuestionSelect(index)}
            className={`
              w-full aspect-square rounded-lg font-yekan text-sm
              transition-colors duration-200
              ${currentQuestion === index + 1 ? 'ring-2 ring-primary' : ''}
              ${answers[index]
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
            `}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
