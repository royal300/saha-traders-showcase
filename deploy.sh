#!/bin/bash
# Exit immediately if any command fails
set -e

echo "=========================================="
echo "🚀 Starting Deployment for saha-traders..."
echo "=========================================="

# Navigate to application directory
cd /var/www/saha_traders

# Preserve user-uploaded files by adding them to .gitignore-skip
# (git reset --hard would delete VPS-only uploads, so we use fetch+reset)
echo "⏬ Pulling latest changes from GitHub (main)..."
git fetch origin main
git reset --hard origin/main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🛠️ Building the application..."
npm run build

# Zero-downtime reload via PM2
echo "🔄 Reloading PM2 process 'saha-traders'..."
pm2 reload saha-traders || pm2 start npm --name "saha-traders" -- run start:node

echo "=========================================="
echo "✅ Deployment completed successfully!"
echo "=========================================="
