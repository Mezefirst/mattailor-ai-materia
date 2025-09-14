# MatTailor AI - ArgoCD GitOps Setup Guide

This guide walks you through setting up ArgoCD for automated GitOps deployments of MatTailor AI across development, staging, and production environments.

## Overview

Our GitOps architecture uses:
- **ArgoCD** for continuous deployment and application management
- **Kustomize** for environment-specific configurations
- **GitHub Actions** for CI/CD pipeline automation
- **Multi-environment strategy** with promotion-based workflows

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│                 │    │                 │    │                 │
│  Auto-sync: ✅  │    │  Manual sync: ⚠️│    │  Manual sync: ⚠️│
│  Branch: develop│    │  Branch: staging│    │  Branch: main   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     ArgoCD      │
                    │   GitOps CD     │
                    │                 │
                    │  - App Mgmt     │
                    │  - Health Check │
                    │  - Rollbacks    │
                    │  - Notifications│
                    └─────────────────┘
```

## Prerequisites

1. **Kubernetes Cluster** (v1.24+)
2. **kubectl** configured for cluster access
3. **Docker Registry** access (GitHub Container Registry)
4. **GitHub Repository** with admin access
5. **Domain name** for ingress (optional)

## Quick Start

### 1. Clone and Configure

```bash
# Clone the repository
git clone https://github.com/your-org/mattailor-ai.git
cd mattailor-ai

# Navigate to ArgoCD directory
cd k8s/argocd
```

### 2. Install ArgoCD

Choose one of the following methods:

#### Method A: Using Make (Recommended)
```bash
# Install ArgoCD and deploy applications
make install

# Or install components separately
make install-argocd
make deploy-apps
```

#### Method B: Using Shell Script
```bash
# Make the script executable and run
./deploy.sh

# With ingress setup
./deploy.sh --with-ingress --domain your-domain.com

# Skip application deployment
./deploy.sh --skip-apps
```

#### Method C: Manual Installation
```bash
# Create ArgoCD namespace
kubectl create namespace argocd

# Install ArgoCD using Kustomize
kubectl apply -k install/

# Wait for ArgoCD to be ready
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd

# Deploy projects and applications
kubectl apply -f projects/
kubectl apply -f applications/
kubectl apply -f policies/
```

### 3. Access ArgoCD UI

```bash
# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Open https://localhost:8080
# Username: admin
# Password: [from step above]
```

### 4. Configure Repository Access

Update `repositories/git-repo-secret.yaml` with your Git credentials:

```yaml
# For GitHub Personal Access Token
stringData:
  url: https://github.com/your-org/mattailor-ai
  username: git
  password: YOUR_PERSONAL_ACCESS_TOKEN

# Or for SSH key
stringData:
  url: git@github.com:your-org/mattailor-ai.git
  sshPrivateKey: |
    -----BEGIN OPENSSH PRIVATE KEY-----
    YOUR_SSH_PRIVATE_KEY_HERE
    -----END OPENSSH PRIVATE KEY-----
```

Apply the secret:
```bash
kubectl apply -f repositories/git-repo-secret.yaml
```

## Environment Configuration

### Development Environment
- **Namespace**: `mattailor-ai-dev`
- **Branch**: `develop`
- **Sync Policy**: Automated
- **Purpose**: Rapid development and testing

### Staging Environment
- **Namespace**: `mattailor-ai-staging`
- **Branch**: `staging`
- **Sync Policy**: Manual
- **Purpose**: Pre-production testing and validation

### Production Environment
- **Namespace**: `mattailor-ai-prod`
- **Branch**: `main`
- **Sync Policy**: Manual with approvals
- **Purpose**: Live production workloads

## CI/CD Pipeline

### GitHub Actions Workflows

1. **Docker Build** (`.github/workflows/docker-build.yml`)
   - Builds frontend and backend containers
   - Scans for security vulnerabilities
   - Updates Kubernetes manifests
   - Triggers ArgoCD sync

2. **ArgoCD Deploy** (`.github/workflows/argocd-deploy.yml`)
   - Validates Kubernetes manifests
   - Deploys to environments based on branch
   - Includes production approval gates
   - Handles rollbacks on failure

### Required GitHub Secrets

Configure these secrets in your GitHub repository:

```bash
# Kubernetes configurations (base64 encoded)
KUBE_CONFIG_DEV      # Development cluster config
KUBE_CONFIG_STAGING  # Staging cluster config  
KUBE_CONFIG_PROD     # Production cluster config

# Notification webhooks
SLACK_WEBHOOK_URL    # Slack notifications

# Repository variables
PRODUCTION_APPROVERS # GitHub usernames for prod approvals
```

## Application Management

### Sync Applications

```bash
# Sync all applications
make sync

# Sync specific environment
make sync-dev
make sync-staging
make sync-prod

# Check application status
make status
```

### Rollback Deployments

```bash
# Via kubectl
kubectl patch application mattailor-ai-prod -n argocd \
  --type merge \
  -p '{"operation":{"rollback":{"id":1}}}'

# Via ArgoCD UI
# Navigate to application → History → Select revision → Rollback
```

### Monitor Applications

```bash
# View application status
kubectl get applications -n argocd

# Check application health
make health-check

# View ArgoCD logs
make logs-server
make logs-controller
make logs-repo
```

## Notifications

Configure notifications in `repositories/notification-secrets.yaml`:

```yaml
stringData:
  # Slack integration
  slack-token: "xoxb-YOUR-SLACK-BOT-TOKEN"
  
  # Microsoft Teams
  teams-webhook-url: "https://your-org.webhook.office.com/..."
  
  # Email
  email-username: "notifications@mattailor.ai"
  email-password: "YOUR-EMAIL-APP-PASSWORD"
