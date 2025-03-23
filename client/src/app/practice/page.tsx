"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchPracticeQuestions } from '@/lib/api';
import { QuestionCard } from '@/components/practice/QuestionCard';
import { TopicSelector } from '@/components/practice/TopicSelector';

export default function Practice() {
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const { data: questions, isLoading } = useQuery({
    queryKey: ['practice', selectedTopic],
    queryFn: () => fetchPracticeQuestions(selectedTopic),
    enabled: !!selectedTopic,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-yekan">تمرین فیزیک</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <TopicSelector
            selectedTopic={selectedTopic}
            onTopicSelect={setSelectedTopic}
          />
        </div>

        <div className="lg:col-span-3">
          {!selectedTopic ? (
            <div className="text-center text-gray-500 font-iransans">
              لطفاً یک موضوع را انتخاب کنید
            </div>
          ) : isLoading ? (
            <div className="text-center text-gray-500 font-iransans">
              در حال بارگذاری سوالات...
            </div>
          ) : questions?.length ? (
            <div className="space-y-8">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <QuestionCard question={question} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 font-iransans">
              سوالی برای این موضوع یافت نشد
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
