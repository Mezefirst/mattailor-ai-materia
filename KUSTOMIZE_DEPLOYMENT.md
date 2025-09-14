# MatTailor AI Kubernetes Deployment with Kustomize

This guide provides comprehensive instructions for deploying MatTailor AI to different environments using Kustomize overlays and modern GitOps practices.

## Overview

Our deployment strategy uses Kustomize to manage environment-specific configurations while maintaining a single source of truth for base configurations. This approach provides:

- **Environment Isolation**: Separate namespaces and configurations
- **Configuration Management**: Environment-specific variables and resources
- **Scalability**: Different scaling policies per environment
- **Security**: Progressive security hardening from dev to production
- **GitOps Ready**: Compatible with ArgoCD and other GitOps tools

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│                 │    │                 │    │                 │
│ • 1 replica     │    │ • 2 replicas    │    │ • 3+ replicas   │
│ • NodePort      │    │ • Ingress+TLS   │    │ • Ingress+TLS   │
│ • Debug mode    │    │ • Production-   │    │ • Full security │
│ • Local storage │    │   like config   │    │ • Monitoring    │
│ • No monitoring │    │ • HPA enabled   │    │ • Network       │
│                 │    │ • Basic monitor │    │   policies      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start

### Prerequisites

1. **Kubernetes Cluster** - Access to a Kubernetes cluster (v1.20+)
2. **kubectl** - Kubernetes command-line tool
3. **kustomize** - Configuration management tool (included in kubectl)
4. **Docker** - For building container images
5. **make** - For using provided automation scripts

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mattailor-ai.git
cd mattailor-ai

# Install dependencies
make install-deps

# Verify cluster connection
kubectl cluster-info
```

## Environment Configurations

### Development Environment

**Purpose**: Local development and testing
**Namespace**: `mattailor-ai-dev`

```bash
# Deploy to development
make dev-deploy

# Or manually
kubectl apply -k k8s/overlays/development

# Check status
make dev-status
```

**Features**:
- Single replica for all services
- NodePort services for local access
- Debug logging enabled
- Minimal resource allocation
- External APIs disabled for safety

### Staging Environment

**Purpose**: Pre-production testing and validation
**Namespace**: `mattailor-ai-staging`

```bash
# Deploy to staging
make staging-deploy

# Or manually
kubectl apply -k k8s/overlays/staging

# Check status
make staging-status
```

**Features**:
- 2 replicas for frontend/backend
- HTTPS ingress with staging certificates
- Production-like configuration
- Horizontal Pod Autoscaling (HPA)
- All features enabled for testing

### Production Environment

**Purpose**: Live production workloads
**Namespace**: `mattailor-ai-prod`

```bash
# Deploy to production (requires confirmation)
make prod-deploy

# Or manually
kubectl apply -k k8s/overlays/production

# Check status
make prod-status
```

**Features**:
- 3+ replicas with advanced autoscaling
- Production TLS certificates
- Network security policies
- Comprehensive monitoring
- Security contexts and read-only filesystems
- Resource limits and requests

## Deployment Methods

### Method 1: Using Make (Recommended)

```bash
# Build and deploy
make build ENV=staging
make push ENV=staging
make deploy ENV=staging

# Quick development deployment
make dev-deploy

# Production deployment with validation
make validate ENV=production
make prod-deploy
```

### Method 2: Direct kubectl

```bash
# Preview changes
kubectl kustomize k8s/overlays/production

# Apply deployment
kubectl apply -k k8s/overlays/production

# Check rollout status
kubectl rollout status deployment/prod-mattailor-frontend -n mattailor-ai-prod
```

### Method 3: Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Preview deployment
./scripts/deploy.sh production preview

# Apply deployment
./scripts/deploy.sh production apply

# Check status
./scripts/deploy.sh production status
```

## Image Management

### Building Images

```bash
# Build all images
make build IMAGE_TAG=v1.2.0

# Build specific components
make build-frontend IMAGE_TAG=v1.2.0
make build-backend IMAGE_TAG=v1.2.0

# Push to registry
make push IMAGE_TAG=v1.2.0
```

### Registry Configuration

Update the registry URL in your environment:

```bash
# Set registry
export REGISTRY=ghcr.io/your-org/mattailor-ai

# Or update Makefile
REGISTRY ?= your-registry.com/mattailor-ai
```

### Image Tag Strategy

- **Development**: `dev`, `feature-branch-name`
- **Staging**: `staging`, `rc-v1.2.0`
- **Production**: `latest`, `v1.2.0`, `stable`

## Configuration Management

### Environment Variables

Each environment has specific configuration in `configmap-patch.yaml`:

```yaml
# Development
ENVIRONMENT: "development"
DEBUG: "true"
VITE_API_URL: "http://localhost:8000"

# Staging  
ENVIRONMENT: "staging"
DEBUG: "false"
VITE_API_URL: "https://api-staging.mattailor.ai"

# Production
ENVIRONMENT: "production"
DEBUG: "false"
VITE_API_URL: "https://api.mattailor.ai"
```

### Secrets Management

Create secrets for each environment:

```bash
# Development
kubectl create secret generic mattailor-secrets \
  --from-literal=database-password=dev-password \
  --from-literal=redis-password=dev-redis \
  --from-literal=matworld-api-key=dev-key \
  -n mattailor-ai-dev

# Production
kubectl create secret generic mattailor-secrets \
  --from-literal=database-password=secure-prod-password \
  --from-literal=redis-password=secure-redis-password \
  --from-literal=matworld-api-key=prod-api-key \
  -n mattailor-ai-prod
```

## Scaling and Performance

### Manual Scaling

