# MatTailor AI - Deployment Guide

This guide covers automated deployment configuration for MatTailor AI using GitHub Actions, Docker, and Kubernetes.

## 🔐 GitHub Repository Secrets

### Required Secrets

Configure these secrets in your GitHub repository (`Settings > Secrets and variables > Actions`):

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `MATWEB_API_KEY` | API key for MatWeb material database | Yes |
| `MATERIALS_PROJECT_API_KEY` | API key for Materials Project database | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI recommendations | Optional |
| `SNYK_TOKEN` | Snyk token for security scanning | Optional |
| `DATABASE_URL` | PostgreSQL database URL | Optional |
| `REDIS_URL` | Redis cache URL | Optional |

### Quick Setup

Run the setup script to configure secrets interactively:

```bash
./scripts/setup-secrets.sh
```

Or set them manually using GitHub CLI:

```bash
gh secret set MATWEB_API_KEY --body "your-api-key-here"
gh secret set MATERIALS_PROJECT_API_KEY --body "your-api-key-here"
```

## 🚀 Automated CI/CD Pipeline

The pipeline is triggered on:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Release publication

### Pipeline Stages

1. **Test** - Run unit tests, linting, and build validation
2. **Build & Push** - Build Docker image and push to GitHub Container Registry
3. **Deploy Staging** - Auto-deploy `develop` branch to staging
4. **Deploy Production** - Auto-deploy `main` branch to production

### Workflow Files

- `.github/workflows/ci-cd.yml` - Main CI/CD pipeline
- `.github/workflows/security-scan.yml` - Security scanning

## 🐳 Docker Deployment

### Local Testing

Test the deployment pipeline locally:

```bash
./scripts/test-deployment.sh
```

### Docker Compose

Deploy with Docker Compose:

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your API keys

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t mattailor-ai:latest .

# Run container
docker run -d \
  --name mattailor-ai \
  -p 3000:80 \
  -e MATWEB_API_KEY="your-key" \
  -e MATERIALS_PROJECT_API_KEY="your-key" \
  mattailor-ai:latest
```

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster
- kubectl configured
- Kustomize installed

### Base Deployment

```bash
# Apply base configuration
kubectl apply -k k8s/

# Check deployment status
kubectl get pods -n mattailor-ai
```

### Environment-Specific Deployments

#### Staging

```bash
kubectl apply -k k8s/overlays/staging/
```

#### Production  

```bash
kubectl apply -k k8s/overlays/production/
```

### Secrets Configuration

Create Kubernetes secrets:

```bash
# Create API secrets
kubectl create secret generic api-secrets \
  --from-literal=matweb-api-key="your-key" \
  --from-literal=materials-project-api-key="your-key" \
  -n mattailor-ai

# Create Docker registry secret  
kubectl create secret docker-registry registry-secret \
  --docker-server=ghcr.io \
  --docker-username=your-username \
  --docker-password=your-token \
  -n mattailor-ai
```

## 🔄 GitOps with ArgoCD

### Setup ArgoCD Application

```bash
# Apply ArgoCD application
kubectl apply -f argocd/application.yaml

# Check sync status
argocd app get mattailor-ai-production
```

### Auto-sync Configuration

ArgoCD will automatically:
- Monitor the Git repository
- Sync changes to Kubernetes
- Self-heal any configuration drift

## 🔍 Monitoring & Health Checks

### Health Endpoints

- `/health` - Basic health check
- Container health checks configured

### Monitoring

- Kubernetes readiness and liveness probes
- Container resource limits and requests
- Security scanning with Trivy and Snyk

## 🛡️ Security

### Container Security

- Non-root user (UID 1001)
- Read-only root filesystem
- No privilege escalation
- Dropped capabilities

### Network Security

- HTTPS/TLS termination at ingress
- Security headers configured
- CSP policies applied

### Vulnerability Scanning

- Daily security scans with Snyk
- Container scanning with Trivy
- CodeQL analysis for code security

## 📊 Performance & Scaling

### Resource Configuration

#### Staging
- CPU: 100m request, 200m limit
- Memory: 32Mi request, 64Mi limit
- Replicas: 1

#### Production
- CPU: 500m request, 1000m limit  
- Memory: 128Mi request, 256Mi limit
- Replicas: 5

### Horizontal Pod Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mattailor-ai-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mattailor-ai
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 🔧 Troubleshooting

### Common Issues

1. **Build failures** - Check GitHub Actions logs
2. **Image pull errors** - Verify registry credentials
3. **Pod crashes** - Check resource limits and logs
4. **API errors** - Verify secret configuration

### Debug Commands

```bash
# Check pod logs
kubectl logs -f deployment/mattailor-ai -n mattailor-ai

# Describe pod for events
kubectl describe pod <pod-name> -n mattailor-ai

# Check secrets
kubectl get secrets -n mattailor-ai

# Test health endpoint
kubectl port-forward svc/mattailor-ai-service 8080:80 -n mattailor-ai
curl http://localhost:8080/health
```

## 📈 Deployment Environments

| Environment | Branch | Namespace | Replicas | Resources |
|-------------|---------|-----------|----------|-----------|
| Staging | develop | mattailor-ai-staging | 1 | Small |
| Production | main | mattailor-ai-production | 5 | Large |

## 🚀 Quick Deploy Checklist

- [ ] Configure GitHub repository secrets
- [ ] Set up environment files
- [ ] Test local Docker build
- [ ] Push to develop branch (staging deploy)
- [ ] Verify staging deployment
- [ ] Create pull request to main
- [ ] Merge to main (production deploy)
- [ ] Monitor production deployment

---

For additional support, check the [troubleshooting section](#troubleshooting) or create an issue in the repository.