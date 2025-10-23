#!/bin/bash

# E2E Test Runner for Asset Pulse
# This script runs end-to-end tests for the entire application

set -e

echo "🚀 Running Asset Pulse E2E Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the asset-pulse-web directory"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    print_step "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_status "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start after $max_attempts attempts"
    return 1
}

# Check if backend is running
if ! check_port 8080; then
    print_step "Starting backend API..."
    cd ../asset-pulse-api
    
    # Start backend in background
    go run main.go &
    BACKEND_PID=$!
    
    # Wait for backend to be ready
    if ! wait_for_service "http://localhost:8080/health" "Backend API"; then
        print_error "Failed to start backend API"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    cd ../asset-pulse-web
else
    print_status "Backend API is already running on port 8080"
fi

# Check if frontend is running
if ! check_port 3000; then
    print_step "Starting frontend application..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend in background
    npm run dev &
    FRONTEND_PID=$!
    
    # Wait for frontend to be ready
    if ! wait_for_service "http://localhost:3000" "Frontend Application"; then
        print_error "Failed to start frontend application"
        kill $FRONTEND_PID 2>/dev/null || true
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
else
    print_status "Frontend application is already running on port 3000"
fi

# Install Playwright if needed
if [ ! -d "node_modules/@playwright" ]; then
    print_step "Installing Playwright..."
    npm install @playwright/test
    npx playwright install
fi

# Run E2E tests
print_step "Running E2E tests..."
npx playwright test

# Check test results
if [ $? -eq 0 ]; then
    print_status "✅ All E2E tests passed!"
else
    print_error "❌ Some E2E tests failed!"
fi

# Cleanup
print_step "Cleaning up..."
if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null || true
fi
if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null || true
fi

print_status "E2E test run completed!"
print_status "Test results are available in: playwright-report/"
print_status "To view the report: npx playwright show-report"
