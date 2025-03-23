"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchExam, submitExam } from '@/lib/api';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { ExamProgress } from '@/components/exam/ExamProgress';

export default function Exam() {
  const { id } = useParams();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { data: exam, isLoading } = useQuery({
    queryKey: ['exam', id],
    queryFn: () => fetchExam(id as string),
  });

  useEffect(() => {
    if (exam?.duration) {
      setTimeLeft(exam.duration * 60); // Convert minutes to seconds
    }
  }, [exam]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">در حال بارگذاری آزمون...</div>;
  }

  if (!exam) {
    return <div className="text-red-500">آزمون یافت نشد</div>;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  const handleAnswer = (questionId: string, selectedOption: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitExam(id as string, answers);
      toast.success('آزمون با موفقیت ثبت شد');
      router.push(`/exam/${id}/result`);
    } catch (error) {
      toast.error('خطا در ثبت آزمون');
    }
  };

  const handleTimeUp = () => {
    toast.error('زمان آزمون تمام شد');
    handleSubmit();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-yekan">آزمون {exam.title}</h1>
        <ExamTimer initialTime={timeLeft} onTimeUp={handleTimeUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                question={currentQuestion}
                selectedOption={answers[currentQuestion.id]}
                onAnswer={handleAnswer}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary"
            >
              سوال قبلی
            </button>

            {currentQuestionIndex === exam.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                پایان آزمون
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                سوال بعدی
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <ExamProgress
            totalQuestions={exam.questions.length}
            answeredQuestions={Object.keys(answers).length}
            currentQuestion={currentQuestionIndex + 1}
            onQuestionSelect={setCurrentQuestionIndex}
            answers={answers}
          />
        </div>
      </div>
    </div>
  );
}
