#!/bin/bash

# Enable error handling
set -e
trap 'handle_error $? $LINENO' ERR

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Error handler function
handle_error() {
    echo -e "${RED}Error occurred in script at line $2${NC}"
    case $1 in
        1) echo -e "${RED}General error${NC}" ;;
        2) echo -e "${RED}Missing dependency${NC}" ;;
        126|127) echo -e "${RED}Command not found${NC}" ;;
        *) echo -e "${RED}Unknown error: $1${NC}" ;;
    esac
    exit $1
}

# Logger function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Warning logger
warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check for required commands
check_dependencies() {
    log "Checking required dependencies..."
    local deps=("node" "npm" "git")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" >/dev/null 2>&1; then
            warn "$dep is not installed. Installing..."
            case "$dep" in
                "node"|"npm")
                    if [[ "$OSTYPE" == "darwin"* ]]; then
                        brew install node
                    else
                        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    fi
                    ;;
                "git")
                    if [[ "$OSTYPE" == "darwin"* ]]; then
                        brew install git
                    else
                        sudo apt-get install -y git
                    fi
                    ;;
            esac
        fi
    done
}

# Setup project directory
setup_project() {
    log "Setting up project directory..."
    if [ ! -d "PhysicsPlus" ]; then
        git clone https://github.com/smartsina/PhysicsPlus.git
    fi
    cd PhysicsPlus
    git pull origin main
}

# Setup environment variables
setup_env() {
    log "Setting up environment variables..."
    if [ ! -f ".env" ]; then
        cat > .env << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/physicsplus?schema=public"
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
EOL
        warn "Created default .env file. Please update with your actual credentials."
    fi
}

# Install and setup server
setup_server() {
    log "Setting up server..."
    cd server

    # Install dependencies
    log "Installing server dependencies..."
    npm install

    # Initialize Prisma
    log "Initializing Prisma..."
    npx prisma generate

    # Create TypeScript config if not exists
    if [ ! -f "tsconfig.json" ]; then
        log "Creating TypeScript configuration..."
        cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "*": ["node_modules/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOL
    fi

    # Create dist directory
    mkdir -p dist

    # Build server
    log "Building server..."
    npm run build

    cd ..
}

# Install and setup client
setup_client() {
    log "Setting up client..."
    cd client

    # Install dependencies
    log "Installing client dependencies..."
    npm install

    # Build client
    log "Building client..."
    npm run build

    cd ..
}

# Start services
start_services() {
    log "Starting services..."
    
    # Start server
    cd server
    npm run start &
    SERVER_PID=$!
    cd ..

    # Start client
    cd client
    npm run start &
    CLIENT_PID=$!
    cd ..

    # Save PIDs
    echo "$SERVER_PID" > .server.pid
    echo "$CLIENT_PID" > .client.pid

    log "Services started successfully!"
    log "Frontend running at: http://localhost:3000"
    log "Backend running at: http://localhost:5000"
    log "To stop the services, run: ./stop-services.sh"

    # Create stop script
    cat > stop-services.sh << EOL
#!/bin/bash
if [ -f .server.pid ]; then
    kill \$(cat .server.pid)
    rm .server.pid
fi
if [ -f .client.pid ]; then
    kill \$(cat .client.pid)
    rm .client.pid
fi
echo "Services stopped"
EOL
    chmod +x stop-services.sh
}

# Main execution
main() {
    log "Starting PhysicsPlus setup..."
    
    check_dependencies
    setup_project
    setup_env
    setup_server
    setup_client
    start_services
    
    log "Setup completed successfully!"
}

# Run main function
main