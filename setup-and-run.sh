#!/bin/bash

# Exit on any error
set -e

echo "🚀 Setting up PhysicsPlus project..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "📋 Checking required tools..."
for cmd in node npm psql redis-cli git; do
    if ! command_exists "$cmd"; then
        echo "❌ $cmd is not installed. Please install it first."
        exit 1
    fi
done

# Clone the repository if it doesn't exist
if [ ! -d "PhysicsPlus" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/smartsina/PhysicsPlus.git
    cd PhysicsPlus
else
    cd PhysicsPlus
    echo "🔄 Updating repository..."
    git pull origin main
fi

# Setup environment variables if not exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating environment file..."
    cat > .env << EOL
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=physicsplus
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_here
EOL
    echo "⚠️ Please update the .env file with your actual database credentials and JWT secret"
fi

# Setup database
echo "🗄️ Setting up database..."
psql -U postgres << EOF
CREATE DATABASE physicsplus;
\c physicsplus
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    xp_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id),
    content TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    question_id INTEGER REFERENCES questions(id),
    answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    topic VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    achievement_id VARCHAR(255) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(255) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

# Install dependencies and build the project
echo "📦 Installing dependencies..."
cd server && npm install
cd ../client && npm install

# Build the project
echo "🔨 Building the project..."
cd ../server && npm run build
cd ../client && npm run build

# Start the services
echo "🚀 Starting the services..."
cd ../server && npm run start &
cd ../client && npm run start &

echo "✅ Setup complete! The application should be running at:"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "To stop the services, use: pkill -f 'node'"