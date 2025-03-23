import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'PhysicsPlus - پلتفرم آموزش فیزیک',
  description: 'یادگیری فیزیک با روش‌های تعاملی و گیمیفیکیشن',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-iransans bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