```

Notifications are sent for:
- Application deployments
- Health degradation
- Sync failures
- Production changes

## Security

### RBAC Configuration

The setup includes role-based access control:

- **Admin**: Full access to all applications
- **Developer**: Can manage development applications
- **DevOps**: Can manage staging and production
- **Viewer**: Read-only access

### Network Policies

Network policies are applied to:
- Restrict ArgoCD component communication
- Secure application namespaces
- Control ingress/egress traffic

### Resource Quotas

Resource limits are enforced per environment:
- **Development**: 2 CPU, 4GB RAM
- **Staging**: 4 CPU, 8GB RAM  
- **Production**: 8 CPU, 16GB RAM

## Progressive Delivery

### Argo Rollouts

For advanced deployment strategies:

```bash
# Install Argo Rollouts
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml

# Apply rollout configuration
kubectl apply -f rollouts/
```

Features:
- **Canary deployments** with traffic splitting
- **Blue-green deployments** for zero-downtime
- **Automated rollbacks** based on metrics
- **Progressive traffic shifting**

## Monitoring and Observability

### Prometheus Integration

ArgoCD metrics are exposed for Prometheus scraping:

```yaml
# ServiceMonitor for ArgoCD
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: argocd-metrics
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: argocd-metrics
  endpoints:
  - port: metrics
```

### Grafana Dashboards

Import ArgoCD dashboards:
- **ArgoCD Operational** (ID: 14584)
- **ArgoCD Application** (ID: 19993)

### Health Checks

Applications include comprehensive health checks:
- Kubernetes resource health
- Custom health scripts
- Readiness and liveness probes
- External dependency checks

## Troubleshooting

### Common Issues

1. **Sync Failures**
   ```bash
   # Check application events
   kubectl describe application mattailor-ai-dev -n argocd
   
   # View sync operation details
   kubectl get application mattailor-ai-dev -n argocd -o yaml
   ```

2. **Health Check Failures**
   ```bash
   # Check pod status
   kubectl get pods -n mattailor-ai-dev
   
   # Check application logs
   kubectl logs -l app=mattailor-ai -n mattailor-ai-dev
   ```

3. **Repository Access Issues**
   ```bash
   # Test repository connection
   kubectl logs deployment/argocd-repo-server -n argocd
   
   # Update repository credentials
   kubectl apply -f repositories/git-repo-secret.yaml
   ```

### Debug Commands

```bash
# Port forward ArgoCD UI
make port-forward

# Get admin password
make get-password

# Clean failed resources
make clean

# View application logs
kubectl logs -f deployment/argocd-application-controller -n argocd
```

## Backup and Disaster Recovery

### Backup ArgoCD Configuration

```bash
# Backup applications
kubectl get applications -n argocd -o yaml > argocd-apps-backup.yaml

# Backup projects
kubectl get appprojects -n argocd -o yaml > argocd-projects-backup.yaml

# Backup configurations
kubectl get configmaps,secrets -n argocd -o yaml > argocd-config-backup.yaml
```

### Restore Process

```bash
# Restore applications
kubectl apply -f argocd-apps-backup.yaml

# Restore projects
kubectl apply -f argocd-projects-backup.yaml

# Restore configurations
kubectl apply -f argocd-config-backup.yaml
```

## Scaling ArgoCD

For large deployments:

```yaml
# Increase ArgoCD application controller replicas
spec:
  replicas: 3
  
# Enable sharding
spec:
  template:
    spec:
      containers:
      - name: argocd-application-controller
        env:
        - name: ARGOCD_CONTROLLER_REPLICAS
          value: "3"
        - name: ARGOCD_CONTROLLER_SHARD
          valueFrom:
            fieldRef:
              fieldPath: metadata.annotations['controller.argocd.argoproj.io/shard']
```

## Best Practices

1. **Repository Structure**
   - Keep application code and manifests in the same repository
   - Use Kustomize for environment-specific configurations
   - Version your deployments with Git tags

2. **Application Configuration**
   - Use manual sync for production environments
   - Enable pruning for development environments
   - Set appropriate resource limits and quotas

3. **Security**
   - Use least-privilege RBAC policies
   - Enable network policies
   - Regularly rotate secrets and credentials

4. **Monitoring**
   - Set up alerts for sync failures
   - Monitor application health metrics
   - Implement comprehensive logging

## Support and Maintenance

### Regular Tasks

- **Weekly**: Review failed deployments and fix issues
- **Monthly**: Update ArgoCD to latest stable version
- **Quarterly**: Audit RBAC policies and permissions
- **Annually**: Review and update disaster recovery procedures

### Getting Help

- **ArgoCD Documentation**: https://argo-cd.readthedocs.io/
- **GitHub Issues**: https://github.com/argoproj/argo-cd/issues
- **Slack Community**: https://argoproj.github.io/community/join-slack/

## Conclusion

This ArgoCD setup provides a robust, scalable GitOps platform for MatTailor AI with:
- ✅ Multi-environment deployment strategy
- ✅ Automated CI/CD pipeline integration
- ✅ Comprehensive security and RBAC
- ✅ Progressive delivery capabilities
- ✅ Monitoring and observability
- ✅ Disaster recovery procedures

The configuration supports both development velocity and production stability, making it suitable for enterprise-grade deployments of MatTailor AI.