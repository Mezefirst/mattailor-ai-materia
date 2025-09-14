#!/bin/bash

# MatTailor AI Deployment Script
# This script handles deployment to various environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
IMAGE_TAG="latest"
REGISTRY="ghcr.io"
NAMESPACE="mattailor"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    -t|--tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    -r|--registry)
      REGISTRY="$2"
      shift 2
      ;;
    -n|--namespace)
      NAMESPACE="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo "Options:"
      echo "  -e, --environment  Environment to deploy to (staging|production) [default: production]"
      echo "  -t, --tag         Docker image tag [default: latest]"
      echo "  -r, --registry    Docker registry [default: ghcr.io]"
      echo "  -n, --namespace   Kubernetes namespace [default: mattailor]"
      echo "  -h, --help        Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}🚀 Starting deployment to ${ENVIRONMENT}${NC}"
echo -e "${BLUE}📦 Image: ${REGISTRY}/${GITHUB_REPOSITORY:-mattailor/mattailor-ai}:${IMAGE_TAG}${NC}"

# Function to check if required tools are installed
check_requirements() {
    echo -e "${YELLOW}🔍 Checking requirements...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        echo -e "${YELLOW}⚠️  kubectl not found, Kubernetes deployment will be skipped${NC}"
    fi
    
    echo -e "${GREEN}✅ Requirements check passed${NC}"
}

# Function to deploy using Docker Compose
deploy_docker_compose() {
    echo -e "${YELLOW}🐳 Deploying with Docker Compose...${NC}"
    
    # Set environment variables
    export MATTAILOR_IMAGE="${REGISTRY}/${GITHUB_REPOSITORY:-mattailor/mattailor-ai}:${IMAGE_TAG}"
    export ENVIRONMENT="${ENVIRONMENT}"
    
    # Choose the right compose file
    COMPOSE_FILE="docker-compose.yml"
    if [[ "${ENVIRONMENT}" == "staging" ]]; then
        COMPOSE_FILE="docker-compose.staging.yml"
    fi
    
    # Pull latest images
    docker-compose -f "${COMPOSE_FILE}" pull
    
    # Deploy
    docker-compose -f "${COMPOSE_FILE}" up -d
    
    # Wait for services to be ready
    echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
    sleep 10
    
    # Health check
    if curl -f http://localhost:3000/health &> /dev/null; then
        echo -e "${GREEN}✅ Application is healthy${NC}"
    else
        echo -e "${RED}❌ Health check failed${NC}"
        docker-compose -f "${COMPOSE_FILE}" logs
        exit 1
    fi
}

# Function to deploy to Kubernetes
deploy_kubernetes() {
    echo -e "${YELLOW}☸️  Deploying to Kubernetes...${NC}"
    
    # Check if kubectl is configured
    if ! kubectl cluster-info &> /dev/null; then
        echo -e "${RED}❌ kubectl is not configured or cluster is not accessible${NC}"
        exit 1
    fi
    
    # Create namespace if it doesn't exist
    kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply Kubernetes manifests
    envsubst < k8s/deployment.yaml | kubectl apply -f -
    envsubst < k8s/service.yaml | kubectl apply -f -
    envsubst < k8s/ingress.yaml | kubectl apply -f -
    
    # Wait for rollout to complete
    kubectl rollout status deployment/mattailor-frontend -n "${NAMESPACE}" --timeout=300s
    
    echo -e "${GREEN}✅ Kubernetes deployment completed${NC}"
}

# Function to deploy to cloud platforms
deploy_cloud() {
    case "${ENVIRONMENT}" in
        "vercel")
            echo -e "${YELLOW}🌐 Deploying to Vercel...${NC}"
            npx vercel --prod
            ;;
        "netlify")
            echo -e "${YELLOW}🌐 Deploying to Netlify...${NC}"
            npx netlify deploy --prod --dir=dist
            ;;
        "railway")
            echo -e "${YELLOW}🚂 Deploying to Railway...${NC}"
            railway deploy
            ;;
        *)
            echo -e "${YELLOW}ℹ️  No specific cloud deployment configured for ${ENVIRONMENT}${NC}"
            ;;
    esac
}

# Function to run post-deployment tests
run_tests() {
    echo -e "${YELLOW}🧪 Running post-deployment tests...${NC}"
    
    # Basic health check
    if curl -f http://localhost:3000/ &> /dev/null; then
        echo -e "${GREEN}✅ Basic health check passed${NC}"
    else
        echo -e "${RED}❌ Basic health check failed${NC}"
        return 1
    fi
    
    # Additional tests can be added here
    echo -e "${GREEN}✅ All tests passed${NC}"
}

# Function to send notifications
send_notifications() {
    echo -e "${YELLOW}📢 Sending deployment notifications...${NC}"
    
    # Slack notification (if webhook is configured)
    if [[ -n "${SLACK_WEBHOOK_URL}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 MatTailor AI deployed to ${ENVIRONMENT} with tag ${IMAGE_TAG}\"}" \
            "${SLACK_WEBHOOK_URL}"
    fi
    
    # Discord notification (if webhook is configured)
    if [[ -n "${DISCORD_WEBHOOK_URL}" ]]; then
        curl -H "Content-Type: application/json" \
            -d "{\"content\":\"🚀 MatTailor AI deployed to ${ENVIRONMENT} with tag ${IMAGE_TAG}\"}" \
            "${DISCORD_WEBHOOK_URL}"
    fi
    
    echo -e "${GREEN}✅ Notifications sent${NC}"
}

# Main deployment flow
main() {
    check_requirements
    
    case "${ENVIRONMENT}" in
        "staging"|"production")
            if command -v kubectl &> /dev/null && [[ -n "${KUBERNETES_CLUSTER}" ]]; then
                deploy_kubernetes
            else
                deploy_docker_compose
            fi
            ;;
        "vercel"|"netlify"|"railway")
            deploy_cloud
            ;;
        *)
            echo -e "${RED}❌ Unknown environment: ${ENVIRONMENT}${NC}"
            echo "Supported environments: staging, production, vercel, netlify, railway"
            exit 1
            ;;
    esac
    
    run_tests
    send_notifications
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
}

# Run main function
main "$@"