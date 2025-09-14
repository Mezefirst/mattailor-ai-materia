#!/bin/bash

# MatTailor AI Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENTS=("development" "staging" "production")
DEFAULT_ENVIRONMENT="development"

# Functions
print_usage() {
    echo "Usage: $0 [ENVIRONMENT] [OPTIONS]"
    echo ""
    echo "ENVIRONMENTS:"
    echo "  development  - Local development environment"
    echo "  staging      - Staging environment"
    echo "  production   - Production environment"
    echo ""
    echo "OPTIONS:"
    echo "  --build      - Force rebuild of Docker images"
    echo "  --clean      - Clean up existing containers and volumes"
    echo "  --logs       - Show logs after deployment"
    echo "  --help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 development --build"
    echo "  $0 staging --clean --logs"
    echo "  $0 production"
}

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

check_requirements() {
    log_info "Checking requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    log_success "All requirements satisfied"
}

load_environment() {
    local env=$1
    local env_file=".env"
    
    case $env in
        "development")
            env_file=".env.example"
            ;;
        "staging")
            env_file=".env.staging"
            ;;
        "production")
            env_file=".env.production"
            ;;
    esac
    
    if [[ -f $env_file ]]; then
        log_info "Loading environment from $env_file"
        export $(cat $env_file | grep -v '^#' | xargs)
    else
        log_warning "Environment file $env_file not found"
        if [[ $env != "development" ]]; then
            log_error "Environment file is required for $env environment"
            exit 1
        fi
    fi
}

build_images() {
    log_info "Building Docker images..."
    
    # Build frontend
    log_info "Building frontend image..."
    docker build -t mattailor-frontend:latest .
    
    # Build backend (if exists)
    if [[ -f "backend/Dockerfile" ]]; then
        log_info "Building backend image..."
        docker build -t mattailor-backend:latest backend/
    fi
    
    log_success "Docker images built successfully"
}

deploy_development() {
    log_info "Deploying to development environment..."
    
    local compose_file="docker-compose.dev.yml"
    
    if [[ "$BUILD" == "true" ]]; then
        build_images
    fi
    
    if [[ "$CLEAN" == "true" ]]; then
        log_info "Cleaning up existing containers and volumes..."
        docker-compose -f $compose_file down -v --remove-orphans
    fi
    
    log_info "Starting development services..."
    docker-compose -f $compose_file up -d
    
    log_success "Development environment deployed successfully"
    log_info "Frontend: http://localhost:5173"
    log_info "Backend: http://localhost:8000"
}

deploy_staging() {
    log_info "Deploying to staging environment..."
    
    local compose_file="deploy/docker-compose.staging.yml"
    
    if [[ ! -f $compose_file ]]; then
        log_error "Staging compose file not found: $compose_file"
        exit 1
    fi
    
    if [[ "$BUILD" == "true" ]]; then
        build_images
    fi
    
    if [[ "$CLEAN" == "true" ]]; then
        log_info "Cleaning up existing containers and volumes..."
        docker-compose -f $compose_file down -v --remove-orphans
    fi
    
    log_info "Starting staging services..."
    docker-compose -f $compose_file up -d
    
    log_success "Staging environment deployed successfully"
    log_info "Frontend: https://staging.mattailor.ai"
    log_info "Backend: https://api-staging.mattailor.ai"
}

deploy_production() {
    log_info "Deploying to production environment..."
    
    local compose_file="deploy/docker-compose.production.yml"
    
    if [[ ! -f $compose_file ]]; then
        log_error "Production compose file not found: $compose_file"
        exit 1
    fi
    
    # Production safety checks
    log_warning "Deploying to PRODUCTION environment!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled"
        exit 0
    fi
    
    # Check required environment variables
    required_vars=("POSTGRES_PASSWORD" "DOCKER_USERNAME" "MATWEBAPI_KEY" "MP_API_KEY" "OPENAI_API_KEY")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            log_error "Required environment variable $var is not set"
            exit 1
        fi
    done
    
    if [[ "$BUILD" == "true" ]]; then
        build_images
    fi
    
    if [[ "$CLEAN" == "true" ]]; then
        log_warning "Cleaning production environment..."
        read -p "This will delete all production data. Continue? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f $compose_file down -v --remove-orphans
        else
            log_info "Clean cancelled"
        fi
    fi
    
    log_info "Starting production services..."
    docker-compose -f $compose_file up -d
    
    log_success "Production environment deployed successfully"
    log_info "Frontend: https://mattailor.ai"
    log_info "Backend: https://api.mattailor.ai"
    log_info "Monitoring: https://monitoring.mattailor.ai"
    log_info "Dashboards: https://dashboards.mattailor.ai"
}

show_logs() {
    local env=$1
    local compose_file
    
    case $env in
        "development")
            compose_file="docker-compose.dev.yml"
            ;;
        "staging")
            compose_file="deploy/docker-compose.staging.yml"
            ;;
        "production")
            compose_file="deploy/docker-compose.production.yml"
            ;;
    esac
    
    log_info "Showing logs for $env environment..."
    docker-compose -f $compose_file logs -f
}

# Parse arguments
ENVIRONMENT=$DEFAULT_ENVIRONMENT
BUILD="false"
CLEAN="false"
SHOW_LOGS="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        development|staging|production)
            ENVIRONMENT=$1
            shift
            ;;
        --build)
            BUILD="true"
            shift
            ;;
        --clean)
            CLEAN="true"
            shift
            ;;
        --logs)
            SHOW_LOGS="true"
            shift
            ;;
        --help)
            print_usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            print_usage
            exit 1
            ;;
    esac
done

# Validate environment
if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${ENVIRONMENT} " ]]; then
    log_error "Invalid environment: $ENVIRONMENT"
    print_usage
    exit 1
fi

# Main deployment flow
log_info "Starting deployment for $ENVIRONMENT environment..."

check_requirements
load_environment $ENVIRONMENT

case $ENVIRONMENT in
    "development")
        deploy_development
        ;;
    "staging")
        deploy_staging
        ;;
    "production")
        deploy_production
        ;;
esac

if [[ "$SHOW_LOGS" == "true" ]]; then
    show_logs $ENVIRONMENT
fi

log_success "Deployment completed successfully!"