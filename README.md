# MatTailor AI - Intelligent Material Discovery Platform

## Overview

MatTailor AI is a comprehensive web application that empowers engineers, designers, and manufacturers to discover, simulate, tailor, and source optimal materials for specific applications without compromising on performance, cost, or sustainability.

## Features

- 🔧 **Material Requirements Input**: Define mechanical, environmental, budget, and application constraints
- 🧪 **AI-Powered Recommendations**: Get optimal material suggestions with performance scoring
- 🔬 **Property Simulation**: Simulate mechanical, electrical, and chemical properties
- 🌱 **Sustainability Analysis**: Evaluate environmental impact and lifecycle assessment
- 🔍 **External Material Database**: Access 150,000+ materials from MatWeb and Materials Project
- 🧬 **Custom Material Designer**: Create new materials with periodic table integration
- 📊 **Real-time Visualization**: Interactive charts and property comparisons
- 🌐 **Multilingual Support**: Available in English, Swedish, German, French, and Amharic

## Quick Start

### Using Docker (Recommended)

#### Production Deployment
```bash
# Clone and run with Docker Compose
git clone <your-repo-url>
cd mattailor-ai
docker-compose up -d

# Access at http://localhost:3000
```

#### Development with Docker
```bash
# Run development environment
docker-compose -f docker-compose.dev.yml up

# Access at http://localhost:5173
```

#### Staging with Monitoring
```bash
# Run staging environment with Prometheus and Grafana
docker-compose -f docker-compose.staging.yml --profile monitoring up -d

# Access services:
# - Application: http://localhost:3001
# - Grafana: http://localhost:3000
# - Prometheus: http://localhost:9090
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Docker Commands

### Quick Commands
```bash
# Build and run production
npm run docker:build
npm run docker:run

# Build and run development
npm run docker:build-dev
npm run docker:run-dev

# Using Docker Compose
npm run compose:up      # Start services
npm run compose:down    # Stop services
npm run compose:dev     # Development mode
npm run compose:logs    # View logs
```

### Manual Docker Commands
```bash
# Build images
docker build -t mattailor-ai:latest .
docker build -f Dockerfile.dev -t mattailor-ai:dev .

# Run containers
docker run -d -p 3000:80 --name mattailor-app mattailor-ai:latest
docker run -d -p 5173:5173 -v $(pwd):/app --name mattailor-dev mattailor-ai:dev

# Container management
docker ps                    # View running containers
docker logs mattailor-app    # View logs
docker stop mattailor-app    # Stop container
docker rm mattailor-app      # Remove container
```

## 🚀 Automated CI/CD Pipeline

### Production-Ready Deployment
MatTailor AI includes enterprise-grade CI/CD with GitHub Actions supporting multiple cloud platforms:

#### 🏗️ Build & Security
- **Multi-Architecture Builds**: AMD64 & ARM64 Docker images
- **Security Scanning**: Trivy vulnerability detection
- **Code Quality**: ESLint, TypeScript checking, automated testing
- **Container Registry**: GitHub Container Registry (GHCR) integration

#### ☁️ Multi-Cloud Deployment Support
- **Railway** - One-click deployment (recommended for quick start)
- **AWS ECS/Fargate** - Enterprise container orchestration
- **Google Cloud Run** - Serverless container platform
- **Azure Container Instances** - Microsoft cloud deployment
- **Render** - Modern full-stack hosting

#### 🔄 Automated Workflows
- **Staging**: Auto-deploy from `develop` branch
- **Production**: Deploy on GitHub releases
- **Notifications**: Slack/Discord deployment alerts
- **Monitoring**: Sentry error tracking integration

### 🛠️ Quick Setup

#### 1. Configure Deployment Secrets
```bash
# Interactive setup script
./scripts/setup-github-secrets.sh

