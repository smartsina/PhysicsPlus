import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

type Question = {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation: string;
  imageUrl?: string;
};

type Props = {
  question: Question;
};

export function QuestionCard({ question }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(optionIndex);
    setShowExplanation(true);
  };

  const isCorrect = selectedOption === question.correctOption;

  return (
    <div className="card overflow-hidden">
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
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index + 1;
          const isCorrectOption = question.correctOption === index + 1;

          return (
            <motion.button
              key={index}
              whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
              whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
              onClick={() => handleAnswer(index + 1)}
              disabled={selectedOption !== null}
              className={`
                w-full p-4 rounded-lg text-right font-iransans transition-colors
                ${isSelected && isCorrect ? 'bg-success text-white' : ''}
                ${isSelected && !isCorrect ? 'bg-secondary text-white' : ''}
                ${!isSelected && isCorrectOption && selectedOption !== null ? 'bg-success/20' : ''}
                ${!isSelected && selectedOption === null ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    {isCorrect ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <XCircleIcon className="w-6 h-6" />
                    )}
                  </motion.span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="font-bold mb-2 font-yekan">توضیح:</h3>
            <p className="text-gray-700 font-iransans">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
