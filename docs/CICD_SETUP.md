# CI/CD Pipeline Setup Guide

This guide explains how to set up and use the automated CI/CD pipeline for MatTailor AI.

## Overview

The CI/CD pipeline provides:
- Automated testing and linting
- Security scanning with Trivy
- Multi-architecture Docker image builds
- Container security scanning
- Automated deployments to staging and production
- Monitoring and alerting setup

## Pipeline Components

### 1. GitHub Actions Workflows

#### Main CI/CD Pipeline (`ci-cd.yml`)
- **Triggers**: Push to `main`/`develop`, PRs to `main`, releases
- **Jobs**:
  - **Test & Lint**: Runs tests and code quality checks
  - **Security Scan**: Scans code for vulnerabilities
  - **Build & Push**: Builds and pushes Docker images
  - **Container Scan**: Scans Docker images for vulnerabilities
  - **Deploy**: Deploys to staging/production environments
  - **Cleanup**: Removes old container images

#### Docker Build Workflow (`docker-build.yml`)
- **Triggers**: Changes to Docker files or source code
- **Jobs**:
  - **Docker Test**: Tests Docker image builds
  - **Docker Compose Test**: Tests Docker Compose setup
  - **Multi-Arch Build**: Tests multi-architecture builds

#### Release Workflow (`release.yml`)
- **Triggers**: Git tags matching `v*`
- **Jobs**:
  - **Create Release**: Creates GitHub release with artifacts
  - **Build & Push Release**: Builds and pushes tagged images

### 2. Docker Configuration

#### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
- **Production**: `docker-compose.yml`
- **Staging**: `docker-compose.staging.yml` (includes Traefik, monitoring)
- **Development**: `docker-compose.dev.yml`

### 3. Kubernetes Deployment

#### Manifests
- **Deployment**: Pod specification with health checks, resource limits
- **Service**: ClusterIP service for internal communication
- **Ingress**: NGINX ingress with TLS termination
- **HPA**: Horizontal Pod Autoscaler for scaling
- **Network Policy**: Security policies for network traffic

#### Features
- Rolling updates with zero downtime
- Pod disruption budgets for high availability
- Resource requests and limits
- Security contexts and non-root execution
- Anti-affinity rules for pod distribution

## Setup Instructions

### 1. Repository Setup

1. **Enable GitHub Actions**:
   ```bash
   # Push the workflows to your repository
   git add .github/workflows/
   git commit -m "Add CI/CD workflows"
   git push
   ```

2. **Configure Secrets**:
   Go to GitHub Settings > Secrets and add:
   ```
   DOCKERHUB_USERNAME      # Docker Hub username (optional)
   DOCKERHUB_TOKEN         # Docker Hub token (optional)
   SLACK_WEBHOOK_URL       # Slack notifications (optional)
   DISCORD_WEBHOOK_URL     # Discord notifications (optional)
   KUBECONFIG              # Kubernetes config for deployment
   ```

3. **Enable Container Registry**:
   - Go to GitHub Settings > Packages
   - Enable "Improved container support"

### 2. Local Development Setup

1. **Make scripts executable**:
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Build locally**:
   ```bash
   ./scripts/docker-build.sh --tag dev
   ```

3. **Test with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

### 3. Staging Environment

1. **Deploy to staging**:
   ```bash
   ./scripts/deploy.sh --environment staging --tag latest
   ```

2. **With monitoring**:
   ```bash
   docker-compose -f docker-compose.staging.yml --profile monitoring up -d
   ```

3. **Access services**:
   - Application: http://localhost:3001
   - Traefik Dashboard: http://localhost:8080
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000

### 4. Production Deployment

#### Docker Compose
```bash
./scripts/deploy.sh --environment production --tag v1.0.0
```

#### Kubernetes
```bash
# Set environment variables
export NAMESPACE=mattailor
export IMAGE_TAG=v1.0.0
export DOMAIN=mattailor.ai

# Deploy
./scripts/deploy.sh --environment production --tag v1.0.0
```

#### Cloud Platforms
```bash
# Vercel
./scripts/deploy.sh --environment vercel

# Netlify
./scripts/deploy.sh --environment netlify

# Railway
./scripts/deploy.sh --environment railway
```

## Monitoring and Alerting

### Prometheus Metrics
- Application health and performance
- Container resource usage
- System metrics (CPU, memory, disk)
- HTTP request metrics

### Grafana Dashboards
- System overview
- Application performance
- Container metrics
- Alert status

### Alert Rules
- High error rate (>5%)
- High latency (>1s 95th percentile)
- Service down
- High CPU usage (>80%)
- High memory usage (>90%)
- Low disk space (>90% used)

## Security Features

### Code Security
- Trivy vulnerability scanning
- Dependency scanning
- SARIF report uploads to GitHub Security

### Container Security
- Multi-stage builds for minimal attack surface
- Non-root user execution
- Security contexts in Kubernetes
- Regular base image updates

### Network Security
- Network policies in Kubernetes
- TLS termination at ingress
- Security headers configuration

## Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check build logs
   docker-compose logs mattailor-frontend
   
   # Rebuild without cache
   ./scripts/docker-build.sh --no-cache
   ```

2. **Deployment Issues**:
   ```bash
   # Check pod status
   kubectl get pods -n mattailor
   
   # Check pod logs
   kubectl logs -f deployment/mattailor-frontend -n mattailor
   ```

3. **Health Check Failures**:
   ```bash
   # Test health endpoint
   curl -f http://localhost:3000/
   
   # Check container health
   docker inspect mattailor-frontend --format='{{.State.Health.Status}}'
   ```

### Debugging Commands

```bash
# View running containers
docker ps

# Check container logs
docker logs mattailor-frontend

# Execute commands in container
docker exec -it mattailor-frontend sh

# Check Kubernetes resources
kubectl describe deployment mattailor-frontend -n mattailor
kubectl get events -n mattailor --sort-by=.metadata.creationTimestamp
```

## Pipeline Customization

### Adding New Environments
1. Create environment-specific compose file
2. Add deployment logic to `scripts/deploy.sh`
3. Update workflow environments in `.github/workflows/ci-cd.yml`

### Custom Build Arguments
```bash
./scripts/docker-build.sh --build-arg NODE_ENV=production --build-arg API_URL=https://api.example.com
```

### Additional Monitoring
1. Add scrape configs to `monitoring/prometheus.yml`
2. Create custom alert rules in `monitoring/rules/`
3. Import Grafana dashboards

## Best Practices

1. **Version Control**: Always tag releases with semantic versioning
2. **Testing**: Run tests locally before pushing
3. **Security**: Keep dependencies updated and scan regularly
4. **Monitoring**: Set up alerts for critical metrics
5. **Documentation**: Keep deployment docs updated
6. **Rollback**: Have rollback procedures ready
7. **Backup**: Backup critical data and configurations

## Support

For issues with the CI/CD pipeline:
1. Check GitHub Actions logs
2. Review container logs
3. Verify environment configuration
4. Check network connectivity
5. Validate secrets and permissions

## Next Steps

1. Set up monitoring dashboards
2. Configure backup strategies
3. Implement automated testing
4. Set up log aggregation
5. Configure performance monitoring
6. Plan disaster recovery procedures