#!/bin/bash

# MatTailor AI ArgoCD Deployment Script
# This script sets up ArgoCD and deploys MatTailor AI applications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ARGOCD_NAMESPACE="argocd"
GITHUB_REPO="https://github.com/your-org/mattailor-ai"
DOMAIN="mattailor.ai"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    # Check cluster connection
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    # Check kustomize
    if ! command -v kustomize &> /dev/null; then
        log_warning "kustomize not found, using kubectl kustomize"
    fi
    
    log_success "Prerequisites check passed"
}

install_argocd() {
    log_info "Installing ArgoCD..."
    
    # Create namespace
    kubectl create namespace $ARGOCD_NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    
    # Install ArgoCD using kustomize
    if command -v kustomize &> /dev/null; then
        kustomize build install/ | kubectl apply -n $ARGOCD_NAMESPACE -f -
    else
        kubectl apply -k install/ -n $ARGOCD_NAMESPACE
    fi
    
    # Wait for ArgoCD to be ready
    log_info "Waiting for ArgoCD to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n $ARGOCD_NAMESPACE
    kubectl wait --for=condition=available --timeout=300s deployment/argocd-repo-server -n $ARGOCD_NAMESPACE
    kubectl wait --for=condition=ready --timeout=300s pod -l app.kubernetes.io/name=argocd-application-controller -n $ARGOCD_NAMESPACE
    
    log_success "ArgoCD installed successfully"
}

setup_repository_access() {
    log_info "Setting up repository access..."
    
    # Check if repository secret exists
    if kubectl get secret mattailor-ai-repo -n $ARGOCD_NAMESPACE &> /dev/null; then
        log_warning "Repository secret already exists, skipping..."
    else
        log_warning "Please configure repository access in repositories/git-repo-secret.yaml"
        log_warning "Then apply it with: kubectl apply -f repositories/"
    fi
}

create_projects() {
    log_info "Creating ArgoCD projects..."
    
    kubectl apply -f projects/
    
    log_success "Projects created successfully"
}

deploy_applications() {
    log_info "Deploying applications..."
    
    # Apply applications
    kubectl apply -f applications/
    
    log_success "Applications deployed successfully"
}

setup_monitoring() {
    log_info "Setting up monitoring and notifications..."
    
    # Apply notification secrets (if configured)
    if [ -f "repositories/notification-secrets.yaml" ]; then
        kubectl apply -f repositories/notification-secrets.yaml
    else
        log_warning "Notification secrets not configured"
    fi
    
    # Apply network policies
    kubectl apply -f policies/
    
    log_success "Monitoring and policies configured"
}

get_argocd_credentials() {
    log_info "Getting ArgoCD credentials..."
    
    # Get admin password
    ADMIN_PASSWORD=$(kubectl -n $ARGOCD_NAMESPACE get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" 2>/dev/null | base64 -d 2>/dev/null || echo "Secret not found")
    
    echo ""
    echo "======================================"
    echo "         ArgoCD Access Info"
    echo "======================================"
    echo "Username: admin"
    echo "Password: $ADMIN_PASSWORD"
    echo ""
    echo "To access ArgoCD UI:"
    echo "kubectl port-forward svc/argocd-server -n $ARGOCD_NAMESPACE 8080:443"
    echo "Then visit: https://localhost:8080"
    echo ""
    echo "Or configure ingress and visit: https://argocd.$DOMAIN"
    echo "======================================"
    echo ""
}

show_application_status() {
    log_info "Application status:"
    echo ""
    kubectl get applications -n $ARGOCD_NAMESPACE -o wide
    echo ""
}

setup_ingress() {
    log_info "Setting up ingress for ArgoCD..."
    
    cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: $ARGOCD_NAMESPACE
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "GRPC"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - argocd.$DOMAIN
    secretName: argocd-server-tls
  rules:
  - host: argocd.$DOMAIN
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: argocd-server
            port:
              number: 443
EOF
    
    log_success "Ingress configured for https://argocd.$DOMAIN"
}

# Main execution
main() {
    echo "======================================"
    echo "    MatTailor AI ArgoCD Installer"
    echo "======================================"
    echo ""
    
    # Parse command line arguments
    INSTALL_INGRESS=false
    SKIP_APPS=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --with-ingress)
                INSTALL_INGRESS=true
                shift
                ;;
            --skip-apps)
                SKIP_APPS=true
                shift
                ;;
            --domain)
                DOMAIN="$2"
                shift 2
                ;;
            --repo)
                GITHUB_REPO="$2"
                shift 2
                ;;
            -h|--help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --with-ingress    Setup ingress for ArgoCD"
                echo "  --skip-apps       Skip application deployment"
                echo "  --domain DOMAIN   Set domain for ingress (default: mattailor.ai)"
                echo "  --repo REPO       Set GitHub repository URL"
                echo "  -h, --help        Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Execute installation steps
    check_prerequisites
    install_argocd
    setup_repository_access
    create_projects
    
    if [ "$SKIP_APPS" = false ]; then
        deploy_applications
    fi
    
    setup_monitoring
    
    if [ "$INSTALL_INGRESS" = true ]; then
        setup_ingress
    fi
    
    get_argocd_credentials
    
    if [ "$SKIP_APPS" = false ]; then
        show_application_status
    fi
    
    echo ""
    log_success "ArgoCD installation completed!"
    log_info "Next steps:"
    echo "1. Configure repository access in repositories/git-repo-secret.yaml"
    echo "2. Update application repository URLs in applications/"
    echo "3. Configure notifications in repositories/notification-secrets.yaml"
    echo "4. Access ArgoCD UI and sync applications"
    echo ""
}

# Run main function with all arguments
main "$@"