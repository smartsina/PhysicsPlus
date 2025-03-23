"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { register as registerUser } from '@/lib/auth';

type RegisterForm = {
  username: string;
  password: string;
  name: string;
  role: 'STUDENT' | 'PARENT' | 'TEACHER';
};

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      await registerUser(data);
      router.push('/login');
      toast.success('ثبت‌نام با موفقیت انجام شد');
    } catch (error) {
      toast.error('خطا در ثبت‌نام');
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
            ثبت‌نام در فیزیک‌پلاس
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">نام و نام خانوادگی</label>
              <input
                {...register('name', { required: true })}
                id="name"
                type="text"
                className="input-field rounded-t-lg"
                placeholder="نام و نام خانوادگی"
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">نام کاربری</label>
              <input
                {...register('username', { required: true })}
                id="username"
                type="text"
                className="input-field"
                placeholder="نام کاربری"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">رمز عبور</label>
              <input
                {...register('password', { required: true })}
                id="password"
                type="password"
                className="input-field"
                placeholder="رمز عبور"
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">نقش</label>
              <select
                {...register('role', { required: true })}
                id="role"
                className="input-field rounded-b-lg"
              >
                <option value="STUDENT">دانش‌آموز</option>
                <option value="PARENT">والد</option>
                <option value="TEACHER">معلم</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </button>
          </div>

          <div className="text-sm text-center font-iransans">
            <Link href="/login" className="text-primary hover:text-primary/80">
              حساب کاربری دارید؟ وارد شوید
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
