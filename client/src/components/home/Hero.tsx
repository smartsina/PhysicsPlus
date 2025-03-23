import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-yekan"
          >
            فیزیک را با لذت یاد بگیرید
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600 font-iransans"
          >
            با فیزیک‌پلاس، یادگیری فیزیک به یک ماجراجویی هیجان‌انگیز تبدیل می‌شود
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href="/register"
              className="btn-primary text-lg font-yekan"
            >
              شروع کنید
            </Link>
            <Link
              href="/about"
              className="text-lg font-semibold leading-6 text-gray-900 font-yekan"
            >
              بیشتر بدانید <span aria-hidden="true">←</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
