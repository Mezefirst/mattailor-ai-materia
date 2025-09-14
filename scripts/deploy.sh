#!/bin/bash

# MatTailor AI Kubernetes Deployment Script
# Usage: ./scripts/deploy.sh [environment] [action]
# Examples:
#   ./scripts/deploy.sh development apply
#   ./scripts/deploy.sh staging preview
#   ./scripts/deploy.sh production apply

set -e

ENVIRONMENT=${1:-development}
ACTION=${2:-preview}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
K8S_DIR="$ROOT_DIR/k8s"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

echo_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

echo_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate environment
validate_environment() {
    case $ENVIRONMENT in
        development|staging|production)
            echo_info "Environment: $ENVIRONMENT"
            ;;
        *)
            echo_error "Invalid environment: $ENVIRONMENT"
            echo_error "Valid environments: development, staging, production"
            exit 1
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    echo_info "Checking prerequisites..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        echo_error "kubectl is not installed"
        exit 1
    fi
    
    # Check if kustomize is installed
    if ! command -v kustomize &> /dev/null; then
        echo_error "kustomize is not installed"
        exit 1
    fi
    
    # Check kubectl connection
    if ! kubectl cluster-info &> /dev/null; then
        echo_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    echo_success "Prerequisites check passed"
}

# Preview deployment changes
preview_deployment() {
    echo_info "Previewing deployment for $ENVIRONMENT environment..."
    
    local overlay_path="$K8S_DIR/overlays/$ENVIRONMENT"
    
    if [ ! -d "$overlay_path" ]; then
        echo_error "Overlay directory not found: $overlay_path"
        exit 1
    fi
    
    echo_info "Generated manifests:"
    kubectl kustomize "$overlay_path"
}

# Apply deployment
apply_deployment() {
    echo_info "Deploying to $ENVIRONMENT environment..."
    
    local overlay_path="$K8S_DIR/overlays/$ENVIRONMENT"
    
    if [ ! -d "$overlay_path" ]; then
        echo_error "Overlay directory not found: $overlay_path"
        exit 1
    fi
    
    # Create namespace if it doesn't exist
    local namespace
    case $ENVIRONMENT in
        development)
            namespace="mattailor-ai-dev"
            ;;
        staging)
            namespace="mattailor-ai-staging"
            ;;
        production)
            namespace="mattailor-ai-prod"
            ;;
    esac
    
    kubectl create namespace "$namespace" --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply the deployment
    kubectl apply -k "$overlay_path"
    
    echo_success "Deployment applied successfully"
    
    # Wait for rollout
    echo_info "Waiting for deployment rollout..."
    kubectl rollout status deployment -n "$namespace" --timeout=300s
    
    echo_success "Deployment completed successfully"
}

# Delete deployment
delete_deployment() {
    echo_warning "Deleting deployment from $ENVIRONMENT environment..."
    
    local overlay_path="$K8S_DIR/overlays/$ENVIRONMENT"
    
    if [ ! -d "$overlay_path" ]; then
        echo_error "Overlay directory not found: $overlay_path"
        exit 1
    fi
    
    read -p "Are you sure you want to delete the $ENVIRONMENT deployment? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kubectl delete -k "$overlay_path"
        echo_success "Deployment deleted successfully"
    else
        echo_info "Deployment deletion cancelled"
    fi
}

# Get deployment status
get_status() {
    echo_info "Getting deployment status for $ENVIRONMENT environment..."
    
    local namespace
    case $ENVIRONMENT in
        development)
            namespace="mattailor-ai-dev"
            ;;
        staging)
            namespace="mattailor-ai-staging"
            ;;
        production)
            namespace="mattailor-ai-prod"
            ;;
    esac
    
    echo_info "Deployments:"
    kubectl get deployments -n "$namespace"
    
    echo_info "Pods:"
    kubectl get pods -n "$namespace"
    
    echo_info "Services:"
    kubectl get services -n "$namespace"
    
    if [ "$ENVIRONMENT" != "development" ]; then
        echo_info "Ingress:"
        kubectl get ingress -n "$namespace"
        
        echo_info "HPA:"
        kubectl get hpa -n "$namespace"
    fi
}

# Main script
main() {
    echo_info "MatTailor AI Kubernetes Deployment Script"
    echo_info "Environment: $ENVIRONMENT, Action: $ACTION"
    
    validate_environment
    check_prerequisites
    
    case $ACTION in
        preview)
            preview_deployment
            ;;
        apply)
            apply_deployment
            ;;
        delete)
            delete_deployment
            ;;
        status)
            get_status
            ;;
        *)
            echo_error "Invalid action: $ACTION"
            echo_error "Valid actions: preview, apply, delete, status"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"