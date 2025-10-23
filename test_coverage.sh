#!/bin/bash

# Test Coverage Script for Asset Pulse Web
# This script runs all tests and generates coverage reports

set -e

echo "🧪 Running Asset Pulse Web Tests with Coverage..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the asset-pulse-web directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Clean previous coverage files
print_status "Cleaning previous coverage files..."
rm -rf coverage

# Run tests with coverage
print_status "Running tests with coverage..."
npm run test:coverage

# Check if coverage directory was created
if [ ! -d "coverage" ]; then
    print_error "Coverage directory not created. Tests may have failed."
    exit 1
fi

# Check coverage percentage
if [ -f "coverage/coverage-summary.json" ]; then
    COVERAGE=$(node -p "require('./coverage/coverage-summary.json').total.lines.pct")
    print_status "Total coverage: ${COVERAGE}%"
    
    # Check if coverage meets minimum requirement (70%)
    if (( $(echo "$COVERAGE >= 70" | bc -l) )); then
        print_status "✅ Coverage meets minimum requirement (70%)"
    else
        print_warning "⚠️  Coverage is below minimum requirement (70%)"
    fi
else
    print_warning "Coverage summary not found"
fi

# Show detailed coverage by file
print_status "Coverage by file:"
if [ -f "coverage/coverage-summary.json" ]; then
    node -p "
    const coverage = require('./coverage/coverage-summary.json');
    Object.keys(coverage).forEach(file => {
        if (file !== 'total') {
            const stats = coverage[file];
            console.log(\`\${file}: \${stats.lines.pct}%\`);
        }
    });
    "
fi

# Open coverage report if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_status "Opening coverage report in browser..."
    open coverage/index.html
fi

print_status "Test coverage analysis complete!"
print_status "Coverage report saved in: coverage/"
print_status "HTML report: coverage/index.html"
