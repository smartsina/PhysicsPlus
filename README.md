# 🎯 PhysicsPlus

یک پلتفرم آموزشی تعاملی برای یادگیری فیزیک با ویژگی‌های گیمیفیکیشن

## 🚀 ویژگی‌ها

- 📱 طراحی واکنش‌گرا (موبایل-اول)
- 🎮 سیستم گیمیفیکیشن با XP و نشان‌ها
- 📊 تحلیل پیشرفته عملکرد
- 👥 پنل‌های مجزا برای دانش‌آموز، معلم، والدین و ادمین
- 🔄 مرور هوشمند سوالات
- 📈 نمودارهای تعاملی پیشرفت
- 🏆 سیستم رده‌بندی و چالش‌ها

## 🛠 تکنولوژی‌ها

- **Frontend:** Next.js 14 + TailwindCSS
- **Backend:** Node.js 18 + Express.js
- **Database:** PostgreSQL 14
- **Caching:** Redis
- **State Management:** Zustand

## 📦 پیش‌نیازها

- Node.js 18 LTS یا بالاتر
- PostgreSQL 14
- Redis

## 🚀 نصب و راه‌اندازی

### روش اول: اجرای خودکار
```bash
bash <(curl -s -L https://raw.githubusercontent.com/smartsina/PhysicsPlus/main/setup-and-run.sh)
```

### روش دوم: نصب دستی

1. کلون کردن مخزن:
```bash
git clone https://github.com/smartsina/PhysicsPlus.git
cd PhysicsPlus
```

2. نصب وابستگی‌ها:
```bash
# Backend
cd server
npm install
cp .env.example .env  # تنظیم متغیرهای محیطی

# Frontend
cd ../client
npm install
cp .env.example .env  # تنظیم متغیرهای محیطی
```

3. راه‌اندازی دیتابیس:
```bash
cd ../sql
psql -U postgres -f init.sql
```

4. اجرای پروژه:
```bash
# Backend
cd ../server
npm run dev

# Frontend (در ترمینال جدید)
cd ../client
npm run dev
```

## 👥 کاربران تستی

```
Admin:
- Username: smartsina
- Password: 61810511

Teacher:
- Username: teacher_test
- Password: Physics@2024

Student:
- Username: student_test
- Password: Student@2024

Parent:
- Username: parent_test
- Password: Parent@2024
```

## 📝 لایسنس

MIT