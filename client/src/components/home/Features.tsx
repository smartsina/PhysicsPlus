import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'یادگیری تعاملی',
    description: 'با استفاده از انیمیشن‌ها و شبیه‌سازی‌های سه‌بعدی',
    icon: AcademicCapIcon,
  },
  {
    name: 'تحلیل پیشرفت',
    description: 'نمودارهای تعاملی و گزارش‌های دقیق از روند یادگیری',
    icon: ChartBarIcon,
  },
  {
    name: 'رقابت سالم',
    description: 'رده‌بندی و نشان‌های متنوع برای افزایش انگیزه',
    icon: TrophyIcon,
  },
  {
    name: 'همکاری گروهی',
    description: 'امکان حل مسئله به صورت گروهی و بحث درباره راه‌حل‌ها',
    icon: UserGroupIcon,
  },
];

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary font-yekan">
            ویژگی‌های فیزیک‌پلاس
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-yekan">
            چرا فیزیک‌پلاس؟
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 font-iransans">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
