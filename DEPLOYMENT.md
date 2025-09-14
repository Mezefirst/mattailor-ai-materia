# MatTailor AI - Deployment Guide

This guide covers various deployment options for the MatTailor AI application using Docker.

## Quick Start with Docker

### Production Deployment

```bash
# Clone the repository
git clone <your-repo-url>
cd mattailor-ai

# Build and run with Docker Compose
docker-compose up -d

# The application will be available at http://localhost:3000
```

### Development with Docker

```bash
# Run development environment
docker-compose -f docker-compose.dev.yml up

# The development server will be available at http://localhost:5173
```

## Docker Commands

### Building the Image

```bash
# Build production image
docker build -t mattailor-ai:latest .

# Build development image
docker build -f Dockerfile.dev -t mattailor-ai:dev .
```

### Running Containers

```bash
# Run production container
docker run -d -p 3000:80 --name mattailor-app mattailor-ai:latest

# Run development container
docker run -d -p 5173:5173 -v $(pwd):/app -v /app/node_modules --name mattailor-dev mattailor-ai:dev
```

### Container Management

```bash
# View running containers
docker ps

# View logs
docker logs mattailor-app

# Stop container
docker stop mattailor-app

# Remove container
docker rm mattailor-app

# Remove image
docker rmi mattailor-ai:latest
```

## Cloud Deployment Options

### 1. Docker Hub + Cloud Platforms

```bash
# Tag and push to Docker Hub
docker tag mattailor-ai:latest yourusername/mattailor-ai:latest
docker push yourusername/mattailor-ai:latest
```

Then deploy to:
- **AWS ECS/Fargate**: Use the pushed image
- **Google Cloud Run**: Direct deployment from Docker Hub
- **Azure Container Instances**: Deploy from registry
- **DigitalOcean App Platform**: Connect to Docker Hub

### 2. Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 3. Render Deployment

1. Connect your GitHub repository to Render
2. Choose "Docker" as the environment
3. Set build command: `docker build -t mattailor-ai .`
4. Set start command: `docker run -p $PORT:80 mattailor-ai`

### 4. Heroku with Container Registry

```bash
# Install Heroku CLI and login
heroku login
heroku container:login

# Create app and deploy
heroku create your-app-name
heroku container:push web -a your-app-name
heroku container:release web -a your-app-name
```

## Environment Configuration

### Production Environment Variables

Create `.env.production` file:

```env
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com
VITE_MATWEBAPI_KEY=your_matwebapi_key
VITE_MATERIALS_PROJECT_KEY=your_materials_project_key
```

### Docker Compose Environment

Update `docker-compose.yml` to include environment variables:

```yaml
services:
  mattailor-frontend:
    # ... other config
    environment:
      - NODE_ENV=production
      - VITE_API_URL=${API_URL}
      - VITE_MATWEBAPI_KEY=${MATWEBAPI_KEY}
      - VITE_MATERIALS_PROJECT_KEY=${MATERIALS_PROJECT_KEY}
    env_file:
      - .env.production
```

## Performance Optimization

### Production Optimizations

The production Docker image includes:
- Multi-stage build for smaller image size
- Nginx with gzip compression
- Static asset caching
- Security headers
- Health checks

### Scaling Considerations

```bash
# Scale with Docker Compose
docker-compose up -d --scale mattailor-frontend=3

# Use with load balancer (nginx, traefik, etc.)
```

## Monitoring and Logs

### Container Health Monitoring

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' mattailor-app

# View health check logs
docker inspect --format='{{json .State.Health}}' mattailor-app
```

### Log Management

```bash
# Follow logs
docker logs -f mattailor-app

# Export logs
docker logs mattailor-app > app.log 2>&1
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change port mapping in docker-compose.yml
2. **Build failures**: Check Docker build context and .dockerignore
3. **Memory issues**: Increase Docker Desktop memory allocation

### Debug Commands

```bash
# Enter running container
docker exec -it mattailor-app sh

# Debug build process
docker build --no-cache -t mattailor-ai:debug .

# Check container resources
docker stats mattailor-app
```

## Security Best Practices

1. **Use specific base image versions**: `node:18-alpine` instead of `node:latest`
2. **Run as non-root user** (implemented in production Dockerfile)
3. **Scan images for vulnerabilities**: `docker scan mattailor-ai:latest`
4. **Keep dependencies updated**: Regular npm audit and updates
5. **Use secrets management** for API keys in production

## Backup and Recovery

### Data Backup

If using persistent volumes:

```bash
# Backup volumes
docker run --rm -v mattailor_data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data

# Restore volumes
docker run --rm -v mattailor_data:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /
```

### Configuration Backup

```bash
# Export container configuration
docker inspect mattailor-app > container-config.json
```

This deployment setup provides a robust, scalable foundation for running MatTailor AI in any Docker-compatible environment.