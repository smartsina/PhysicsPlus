import { motion } from 'framer-motion';

const testimonials = [
  {
    content: 'فیزیک‌پلاس به من کمک کرد تا فیزیک را بهتر درک کنم. انیمیشن‌ها واقعاً کمک‌کننده هستند.',
    author: 'سارا محمدی',
    role: 'دانش‌آموز پایه دهم',
  },
  {
    content: 'به عنوان یک معلم، این پلتفرم به من کمک می‌کند تا پیشرفت دانش‌آموزانم را بهتر پیگیری کنم.',
    author: 'دکتر احمدی',
    role: 'معلم فیزیک',
  },
  {
    content: 'به عنوان یک والد، خیلی خوشحالم که می‌توانم پیشرفت فرزندم را به صورت آنلاین دنبال کنم.',
    author: 'مریم حسینی',
    role: 'والد دانش‌آموز',
  },
];

export function Testimonials() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary font-yekan">
            نظرات کاربران
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-yekan">
            دیگران درباره ما چه می‌گویند
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-shadow duration-300"
              >
                <blockquote className="text-lg font-iransans leading-8 text-gray-700">
                  {testimonial.content}
                </blockquote>
                <div className="mt-6">
                  <div className="font-yekan font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="font-iransans text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
