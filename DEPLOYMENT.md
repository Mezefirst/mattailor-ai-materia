# MatTailor AI - Deployment Guide

This guide covers deployment configuration for MatTailor AI using Docker and optional external integrations.

## 🚀 Quick Start (No API Keys Required)

MatTailor AI now works perfectly without any external API keys using a comprehensive local material database.

### Development Setup
```bash
# Frontend
npm install
npm run dev

# Backend (optional)
cd backend
pip install -r requirements.txt
python main.py
```

### Docker Deployment
```bash
# Basic deployment (no API keys needed)
docker-compose up

# Or build individual services
docker build -t mattailor-ai .
docker run -p 3000:80 mattailor-ai
```

## 🔐 Optional API Integrations

### External Material Databases (Optional)

Configure these environment variables for enhanced material data:

| Variable | Description | Required |
|----------|-------------|----------|
| `MATWEB_API_KEY` | API key for MatWeb material database | Optional |
| `MATERIALS_PROJECT_API_KEY` | API key for Materials Project database | Optional |
| `OPENAI_API_KEY` | OpenAI API key for AI recommendations | Optional |

### Setting API Keys

#### Environment Variables
```bash
# .env file
MATWEB_API_KEY=your_matweb_api_key_here
MATERIALS_PROJECT_API_KEY=your_materials_project_api_key_here
```

#### Docker Compose with API Keys
```bash
# Set environment variables
export MATWEB_API_KEY="your-key-here"
export MATERIALS_PROJECT_API_KEY="your-key-here"

# Deploy with API integration
docker-compose up
```

## 🏗️ Production Deployment

### Docker Production Setup
```bash
# Production build with optional API keys
docker build \
  --build-arg MATWEB_API_KEY="${MATWEB_API_KEY:-}" \
  --build-arg MATERIALS_PROJECT_API_KEY="${MATERIALS_PROJECT_API_KEY:-}" \
  -t mattailor-ai:latest .

# Run production container
docker run -d \
  --name mattailor-ai \
  -p 80:80 \
  --restart unless-stopped \
  mattailor-ai:latest
```

### Multi-Service Deployment
```bash
# Deploy both frontend and backend
docker-compose -f docker-compose.yml up -d
```

## 📊 Features Available

### Without API Keys (Local Database)
- ✅ 20+ comprehensive materials across all categories
- ✅ Material search and recommendations  
- ✅ Property comparison and analysis
- ✅ Supplier information
- ✅ Full web application functionality
- ✅ Docker deployment ready

### With API Keys (External Integrations)
- ✅ All local features PLUS
- ✅ Access to 150,000+ materials from MatWeb
- ✅ Materials Project database integration
- ✅ Real-time material property data
- ✅ Enhanced AI recommendations with OpenAI

## 🔧 Configuration

### Environment Variables

#### Application Settings
```bash
NODE_ENV=production
VITE_APP_NAME=MatTailor AI
VITE_APP_VERSION=1.0.0
```

#### Optional Database Integration
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/mattailor_ai
REDIS_URL=redis://localhost:6379
```

### Health Checks

The application includes built-in health checks:
- Frontend: `http://localhost:3000/health`
- Backend: `http://localhost:8000/health`

## 🐳 Docker Configuration

### Multi-stage Production Build
The Dockerfile uses multi-stage builds for optimal size and security:
1. **Builder stage**: Installs dependencies and builds the application
2. **Production stage**: Lightweight nginx serving optimized static files

### Security Features
- Non-root user execution
- Minimal attack surface
- Health check monitoring
- Resource limits

## 📈 Monitoring

### Built-in Metrics
- Application performance
- Material database statistics
- API integration status
- Error tracking

### Logging
Structured JSON logging with:
- Request/response tracking  
- Performance metrics
- Error details
- Security events

## 🔍 Troubleshooting

### Common Issues

**Build fails with TypeScript errors:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Docker build fails:**
```bash
# Build without cache
docker build --no-cache -t mattailor-ai .
```

**Application not loading materials:**
- Check browser console for errors
- Verify network connectivity
- Check API key configuration (if using external APIs)

### Getting Help
1. Check the [GitHub Issues](https://github.com/mattailor-ai/issues)
2. Review application logs
3. Verify configuration settings

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