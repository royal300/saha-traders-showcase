#!/bin/bash
# Exit immediately if any command fails
set -e

echo "=========================================="
echo "🚀 Starting Deployment for saha-traders..."
echo "=========================================="

# Navigate to application directory
cd /var/www/saha_traders

# Pull latest code from GitHub
echo "⏬ Pulling latest changes from GitHub (main)..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🛠️ Building the application..."
npm run build

# Restart or Start PM2 process
echo "🔄 Restarting PM2 process 'saha-traders'..."
pm2 restart saha-traders || pm2 start npm --name "saha-traders" -- run start:node

echo "=========================================="
echo "✅ Deployment completed successfully!"
echo "=========================================="
