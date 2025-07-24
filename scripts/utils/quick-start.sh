#!/bin/bash

# 🚀 Quick Start - Simple 2-command startup
echo "🚀 Quick starting development environment..."

# Start Supabase
echo "🗄️  Starting Supabase..."
npx supabase start

# Start frontend  
echo "🌐 Starting frontend on http://localhost:8080..."
pnpm dev
