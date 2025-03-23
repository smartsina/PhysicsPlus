"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Props = {
  initialTime: number; // in seconds
  onTimeUp: () => void;
};

export function ExamTimer({ initialTime, onTimeUp }: Props) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getColor = () => {
    if (timeLeft > 300) return 'text-success'; // More than 5 minutes
    if (timeLeft > 60) return 'text-accent'; // More than 1 minute
    return 'text-secondary'; // Less than 1 minute
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-2xl font-bold font-yekan ${getColor()}`}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </motion.div>
  );
}
