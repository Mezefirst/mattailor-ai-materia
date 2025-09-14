#!/bin/bash

# MatTailor AI Kubernetes Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="mattailor-ai"
FRONTEND_IMAGE="mattailor-ai/frontend"
BACKEND_IMAGE="mattailor-ai/backend"
REGISTRY="your-registry.com"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "docker is not installed"
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        log_error "kubectl is not connected to a cluster"
        exit 1
    fi
    
    log_info "Prerequisites check passed"
}

build_images() {
    log_info "Building container images..."
    
    # Build frontend image
    log_info "Building frontend image..."
    docker build -f Dockerfile.frontend -t ${FRONTEND_IMAGE}:latest .
    docker tag ${FRONTEND_IMAGE}:latest ${REGISTRY}/${FRONTEND_IMAGE}:latest
    
    # Build backend image
    log_info "Building backend image..."
    docker build -f Dockerfile.backend -t ${BACKEND_IMAGE}:latest .
    docker tag ${BACKEND_IMAGE}:latest ${REGISTRY}/${BACKEND_IMAGE}:latest
    
    log_info "Images built successfully"
}

push_images() {
    log_info "Pushing images to registry..."
    
    docker push ${REGISTRY}/${FRONTEND_IMAGE}:latest
    docker push ${REGISTRY}/${BACKEND_IMAGE}:latest
    
    log_info "Images pushed successfully"
}

create_secrets() {
    log_info "Creating secrets..."
    
    if [ -z "$DATABASE_URL" ]; then
        log_warn "DATABASE_URL not set, using placeholder"
        DATABASE_URL="postgresql://user:pass@localhost:5432/mattailor"
    fi
    
    if [ -z "$MATPROJECT_API_KEY" ]; then
        log_warn "MATPROJECT_API_KEY not set, using placeholder"
        MATPROJECT_API_KEY="your-matproject-api-key"
    fi
    
    if [ -z "$MATWEB_API_KEY" ]; then
        log_warn "MATWEB_API_KEY not set, using placeholder"
        MATWEB_API_KEY="your-matweb-api-key"
    fi
    
    if [ -z "$OPENAI_API_KEY" ]; then
        log_warn "OPENAI_API_KEY not set, using placeholder"
        OPENAI_API_KEY="your-openai-api-key"
    fi
    
    # Create secrets manifest
    cat > k8s/secrets-generated.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: mattailor-secrets
  namespace: ${NAMESPACE}
type: Opaque
data:
  database-url: $(echo -n "$DATABASE_URL" | base64)
  matproject-api-key: $(echo -n "$MATPROJECT_API_KEY" | base64)
  matweb-api-key: $(echo -n "$MATWEB_API_KEY" | base64)
  openai-api-key: $(echo -n "$OPENAI_API_KEY" | base64)
EOF
    
    log_info "Secrets configuration created"
}

deploy_application() {
    log_info "Deploying application to Kubernetes..."
    
    # Apply namespace first
    kubectl apply -f k8s/namespace.yaml
    
    # Apply secrets
    if [ -f "k8s/secrets-generated.yaml" ]; then
        kubectl apply -f k8s/secrets-generated.yaml
    else
        log_warn "Using template secrets - update with real values"
        kubectl apply -f k8s/secrets.yaml
    fi
    
    # Apply all other manifests
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/rbac.yaml
    kubectl apply -f k8s/persistent-volume.yaml
    kubectl apply -f k8s/frontend-deployment.yaml
    kubectl apply -f k8s/backend-deployment.yaml
    kubectl apply -f k8s/ingress.yaml
    kubectl apply -f k8s/hpa.yaml
    kubectl apply -f k8s/network-policy.yaml
    
    # Apply monitoring if available
    if kubectl get crd servicemonitors.monitoring.coreos.com &> /dev/null; then
        kubectl apply -f k8s/service-monitor.yaml
        log_info "ServiceMonitor applied"
    else
        log_warn "Prometheus Operator not detected, skipping ServiceMonitor"
    fi
    
    log_info "Application deployed successfully"
}

wait_for_deployment() {
    log_info "Waiting for deployments to be ready..."
    
    kubectl wait --for=condition=available --timeout=300s deployment/mattailor-frontend -n ${NAMESPACE}
    kubectl wait --for=condition=available --timeout=300s deployment/mattailor-backend -n ${NAMESPACE}
    
    log_info "Deployments are ready"
}

show_status() {
    log_info "Deployment status:"
    
    echo ""
    echo "Pods:"
    kubectl get pods -n ${NAMESPACE}
    
    echo ""
    echo "Services:"
    kubectl get svc -n ${NAMESPACE}
    
    echo ""
    echo "Ingress:"
    kubectl get ingress -n ${NAMESPACE}
    
    echo ""
    echo "HPA:"
    kubectl get hpa -n ${NAMESPACE}
}

cleanup() {
    log_info "Cleaning up generated files..."
    rm -f k8s/secrets-generated.yaml
}

# Main execution
main() {
    case "${1:-deploy}" in
        "build")
            check_prerequisites
            build_images
            ;;
        "push")
            check_prerequisites
            push_images
            ;;
        "deploy")
            check_prerequisites
            create_secrets
            deploy_application
            wait_for_deployment
            show_status
            cleanup
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            log_info "Deleting application from Kubernetes..."
            kubectl delete namespace ${NAMESPACE} --ignore-not-found=true
            log_info "Cleanup completed"
            ;;
        *)
            echo "Usage: $0 {build|push|deploy|status|cleanup}"
            echo ""
            echo "Commands:"
            echo "  build   - Build container images"
            echo "  push    - Push images to registry"
            echo "  deploy  - Deploy to Kubernetes (default)"
            echo "  status  - Show deployment status"
            echo "  cleanup - Remove application from cluster"
            exit 1
            ;;
    esac
}

# Trap to cleanup on exit
trap cleanup EXIT

# Run main function
main "$@"