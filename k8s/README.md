# MatTailor AI Kubernetes Deployment

This directory contains Kubernetes manifests and Kustomize overlays for deploying MatTailor AI across different environments.

## Directory Structure

```
k8s/
├── base/                    # Base configurations
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── postgres-deployment.yaml
│   ├── redis-deployment.yaml
│   ├── service.yaml
│   ├── rbac.yaml
│   └── persistent-volume.yaml
├── overlays/
│   ├── development/         # Development environment
│   │   ├── kustomization.yaml
│   │   ├── configmap-patch.yaml
│   │   ├── deployment-patch.yaml
│   │   └── service-patch.yaml
│   ├── staging/             # Staging environment
│   │   ├── kustomization.yaml
│   │   ├── configmap-patch.yaml
│   │   ├── deployment-patch.yaml
│   │   ├── ingress-patch.yaml
│   │   └── hpa.yaml
│   └── production/          # Production environment
│       ├── kustomization.yaml
│       ├── configmap-patch.yaml
│       ├── deployment-patch.yaml
│       ├── ingress-patch.yaml
│       ├── hpa.yaml
│       ├── network-policy.yaml
│       └── service-monitor.yaml
└── README.md
```

## Environment Configurations

### Development
- **Namespace**: `mattailor-ai-dev`
- **Replicas**: 1 for all services
- **Resources**: Minimal resource allocation
- **Ingress**: NodePort services for local access
- **Features**: Debug mode enabled, external APIs disabled

### Staging
- **Namespace**: `mattailor-ai-staging`
- **Replicas**: 2 for frontend/backend, 1 for database/cache
- **Resources**: Moderate resource allocation
- **Ingress**: HTTPS with staging certificates
- **Features**: Production-like configuration, all features enabled
- **Autoscaling**: HPA configured for 2-4 (frontend) and 2-6 (backend) replicas

### Production
- **Namespace**: `mattailor-ai-prod`
- **Replicas**: 3 for frontend/backend, 1 for database/cache
- **Resources**: Full resource allocation with limits
- **Ingress**: HTTPS with production certificates and rate limiting
- **Features**: All features enabled, monitoring, security policies
- **Autoscaling**: HPA configured for 3-10 (frontend) and 3-15 (backend) replicas
- **Security**: Network policies, security contexts, read-only filesystems

## Prerequisites

1. **Kubernetes Cluster**: Access to a Kubernetes cluster
2. **kubectl**: Kubernetes command-line tool
3. **kustomize**: Configuration management tool (built into `kubectl apply -k`)
4. **cert-manager** (staging/production): For TLS certificate management
5. **nginx-ingress** (staging/production): For ingress traffic
6. **prometheus-operator** (production): For monitoring

## Deployment Commands

### Quick Deployment

```bash
# Development
kubectl apply -k k8s/overlays/development

# Staging
kubectl apply -k k8s/overlays/staging

# Production
kubectl apply -k k8s/overlays/production
```

### Using the Deployment Script

```bash
# Make the script executable
chmod +x scripts/deploy.sh

# Preview changes
./scripts/deploy.sh development preview
./scripts/deploy.sh staging preview
./scripts/deploy.sh production preview

# Apply deployment
./scripts/deploy.sh development apply
./scripts/deploy.sh staging apply
./scripts/deploy.sh production apply

# Check status
./scripts/deploy.sh production status

# Delete deployment
./scripts/deploy.sh development delete
```

## Image Management

### Building Images

```bash
# Build frontend image
docker build -f Dockerfile.frontend -t mattailor-ai/frontend:dev .

# Build backend image
docker build -f Dockerfile.backend -t mattailor-ai/backend:dev .

# Tag for different environments
docker tag mattailor-ai/frontend:dev mattailor-ai/frontend:staging
docker tag mattailor-ai/frontend:dev mattailor-ai/frontend:1.0.0
```

### Updating Images

Update the image tags in the respective `kustomization.yaml` files:

```yaml
images:
  - name: mattailor-ai/frontend
    newTag: "1.1.0"
  - name: mattailor-ai/backend
    newTag: "1.1.0"
```

## Configuration Management

### Environment Variables

Each environment has its own `configmap-patch.yaml` with environment-specific configurations:

- **Development**: Debug enabled, local URLs, minimal features
- **Staging**: Production-like settings, staging URLs, all features
- **Production**: Optimized settings, production URLs, full monitoring

### Secrets

Secrets are managed separately and should be created manually:

```bash
# Create secrets for each environment
kubectl create secret generic mattailor-secrets \
  --from-literal=database-password=your-password \
  --from-literal=redis-password=your-redis-password \
  --from-literal=matworld-api-key=your-api-key \
  --from-literal=materials-project-api-key=your-api-key \
  -n mattailor-ai-prod
```

## Monitoring and Observability

### Production Monitoring

The production overlay includes:
- **ServiceMonitor**: Prometheus service discovery
- **NetworkPolicy**: Network security
- **SecurityContext**: Container security
- **Resource Limits**: Performance and stability

### Health Checks

All deployments include:
- **Readiness Probes**: Ensure pods are ready to receive traffic
- **Liveness Probes**: Restart unhealthy pods automatically

## Scaling

### Manual Scaling

```bash
# Scale frontend
kubectl scale deployment prod-mattailor-frontend --replicas=5 -n mattailor-ai-prod

# Scale backend
kubectl scale deployment prod-mattailor-backend --replicas=8 -n mattailor-ai-prod
```

### Horizontal Pod Autoscaling (HPA)

HPA is configured for staging and production environments:
- Scales based on CPU and memory utilization
- Different scaling policies for scale-up and scale-down
- Stabilization windows to prevent flapping

## Troubleshooting

### Common Issues

1. **ImagePullBackOff**: Check image names and registry access
2. **CrashLoopBackOff**: Check application logs and configuration
3. **Pending Pods**: Check resource requests and node capacity

### Debugging Commands

```bash
# Check pod status
kubectl get pods -n mattailor-ai-prod

# View pod logs
kubectl logs deployment/prod-mattailor-backend -n mattailor-ai-prod

# Describe pod for events
kubectl describe pod <pod-name> -n mattailor-ai-prod

# Check configuration
kubectl get configmap mattailor-config -n mattailor-ai-prod -o yaml

# Test connectivity
kubectl exec -it <pod-name> -n mattailor-ai-prod -- sh
```

## Security Considerations

### Production Security Features

1. **Network Policies**: Restrict pod-to-pod communication
2. **Security Contexts**: Run containers as non-root users
3. **Read-only Filesystems**: Prevent runtime modifications
4. **Resource Limits**: Prevent resource exhaustion
5. **TLS Certificates**: Encrypt traffic with cert-manager

### Best Practices

1. Store sensitive data in Kubernetes secrets
2. Use separate namespaces for each environment
3. Implement proper RBAC policies
4. Regular security updates for base images
5. Monitor and alert on security events

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to staging
      run: |
        kubectl apply -k k8s/overlays/staging
      env:
        KUBECONFIG: ${{ secrets.KUBECONFIG }}
```

### ArgoCD Integration

For GitOps deployment, configure ArgoCD applications:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: mattailor-ai-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/mattailor-ai
    targetRevision: HEAD
    path: k8s/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: mattailor-ai-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```