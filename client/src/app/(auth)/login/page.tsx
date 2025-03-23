"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { login } from '@/lib/auth';

type LoginForm = {
  username: string;
  password: string;
};

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      await login(data);
      router.push('/dashboard');
      toast.success('خوش آمدید!');
    } catch (error) {
      toast.error('نام کاربری یا رمز عبور اشتباه است');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 card"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-yekan">
            ورود به فیزیک‌پلاس
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">نام کاربری</label>
              <input
                {...register('username', { required: true })}
                id="username"
                type="text"
                className="input-field rounded-t-lg"
                placeholder="نام کاربری"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">رمز عبور</label>
              <input
                {...register('password', { required: true })}
                id="password"
                type="password"
                className="input-field rounded-b-lg"
                placeholder="رمز عبور"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </button>
          </div>

          <div className="text-sm text-center font-iransans">
            <Link href="/register" className="text-primary hover:text-primary/80">
              حساب کاربری ندارید؟ ثبت‌نام کنید
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