# Manual setup with GitHub CLI
gh secret set RAILWAY_TOKEN --body "your_railway_token"
gh secret set MATWEBAPI_KEY --body "your_matwebapi_key"
```

#### 2. Deploy to Staging
```bash
# Push to develop branch triggers staging deployment
git checkout -b develop
git push origin develop
```

#### 3. Deploy to Production
```bash
# Create release triggers production deployment
gh release create v1.0.0 --title "MatTailor AI v1.0.0"
```

### 📋 Deployment Checklist
- [ ] Configure repository secrets ([Quick Reference](docs/SECRETS_QUICK_REFERENCE.md))
- [ ] Set up cloud platform credentials
- [ ] Configure external API keys (MatWeb, Materials Project)
- [ ] Test deployment pipeline
- [ ] Set up monitoring and alerts

### 🔍 Pipeline Monitoring
```bash
# View deployment status
gh workflow list

# Monitor specific deployment
gh run watch

# View deployment logs
gh run view --log

# Validate secrets configuration
gh workflow run validate-secrets.yml
```

### 📚 Documentation
- **[GitHub Secrets Setup](docs/GITHUB_SECRETS.md)** - Complete secrets configuration guide
- **[Quick Reference](docs/SECRETS_QUICK_REFERENCE.md)** - Essential secrets checklist
- **[CI/CD Setup](docs/CICD_SETUP.md)** - Pipeline configuration details
- **[Deployment Guide](DEPLOYMENT.md)** - Manual deployment options

## 🐳 Docker Development

## Cloud Deployment

### Supported Platforms
Our Docker setup supports deployment to:

- **Kubernetes**: Full manifests with HPA, ingress, and monitoring
- **Railway**: `railway up`
- **Render**: Connect GitHub repo with Docker environment
- **Heroku**: `heroku container:push web && heroku container:release web`
- **AWS ECS/Fargate**: Use Docker Hub image
- **Google Cloud Run**: Direct deployment from registry
- **DigitalOcean App Platform**: Connect to Docker Hub
- **Azure Container Instances**: Deploy from registry

### Environment Configuration

Create `.env.production` for production deployments:
```env
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com
VITE_MATWEBAPI_KEY=your_matwebapi_key
VITE_MATERIALS_PROJECT_KEY=your_materials_project_key
```

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Data Visualization**: D3.js, Recharts
- **Animation**: Framer Motion
- **State Management**: React hooks with persistent KV storage
- **Build Tool**: Vite
- **Deployment**: Docker, Nginx
- **External APIs**: MatWeb, Materials Project

## Project Structure

```
MatTailor AI/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components
│   │   └── tabs/           # Tab-specific components
│   ├── lib/                # Utilities and helpers
│   ├── assets/             # Static assets
│   └── App.tsx             # Main application component
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
├── nginx.conf              # Nginx configuration
└── DEPLOYMENT.md           # Detailed deployment guide
```

## Core Functionality

### Material Discovery
- Input mechanical requirements (tensile strength, density)
- Define environmental constraints (temperature, corrosion resistance)
- Set budget parameters and geographic preferences
- Specify application context (aerospace, automotive, etc.)

### AI Recommendations
- ML-powered material suggestions
- Performance scoring across multiple criteria
- Trade-off analysis and visualization
- Alternative material recommendations

### Custom Material Design
- Interactive periodic table for element selection
- Real-time composition normalization
- Property prediction for custom alloys
- Visual composition charts and analysis

### Property Simulation
- Mechanical property calculations
- Electrical conductivity modeling
- Chemical compatibility analysis
- Temperature and pressure sensitivity

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Development Guidelines

- Use TypeScript for type safety
- Follow React best practices with hooks
- Maintain responsive design principles
- Write meaningful commit messages
- Test Docker builds before submitting PRs

## Performance Optimization

The production Docker image includes:
- Multi-stage builds for minimal image size
- Nginx with gzip compression and caching
- Static asset optimization
- Security headers implementation
- Health check endpoints

## Security Features

- Content Security Policy headers
- XSS protection
- Secure API key management
- Non-root container execution
- Regular dependency updates

## Support

For issues and questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions
2. Review Docker logs: `docker logs mattailor-app`
3. Inspect container health: `docker inspect --format='{{.State.Health.Status}}' mattailor-app`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**MatTailor AI** - Revolutionizing material discovery through intelligent AI-powered solutions.