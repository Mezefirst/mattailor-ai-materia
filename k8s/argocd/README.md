# ArgoCD GitOps Configuration for MatTailor AI

This directory contains ArgoCD configurations for automated GitOps deployments of MatTailor AI across multiple environments.

## Quick Setup

### 1. Install ArgoCD
```bash
# Create ArgoCD namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Or use our custom installation with additional configs
kubectl apply -n argocd -f install/
```

### 2. Access ArgoCD UI
```bash
# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### 3. Configure Repository Access
```bash
# Apply repository credentials (update with your Git repo details)
kubectl apply -f repositories/
```

### 4. Deploy Applications
```bash
# Deploy all environments
kubectl apply -f applications/

# Or deploy specific environment
kubectl apply -f applications/mattailor-dev.yaml
```

## Application Structure

### Environments
- **Development** (`application-dev.yaml`) - Auto-sync enabled, fast iteration
- **Staging** (`application-staging.yaml`) - Manual sync, testing environment  
- **Production** (`application-prod.yaml`) - Manual sync with approvals

### Features
- **Multi-environment deployment** with Kustomize overlays
- **Automated syncing** for development
- **Manual approval gates** for production
- **Health monitoring** and rollback capabilities
- **Secret management** with sealed secrets
- **Resource pruning** and self-healing

## Repository Structure Expected

```
your-repo/
├── k8s/
│   ├── base/                 # Base Kubernetes manifests
│   ├── overlays/
│   │   ├── dev/             # Development overrides
│   │   ├── staging/         # Staging overrides
│   │   └── prod/            # Production overrides
│   └── argocd/              # ArgoCD configurations
├── Dockerfile               # Application container
└── ...
```

## Customization

### Repository Configuration
Update `repositories/git-repo-secret.yaml` with your Git repository details:
- Repository URL
- SSH private key or HTTPS credentials
- Branch/tag preferences

### Application Configuration
Modify application YAML files to match your:
- Repository URL and path
- Target clusters
- Sync policies
- Resource requirements

### Notifications
Configure notifications in `config/argocd-notifications-cm.yaml` for:
- Slack/Teams integration
- Email alerts
- Webhook notifications

## Monitoring

ArgoCD provides built-in monitoring for:
- Application health status
- Sync status and history
- Resource drift detection
- Performance metrics

Access via ArgoCD UI or integrate with Prometheus/Grafana for advanced monitoring.

## Security

- **RBAC** configured for role-based access
- **Sealed Secrets** for secure secret management
- **Network policies** for pod-to-pod communication
- **Resource quotas** and limits enforcement

## Troubleshooting

### Common Issues
1. **Sync failures** - Check resource validation and RBAC permissions
2. **Health check failures** - Verify application readiness and health endpoints
3. **Repository access** - Validate Git credentials and network access

### Debugging Commands
```bash
# Check application status
kubectl get applications -n argocd

# View application details
kubectl describe application mattailor-dev -n argocd

# Check ArgoCD server logs
kubectl logs -n argocd deployment/argocd-server

# Restart ArgoCD components
kubectl rollout restart deployment/argocd-server -n argocd
```

## Advanced Features

### App of Apps Pattern
Use `app-of-apps.yaml` to manage multiple applications declaratively.

### Multi-Cluster Management
Configure additional clusters in ArgoCD for multi-region deployments.

### Progressive Delivery
Integrate with Argo Rollouts for blue-green and canary deployments.