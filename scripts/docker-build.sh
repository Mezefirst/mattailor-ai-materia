#!/bin/bash

# MatTailor AI Docker Build Script
# This script builds and optionally pushes Docker images

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
REGISTRY="ghcr.io"
IMAGE_NAME="${GITHUB_REPOSITORY:-mattailor/mattailor-ai}"
TAG="latest"
PLATFORM="linux/amd64,linux/arm64"
PUSH=false
BUILD_ARGS=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -r|--registry)
      REGISTRY="$2"
      shift 2
      ;;
    -i|--image)
      IMAGE_NAME="$2"
      shift 2
      ;;
    -t|--tag)
      TAG="$2"
      shift 2
      ;;
    -p|--platform)
      PLATFORM="$2"
      shift 2
      ;;
    --push)
      PUSH=true
      shift
      ;;
    --build-arg)
      BUILD_ARGS="$BUILD_ARGS --build-arg $2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo "Options:"
      echo "  -r, --registry    Docker registry [default: ghcr.io]"
      echo "  -i, --image       Image name [default: mattailor/mattailor-ai]"
      echo "  -t, --tag         Image tag [default: latest]"
      echo "  -p, --platform    Target platforms [default: linux/amd64,linux/arm64]"
      echo "  --push            Push image to registry"
      echo "  --build-arg       Build argument (can be used multiple times)"
      echo "  -h, --help        Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo -e "${BLUE}🐳 Building Docker image: ${FULL_IMAGE_NAME}${NC}"
echo -e "${BLUE}📦 Platforms: ${PLATFORM}${NC}"

# Function to check Docker and Buildx
check_docker() {
    echo -e "${YELLOW}🔍 Checking Docker setup...${NC}"
    
    if ! docker --version &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed or not running${NC}"
        exit 1
    fi
    
    if ! docker buildx version &> /dev/null; then
        echo -e "${RED}❌ Docker Buildx is not available${NC}"
        exit 1
    fi
    
    # Create builder if it doesn't exist
    if ! docker buildx inspect mattailor-builder &> /dev/null; then
        echo -e "${YELLOW}🔧 Creating Docker Buildx builder...${NC}"
        docker buildx create --name mattailor-builder --use
    else
        docker buildx use mattailor-builder
    fi
    
    echo -e "${GREEN}✅ Docker setup verified${NC}"
}

# Function to build the image
build_image() {
    echo -e "${YELLOW}🏗️  Building image...${NC}"
    
    # Build command
    BUILD_CMD="docker buildx build"
    BUILD_CMD="$BUILD_CMD --platform $PLATFORM"
    BUILD_CMD="$BUILD_CMD --tag $FULL_IMAGE_NAME"
    BUILD_CMD="$BUILD_CMD $BUILD_ARGS"
    
    if [ "$PUSH" = true ]; then
        BUILD_CMD="$BUILD_CMD --push"
    else
        BUILD_CMD="$BUILD_CMD --load"
    fi
    
    BUILD_CMD="$BUILD_CMD ."
    
    echo -e "${BLUE}🔨 Running: $BUILD_CMD${NC}"
    eval $BUILD_CMD
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Image built successfully${NC}"
    else
        echo -e "${RED}❌ Image build failed${NC}"
        exit 1
    fi
}

# Function to test the image locally
test_image() {
    if [ "$PUSH" = true ]; then
        echo -e "${YELLOW}ℹ️  Skipping local test (image was pushed)${NC}"
        return
    fi
    
    echo -e "${YELLOW}🧪 Testing image locally...${NC}"
    
    # Run container for testing
    CONTAINER_ID=$(docker run -d -p 8080:80 --name mattailor-test $FULL_IMAGE_NAME)
    
    # Wait for container to start
    sleep 10
    
    # Test if application is responding
    if curl -f http://localhost:8080/ &> /dev/null; then
        echo -e "${GREEN}✅ Image test passed${NC}"
    else
        echo -e "${RED}❌ Image test failed${NC}"
        docker logs mattailor-test
        docker stop mattailor-test
        docker rm mattailor-test
        exit 1
    fi
    
    # Cleanup
    docker stop mattailor-test
    docker rm mattailor-test
}

# Function to show image information
show_image_info() {
    echo -e "${BLUE}📋 Image Information:${NC}"
    echo -e "  Registry: ${REGISTRY}"
    echo -e "  Image: ${IMAGE_NAME}"
    echo -e "  Tag: ${TAG}"
    echo -e "  Full name: ${FULL_IMAGE_NAME}"
    echo -e "  Platforms: ${PLATFORM}"
    echo -e "  Push: ${PUSH}"
    
    if [ "$PUSH" = false ]; then
        echo -e "\n${YELLOW}💡 To run the image:${NC}"
        echo -e "  docker run -p 3000:80 ${FULL_IMAGE_NAME}"
    fi
}

# Main execution
main() {
    check_docker
    build_image
    test_image
    show_image_info
    
    echo -e "${GREEN}🎉 Build completed successfully!${NC}"
}

# Run main function
main "$@"