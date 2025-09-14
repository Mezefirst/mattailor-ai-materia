# MatTailor AI Deployment Guide

This guide covers deploying MatTailor AI across different environments using Docker containers.

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for development)
- Git (for CI/CD)

### Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure API keys in your environment file:**
   ```bash
   MATWEBAPI_KEY=your_matweb_api_key_here
   MP_API_KEY=your_materials_project_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Make deployment script executable:**
   ```bash
   chmod +x scripts/deploy.sh
   ```

## Deployment Environments

### Development Environment

For local development with hot reloading:

```bash
# Using the deployment script
./scripts/deploy.sh development --build

# Or manually with Docker Compose
docker-compose -f docker-compose.dev.yml up --build
```

**Access URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Staging Environment

For testing in a production-like environment:

```bash
# Set up staging environment file
cp .env.example .env.staging

# Deploy to staging
./scripts/deploy.sh staging --build

# Or manually
export IMAGE_TAG=latest
docker-compose -f deploy/docker-compose.staging.yml up -d
```

**Access URLs:**
- Frontend: https://staging.mattailor.ai
- Backend: https://api-staging.mattailor.ai

### Production Environment

For production deployment with monitoring and load balancing:

```bash
# Set up production environment file
cp .env.example .env.production

# Deploy to production (with safety confirmation)
./scripts/deploy.sh production

# Or manually
export IMAGE_TAG=v1.0.0
export DOCKER_USERNAME=your_username
docker-compose -f deploy/docker-compose.production.yml up -d
```

**Access URLs:**
- Frontend: https://mattailor.ai
- Backend: https://api.mattailor.ai
- Monitoring: https://monitoring.mattailor.ai
- Dashboards: https://dashboards.mattailor.ai

## CI/CD Pipeline

### GitHub Actions Setup

1. **Configure repository secrets:**
   ```
   DOCKER_USERNAME=your_docker_hub_username
   DOCKER_PASSWORD=your_docker_hub_password
   MATWEBAPI_KEY=your_matweb_api_key
   MP_API_KEY=your_materials_project_api_key
   OPENAI_API_KEY=your_openai_api_key
   POSTGRES_PASSWORD=secure_database_password
   ACME_EMAIL=your_email_for_ssl_certificates
   GRAFANA_ADMIN_PASSWORD=grafana_admin_password
   ```

2. **Automated deployments:**
   - Push to `develop` branch → Deploy to staging
   - Push to `main` branch → Deploy to production
   - Pull requests → Run tests and build checks

### Manual Deployment Steps

1. **Build and push Docker images:**
   ```bash
   # Build images
   docker build -t your_username/mattailor-frontend:latest .
   docker build -t your_username/mattailor-backend:latest backend/

   # Push to registry
   docker push your_username/mattailor-frontend:latest
   docker push your_username/mattailor-backend:latest
   ```

2. **Deploy to target environment:**
   ```bash
   # Set environment variables
   export DOCKER_USERNAME=your_username
   export IMAGE_TAG=latest

   # Deploy
   docker-compose -f deploy/docker-compose.production.yml up -d
   ```

## Environment Configuration

### Required Environment Variables

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `NODE_ENV` | development | staging | production | Application environment |
| `MATWEBAPI_KEY` | Optional | Required | Required | MatWeb API access key |
| `MP_API_KEY` | Optional | Required | Required | Materials Project API key |
| `OPENAI_API_KEY` | Optional | Required | Required | OpenAI API key for AI features |
| `DATABASE_URL` | SQLite | PostgreSQL | PostgreSQL | Database connection string |
| `POSTGRES_PASSWORD` | - | Required | Required | Database password |
| `DOCKER_USERNAME` | - | Required | Required | Docker Hub username |
| `ACME_EMAIL` | - | Required | Required | Email for SSL certificates |

### API Keys Setup

#### MatWeb API Key
1. Register at [MatWeb](https://www.matweb.com/api/)
2. Subscribe to appropriate plan
3. Add key to environment variables

#### Materials Project API Key
1. Register at [Materials Project](https://materialsproject.org/)
2. Generate API key from user profile
3. Add key to environment variables

#### OpenAI API Key
1. Create account at [OpenAI](https://platform.openai.com/)
2. Generate API key
3. Add key to environment variables

## Monitoring and Logging

### Production Monitoring Stack

The production environment includes:
- **Traefik**: Load balancer and SSL termination
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **PostgreSQL**: Primary database
- **Redis**: Caching layer

### Health Checks

All services include health check endpoints:
- Frontend: `GET /health`
- Backend: `GET /health`
- Database: Built-in PostgreSQL health checks
- Redis: Built-in Redis health checks

### Log Management

View logs for specific services:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend-prod

# Follow logs during deployment
./scripts/deploy.sh production --logs
```

## Scaling and Performance

### Horizontal Scaling

Production services are configured with multiple replicas:
- Frontend: 2 replicas
- Backend: 3 replicas
- Database: Single instance with backup recommendations

### Resource Limits

Each service has defined resource limits:
- Frontend: 512MB memory limit
- Backend: 1GB memory limit
- Database: 2GB memory limit
- Redis: 512MB memory limit

### Performance Optimization

1. **Frontend optimizations:**
   - Nginx gzip compression
   - Static asset caching
   - CDN integration ready

2. **Backend optimizations:**
   - Redis caching layer
   - Database connection pooling
   - API response caching

3. **Database optimizations:**
   - Indexed queries
   - Connection pooling
   - Read replicas (recommended)

## Security Considerations

### Production Security Features

1. **SSL/TLS encryption** via Let's Encrypt
2. **Security headers** in Nginx configuration
3. **Container security** with non-root users
4. **Network isolation** via Docker networks
5. **Environment variable protection**

### Security Best Practices

1. **Never commit secrets** to version control
2. **Use strong passwords** for all services
3. **Regular security updates** for base images
4. **Network segmentation** between environments
5. **Regular backup procedures**

## Troubleshooting

### Common Issues

1. **Build failures:**
   ```bash
   # Clean build cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

2. **Port conflicts:**
   ```bash
   # Check port usage
   docker ps
   netstat -tulpn
   
   # Stop conflicting services
   docker-compose down
   ```

3. **Database connection issues:**
   ```bash
   # Check database logs
   docker-compose logs postgres-prod
   
   # Test connection
   docker-compose exec postgres-prod psql -U mattailor_prod -d mattailor_prod
   ```

4. **SSL certificate issues:**
   ```bash
   # Check Traefik logs
   docker-compose logs traefik-prod
   
   # Verify certificate
   openssl s_client -connect mattailor.ai:443
   ```

### Recovery Procedures

1. **Database backup and restore:**
   ```bash
   # Backup
   docker-compose exec postgres-prod pg_dump -U mattailor_prod mattailor_prod > backup.sql
   
   # Restore
   docker-compose exec -T postgres-prod psql -U mattailor_prod mattailor_prod < backup.sql
   ```

2. **Container recovery:**
   ```bash
   # Restart specific service
   docker-compose restart backend-prod
   
   # Full environment restart
   docker-compose down && docker-compose up -d
   ```

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly:**
   - Monitor resource usage
   - Check application logs
   - Verify backup procedures

2. **Monthly:**
   - Update base Docker images
   - Review security patches
   - Analyze performance metrics

3. **Quarterly:**
   - Capacity planning review
   - Security audit
   - Disaster recovery testing

### Getting Help

- Check logs first: `docker-compose logs [service-name]`
- Review this deployment guide
- Check GitHub Issues for known problems
- Contact the development team

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)