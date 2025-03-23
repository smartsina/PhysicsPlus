import { motion } from 'framer-motion';

type Question = {
  id: string;
  text: string;
  options: string[];
  imageUrl?: string;
};

type Props = {
  question: Question;
  selectedOption?: number;
  onAnswer: (questionId: string, option: number) => void;
};

export function QuestionCard({ question, selectedOption, onAnswer }: Props) {
  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 font-yekan">{question.text}</h2>
        {question.imageUrl && (
          <img
            src={question.imageUrl}
            alt="تصویر سوال"
            className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-6"
          />
        )}
      </div>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(question.id, index + 1)}
            className={`w-full p-4 rounded-lg text-right font-iransans transition-colors
              ${selectedOption === index + 1
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
