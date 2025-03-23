-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial admin user
INSERT INTO users (id, username, password, name, role, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'smartsina',
  -- This is a bcrypt hash of '61810511'
  '$2a$10$YourHashedPasswordHere',
  'مدیر سیستم',
  'ADMIN',
  NOW(),
  NOW()
);

-- Create test teacher account
INSERT INTO users (id, username, password, name, role, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'teacher_test',
  -- This is a bcrypt hash of 'Physics@2024'
  '$2a$10$YourHashedPasswordHere',
  'معلم تست',
  'TEACHER',
  NOW(),
  NOW()
);

-- Create test student account
INSERT INTO users (id, username, password, name, role, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'student_test',
  -- This is a bcrypt hash of 'Student@2024'
  '$2a$10$YourHashedPasswordHere',
  'دانش‌آموز تست',
  'STUDENT',
  NOW(),
  NOW()
);

-- Create test parent account
INSERT INTO users (id, username, password, name, role, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'parent_test',
  -- This is a bcrypt hash of 'Parent@2024'
  '$2a$10$YourHashedPasswordHere',
  'والد تست',
  'PARENT',
  NOW(),
  NOW()
);

-- Create some sample physics questions
INSERT INTO questions (id, text, options, correct_option, explanation, difficulty_static, topic, type)
VALUES
  (
    uuid_generate_v4(),
    'نیروی جاذبه بین دو جسم با چه عواملی نسبت مستقیم دارد؟',
    '["جرم اجسام", "فاصله اجسام", "هر دو مورد", "هیچکدام"]',
    3,
    'نیروی جاذبه با حاصلضرب جرم دو جسم نسبت مستقیم دارد.',
    50,
    'مکانیک',
    'PRACTICE'
  ),
  (
    uuid_generate_v4(),
    'انرژی جنبشی یک جسم با چه عواملی رابطه دارد؟',
    '["فقط جرم", "فقط سرعت", "جرم و سرعت", "هیچکدام"]',
    3,
    'انرژی جنبشی با حاصلضرب نصف جرم در مجذور سرعت برابر است.',
    60,
    'انرژی',
    'EXAM'
  );
