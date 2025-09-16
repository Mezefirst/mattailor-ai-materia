#!/bin/bash

# Docker Test Script for MatTailor AI
# Tests that the application builds and runs without API keys

set -e

echo "🧪 Testing MatTailor AI Docker Deployment"
echo "========================================="

# Clean up any existing containers
echo "Cleaning up existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true
docker rm -f mattailor-ai-test 2>/dev/null || true

# Test 1: Frontend build without API keys
echo "📦 Test 1: Building frontend without API keys..."
if docker build -t mattailor-ai-test . --no-cache; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Test 2: Run container and check if it starts
echo "🚀 Test 2: Running container..."
docker run -d --name mattailor-ai-test -p 3001:80 mattailor-ai-test

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Test 3: Check if application is responding
echo "🔍 Test 3: Testing application response..."
if curl -f -s http://localhost:3001/health > /dev/null; then
    echo "✅ Application health check passed"
else
    echo "⚠️  Health check endpoint not available (nginx default)"
    # Try main page instead
    if curl -f -s http://localhost:3001/ > /dev/null; then
        echo "✅ Application main page accessible"
    else
        echo "❌ Application not responding"
        docker logs mattailor-ai-test
        exit 1
    fi
fi

# Test 4: Check container status
echo "📊 Test 4: Checking container status..."
if docker ps | grep -q mattailor-ai-test; then
    echo "✅ Container is running"
else
    echo "❌ Container not running"
    docker logs mattailor-ai-test
    exit 1
fi

# Cleanup
echo "🧹 Cleaning up test containers..."
docker stop mattailor-ai-test
docker rm mattailor-ai-test
docker rmi mattailor-ai-test

echo ""
echo "🎉 All tests passed!"
echo "✅ MatTailor AI builds and runs successfully without API keys"
echo "✅ Application is ready for Docker deployment"
echo ""
echo "To deploy:"
echo "  docker-compose up -d"
echo ""
echo "To run with API keys:"
echo "  export MATWEB_API_KEY='your-key'"
echo "  export MATERIALS_PROJECT_API_KEY='your-key'"
echo "  docker-compose up -d"