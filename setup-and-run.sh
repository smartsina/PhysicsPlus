#!/bin/bash

# تنظیم رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# تشخیص سیستم‌عامل
OS=$(uname -s)
echo -e "${YELLOW}🔍 تشخیص سیستم‌عامل: $OS${NC}"

# بررسی و نصب پیش‌نیازها
check_and_install_deps() {
    echo -e "${YELLOW}📦 بررسی و نصب پیش‌نیازها...${NC}"
    
    if [ "$OS" = "Linux" ]; then
        # نصب curl اگر موجود نباشد
        if ! command -v curl &> /dev/null; then
            sudo apt update
            sudo apt install -y curl
        fi
        
        # نصب Node.js
        if ! command -v node &> /dev/null; then
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt install -y nodejs
        fi
        
        # نصب PostgreSQL
        if ! command -v psql &> /dev/null; then
            sudo apt install -y postgresql postgresql-contrib
        fi
        
        # نصب Redis
        if ! command -v redis-cli &> /dev/null; then
            sudo apt install -y redis-server
        fi
        
        # نصب Nginx
        if ! command -v nginx &> /dev/null; then
            sudo apt install -y nginx
        fi
        
    elif [ "$OS" = "Darwin" ]; then
        # نصب Homebrew اگر موجود نباشد
        if ! command -v brew &> /dev/null; then
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        
        # نصب Node.js
        if ! command -v node &> /dev/null; then
            brew install node@18
        fi
        
        # نصب PostgreSQL
        if ! command -v psql &> /dev/null; then
            brew install postgresql@14
        fi
        
        # نصب Redis
        if ! command -v redis-cli &> /dev/null; then
            brew install redis
        fi
        
        # نصب Nginx
        if ! command -v nginx &> /dev/null; then
            brew install nginx
        fi
    fi
    
    # نصب pm2 به صورت گلوبال
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi
    
    echo -e "${GREEN}✅ نصب پیش‌نیازها با موفقیت انجام شد${NC}"
}

# راه‌اندازی سرویس‌ها
setup_services() {
    echo -e "${YELLOW}🔧 راه‌اندازی سرویس‌ها...${NC}"
    
    if [ "$OS" = "Linux" ]; then
        sudo systemctl start postgresql
        sudo systemctl start redis-server
        sudo systemctl start nginx
    elif [ "$OS" = "Darwin" ]; then
        brew services start postgresql@14
        brew services start redis
        brew services start nginx
    fi
    
    echo -e "${GREEN}✅ سرویس‌ها با موفقیت راه‌اندازی شدند${NC}"
}

# راه‌اندازی دیتابیس
setup_database() {
    echo -e "${YELLOW}🗄️ راه‌اندازی دیتابیس...${NC}"
    
    if [ "$OS" = "Linux" ]; then
        sudo -u postgres psql -c "CREATE DATABASE physics_plus;"
        sudo -u postgres psql -d physics_plus -f sql/init.sql
    elif [ "$OS" = "Darwin" ]; then
        createdb physics_plus
        psql -d physics_plus -f sql/init.sql
    fi
    
    echo -e "${GREEN}✅ دیتابیس با موفقیت راه‌اندازی شد${NC}"
}

# نصب وابستگی‌های پروژه
install_project_deps() {
    echo -e "${YELLOW}📦 نصب وابستگی‌های پروژه...${NC}"
    
    # Backend
    cd server
    npm install
    cd ..
    
    # Frontend
    cd client
    npm install
    cd ..
    
    echo -e "${GREEN}✅ وابستگی‌های پروژه با موفقیت نصب شدند${NC}"
}

# راه‌اندازی پروژه
run_project() {
    echo -e "${YELLOW}🚀 راه‌اندازی پروژه...${NC}"
    
    # Backend
    cd server
    pm2 start ecosystem.config.js
    cd ..
    
    # Frontend
    cd client
    npm run build
    pm2 start npm --name "physics-plus-frontend" -- start
    cd ..
    
    echo -e "${GREEN}✅ پروژه با موفقیت راه‌اندازی شد${NC}"
}

# تنظیم Nginx
setup_nginx() {
    echo -e "${YELLOW}🔧 تنظیم Nginx...${NC}"
    
    if [ "$OS" = "Linux" ]; then
        sudo cp nginx/physics-plus.conf /etc/nginx/sites-available/
        sudo ln -s /etc/nginx/sites-available/physics-plus.conf /etc/nginx/sites-enabled/
        sudo nginx -t && sudo systemctl reload nginx
    elif [ "$OS" = "Darwin" ]; then
        cp nginx/physics-plus.conf /usr/local/etc/nginx/servers/
        brew services restart nginx
    fi
    
    echo -e "${GREEN}✅ Nginx با موفقیت تنظیم شد${NC}"
}

# اجرای تمام مراحل
main() {
    echo -e "${YELLOW}🎯 شروع نصب و راه‌اندازی PhysicsPlus...${NC}"
    
    check_and_install_deps
    setup_services
    setup_database
    install_project_deps
    setup_nginx
    run_project
    
    echo -e "${GREEN}✅ PhysicsPlus با موفقیت نصب و راه‌اندازی شد!${NC}"
    echo -e "${YELLOW}🌐 می‌توانید از طریق آدرس زیر به برنامه دسترسی پیدا کنید:${NC}"
    echo -e "${GREEN}http://localhost:3000${NC}"
}

# اجرای اسکریپت
main