#!/bin/bash

# Start mock Google OAuth server in background
echo "🚀 Starting mock Google OAuth server..."
node mocks/google-oauth/server.cjs &
MOCK_SERVER_PID=$!

# Wait for server to start
sleep 2

# Run OAuth tests with mock mode
echo "🧪 Running OAuth tests with mock server..."
MOCK_GOOGLE_OAUTH=true pnpm run test:auth

# Capture test exit code
TEST_EXIT_CODE=$?

# Kill mock server
echo "🛑 Stopping mock server..."
kill $MOCK_SERVER_PID

# Exit with test result
exit $TEST_EXIT_CODE
