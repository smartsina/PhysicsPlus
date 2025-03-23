#!/bin/bash

# Exit on any error
set -e

echo "🚀 Setting up PhysicsPlus project..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to handle errors
handle_error() {
    echo "❌ Error: $1"
    exit 1
}

# Check for required tools
echo "📋 Checking required tools..."
for cmd in node npm psql redis-cli git; do
    if ! command_exists "$cmd"; then
        handle_error "$cmd is not installed. Please install it first."
    fi
done

# Create project directory
PROJECT_DIR="PhysicsPlus"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "📁 Creating project directory..."
    mkdir -p "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# Clone or update repository
if [ ! -d ".git" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/smartsina/PhysicsPlus.git .
else
    echo "🔄 Updating repository..."
    git pull origin main
fi

# Setup server
echo "🛠️ Setting up server..."
cd server || handle_error "Server directory not found"

# Install dependencies
echo "📦 Installing server dependencies..."
npm install || handle_error "Failed to install server dependencies"

# Setup environment variables
echo "⚙️ Creating server environment file..."
cat > .env << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/physicsplus?schema=public"
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
EOL

# Initialize Prisma
echo "🗄️ Setting up database with Prisma..."
cat > prisma/schema.prisma << EOL
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              Int               @id @default(autoincrement())
  username        String            @unique
  email           String            @unique
  passwordHash    String
  xpPoints        Int               @default(0)
  createdAt       DateTime          @default(now())
  answers         Answer[]
  examResults     ExamResult[]
  achievements    UserAchievement[]
  activityLogs    ActivityLog[]
}

model Topic {
  id          Int         @id @default(autoincrement())
  name        String      @unique
  description String?
  createdAt   DateTime    @default(now())
  questions   Question[]
}

model Question {
  id            Int      @id @default(autoincrement())
  topicId       Int
  content       String
  correctAnswer String
  explanation   String?
  difficulty    Int
  createdAt     DateTime @default(now())
  topic         Topic    @relation(fields: [topicId], references: [id])
  answers       Answer[]
}

model Answer {
  id         Int      @id @default(autoincrement())
  userId     Int
  questionId Int
  answer     String
  isCorrect  Boolean
  topic      String
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
  question   Question @relation(fields: [questionId], references: [id])
}

model ExamResult {
  id        Int      @id @default(autoincrement())
  userId    Int
  score     Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model UserAchievement {
  id            Int      @id @default(autoincrement())
  userId        Int
  achievementId String
  earnedAt      DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id])
}

model ActivityLog {
  id        Int      @id @default(autoincrement())
  userId    Int
  type      String
  details   Json?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
EOL

# Generate Prisma client and run migrations
echo "🔄 Generating Prisma client and running migrations..."
npx prisma generate || handle_error "Failed to generate Prisma client"
npx prisma migrate reset --force || handle_error "Failed to reset database"

# Build server
echo "🔨 Building server..."
npm run build || handle_error "Failed to build server"

# Setup client
echo "🎨 Setting up client..."
cd ../client || handle_error "Client directory not found"

# Install dependencies
echo "📦 Installing client dependencies..."
npm install || handle_error "Failed to install client dependencies"

# Setup environment variables
echo "⚙️ Creating client environment file..."
cat > .env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:5000
EOL

# Build client
echo "🔨 Building client..."
npm run build || handle_error "Failed to build client"

# Start services
echo "🚀 Starting services..."

# Start Redis if not running
if ! redis-cli ping > /dev/null 2>&1; then
    echo "Starting Redis..."
    redis-server &
fi

# Start server
cd ../server
echo "Starting server..."
npm run start &

# Start client
cd ../client
echo "Starting client..."
npm run start &

echo "✅ Setup complete! The application should be running at:"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "To stop all services:"
echo "pkill -f 'node'"
echo ""
echo "⚠️ Important notes:"
echo "1. Make sure PostgreSQL is running"
echo "2. Update the JWT_SECRET in server/.env for production"
echo "3. Update database credentials if needed"