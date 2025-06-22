#!/bin/bash

# 🚀 GitHub Link-Up Buddy - Development Environment Startup Script
# This script starts your complete local development environment

set -e  # Exit on any error

echo "🚀 Starting GitHub Link-Up Buddy Development Environment..."
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :"$1" >/dev/null 2>&1
}

# Function to kill process on specific port
kill_port() {
    if port_in_use "$1"; then
        echo "⚠️  Port $1 is in use, killing existing process..."
        lsof -ti :"$1" | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Verify required commands
echo "🔍 Checking prerequisites..."
if ! command_exists "npx"; then
    echo "❌ Node.js/npm not found. Please install Node.js first."
    exit 1
fi

if ! command_exists "pnpm"; then
    echo "❌ pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

if ! command_exists "docker"; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -d "supabase" ]]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Clean up any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
kill_port 8080   # Frontend
kill_port 54321  # Supabase API
kill_port 54322  # Supabase DB
kill_port 54323  # Supabase Studio

echo ""

# Start Supabase services
echo "🗄️  Starting Supabase services..."
npx supabase start

# Wait a moment for Supabase to fully initialize
echo "⏳ Waiting for Supabase to initialize..."
sleep 3

# Check Supabase status
echo ""
echo "📊 Supabase Status:"
npx supabase status
echo ""

# Install dependencies if node_modules doesn't exist
if [[ ! -d "node_modules" ]]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

# Start the frontend development server
echo "🌐 Starting frontend development server..."
echo "📱 Your app will be available at: http://localhost:8080"
echo "🗄️  Supabase Studio: http://localhost:54323"
echo ""
echo "🎯 Test your flight search with:"
echo "   http://localhost:8080/trips/ba85c75a-3087-4141-bccf-d636f77fffbc/v2"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start frontend (this will run in foreground)
pnpm dev