```bash
# Scale frontend
make scale-frontend ENV=production REPLICAS=5

# Scale backend
make scale-backend ENV=production REPLICAS=8

# Or use kubectl directly
kubectl scale deployment/prod-mattailor-frontend --replicas=5 -n mattailor-ai-prod
```

### Horizontal Pod Autoscaling (HPA)

HPA is configured for staging and production:

```yaml
# Production HPA example
minReplicas: 3
maxReplicas: 15
targetCPUUtilizationPercentage: 70
targetMemoryUtilizationPercentage: 80
```

Monitor HPA status:

```bash
kubectl get hpa -n mattailor-ai-prod
kubectl describe hpa prod-mattailor-backend-hpa -n mattailor-ai-prod
```

## Monitoring and Observability

### Health Checks

```bash
# Run health checks
make health-check ENV=production

# Manual health check
kubectl exec deployment/prod-mattailor-backend -n mattailor-ai-prod -- \
  curl -f http://localhost:8000/health
```

### Logs

```bash
# View frontend logs
make logs-frontend ENV=production

# View backend logs  
make logs-backend ENV=production

# Or use kubectl
kubectl logs -f deployment/prod-mattailor-backend -n mattailor-ai-prod
```

### Metrics (Production)

Production includes ServiceMonitor for Prometheus:

```bash
# View service monitors
kubectl get servicemonitor -n mattailor-ai-prod

# Check metrics endpoint
kubectl port-forward svc/prod-mattailor-backend-service 8000:8000 -n mattailor-ai-prod
curl http://localhost:8000/metrics
```

## Security

### Network Policies

Production includes network policies that:
- Restrict ingress to nginx-ingress namespace
- Allow pod-to-pod communication within namespace
- Block unauthorized external access

```bash
# View network policies
kubectl get networkpolicy -n mattailor-ai-prod
kubectl describe networkpolicy mattailor-network-policy -n mattailor-ai-prod
```

### Security Contexts

Production deployments run with:
- Non-root user (UID 1001)
- Read-only root filesystem
- Dropped capabilities
- Security scanning with Trivy

### TLS Certificates

Staging and production use cert-manager for TLS:

```bash
# Check certificates
kubectl get certificates -n mattailor-ai-prod
kubectl describe certificate mattailor-prod-tls -n mattailor-ai-prod
```

## CI/CD Integration

### GitHub Actions

The included workflow (`.github/workflows/deploy-k8s.yml`) provides:

- **Automated builds** on push to main/staging/develop
- **Multi-environment deployment** based on branch
- **Security scanning** with Trivy
- **Rollback capabilities** on failure
- **Slack notifications** for important events

### ArgoCD GitOps

ArgoCD applications are provided in `k8s/argocd/`:

```bash
# Apply ArgoCD applications
kubectl apply -f k8s/argocd/application-dev.yaml
kubectl apply -f k8s/argocd/application-staging.yaml
kubectl apply -f k8s/argocd/application-prod.yaml

# View ArgoCD applications
kubectl get applications -n argocd
```

## Troubleshooting

### Common Issues

1. **ImagePullBackOff**
```bash
# Check image name and registry access
kubectl describe pod <pod-name> -n <namespace>
kubectl get events -n <namespace> --sort-by='.lastTimestamp'
```

2. **CrashLoopBackOff**
```bash
# Check application logs
kubectl logs <pod-name> -n <namespace> --previous
kubectl describe pod <pod-name> -n <namespace>
```

3. **Service Unavailable**
```bash
# Check service endpoints
kubectl get endpoints -n <namespace>
kubectl describe service <service-name> -n <namespace>
```

### Debugging Commands

```bash
# Get pod details
kubectl get pods -n mattailor-ai-prod -o wide

# Check resource usage
kubectl top pods -n mattailor-ai-prod
kubectl top nodes

# Describe problematic resources
kubectl describe deployment/prod-mattailor-backend -n mattailor-ai-prod

# Execute into pod for debugging
kubectl exec -it <pod-name> -n mattailor-ai-prod -- sh
```

### Rollback Procedures

```bash
# Quick rollback using make
make rollback ENV=production

# Manual rollback
kubectl rollout undo deployment/prod-mattailor-frontend -n mattailor-ai-prod
kubectl rollout undo deployment/prod-mattailor-backend -n mattailor-ai-prod

# Check rollout history
kubectl rollout history deployment/prod-mattailor-backend -n mattailor-ai-prod

# Rollback to specific revision
kubectl rollout undo deployment/prod-mattailor-backend --to-revision=2 -n mattailor-ai-prod
```

## Cleanup

### Remove Specific Environment

```bash
# Using make (with confirmation)
make delete ENV=development

# Direct kubectl
kubectl delete -k k8s/overlays/development
```

### Complete Cleanup

```bash
# Remove all environments
kubectl delete namespace mattailor-ai-dev
kubectl delete namespace mattailor-ai-staging  
kubectl delete namespace mattailor-ai-prod

# Clean Docker images
make clean
```

## Best Practices

### Development Workflow

1. **Feature Development**: Deploy to development environment
2. **Testing**: Promote to staging for integration testing
3. **Production Release**: Deploy to production with proper validation

### Security Best Practices

1. **Secrets**: Never commit secrets to git
2. **Images**: Regular security scanning
3. **Network**: Use network policies in production
4. **Access**: Implement proper RBAC
5. **Updates**: Keep base images updated

### Monitoring Best Practices

1. **Health Checks**: Configure proper readiness/liveness probes
2. **Metrics**: Export application metrics
3. **Logging**: Structured logging with appropriate levels
4. **Alerting**: Set up alerts for critical failures

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review Kubernetes events: `kubectl get events`
3. Check application logs: `kubectl logs`
4. Consult the team documentation
5. Create an issue in the repository

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kustomize Documentation](https://kustomize.io/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)