#!/bin/bash

# MatTailor AI - Deployment Test Script
# Tests the automated deployment pipeline locally

set -e

echo "🧪 MatTailor AI - Deployment Pipeline Test"
echo "=========================================="

# Check dependencies
echo "📋 Checking dependencies..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

echo "✅ Dependencies check passed"

# Build Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -t mattailor-ai:test .

# Test image
echo ""
echo "🧪 Testing Docker image..."
docker run --rm -d --name mattailor-ai-test -p 3001:80 mattailor-ai:test

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Health check
echo "🩺 Performing health check..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    docker logs mattailor-ai-test
    docker stop mattailor-ai-test
    exit 1
fi

# Test main application
echo "🌐 Testing main application..."
if curl -s http://localhost:3001 | grep -q "MatTailor AI"; then
    echo "✅ Application is serving content"
else
    echo "❌ Application test failed"
    docker logs mattailor-ai-test
    docker stop mattailor-ai-test
    exit 1
fi

# Cleanup
echo "🧹 Cleaning up..."
docker stop mattailor-ai-test

echo ""
echo "🎉 All tests passed!"
echo ""
echo "📝 Test results:"
echo "   ✅ Docker image builds successfully"
echo "   ✅ Container starts without errors"
echo "   ✅ Health check endpoint responds"
echo "   ✅ Application serves content"
echo ""
echo "🚀 Ready for deployment!"