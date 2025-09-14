# GitHub Secrets Quick Reference

## Essential Secrets for MatTailor AI Deployment

### 🚀 Quick Setup Commands

```bash
# Download and run the setup script
curl -s https://raw.githubusercontent.com/your-repo/mattailor-ai/main/scripts/setup-github-secrets.sh | bash

# Or manually set secrets using GitHub CLI
gh secret set SECRET_NAME --body "secret_value"
```

### 📋 Secrets Checklist

#### ✅ Required for Basic Deployment
- [ ] `GHCR_TOKEN` - GitHub Container Registry token
- [ ] `RAILWAY_TOKEN` OR `AWS_ACCESS_KEY_ID` - Deployment platform credentials

#### 🔧 External APIs (Optional but Recommended)
- [ ] `MATWEBAPI_KEY` - Access to 150,000+ materials database
- [ ] `MATERIALS_PROJECT_KEY` - Scientific materials data
- [ ] `OPENAI_API_KEY` - AI-powered recommendations

#### 🗄️ Data Storage (Optional)
- [ ] `MONGODB_URI` - Persistent material data storage
- [ ] `REDIS_URL` - Caching for improved performance

#### 📊 Monitoring (Optional)
- [ ] `SENTRY_DSN` - Error tracking and monitoring
- [ ] `SLACK_WEBHOOK_URL` - Deployment notifications

### 🎯 Platform-Specific Setup

#### Railway (Recommended for beginners)
```bash
# Get token from: https://railway.app/account/tokens
gh secret set RAILWAY_TOKEN --body "your_railway_token"
```

#### AWS ECS/Fargate
```bash
gh secret set AWS_ACCESS_KEY_ID --body "your_access_key"
gh secret set AWS_SECRET_ACCESS_KEY --body "your_secret_key"
gh secret set AWS_REGION --body "us-east-1"
```

#### Google Cloud Platform
```bash
# Create service account and download JSON key
gh secret set GCP_SA_KEY --body "$(base64 -w 0 service-account-key.json)"
gh secret set GCP_PROJECT_ID --body "your-project-id"
```

### 🔍 Validation Commands

```bash
# List all configured secrets
gh secret list

# Validate secrets configuration
gh workflow run validate-secrets.yml

# Test deployment pipeline
gh workflow run ci-cd.yml
```

### 🆘 Common Issues & Solutions

#### Secret Not Found
```bash
# Check secret exists
gh secret list | grep SECRET_NAME

# Re-add secret
gh secret set SECRET_NAME --body "new_value"
```

#### Invalid Credentials
```bash
# Test API connectivity
curl -H "Authorization: Bearer $TOKEN" https://api.service.com/test

# Rotate expired tokens
gh secret set TOKEN_NAME --body "new_rotated_token"
```

#### Deployment Failures
```bash
# Check workflow logs
gh run list --workflow=ci-cd.yml

# View specific run
gh run view RUN_ID --log
```

### 📚 Resources

- **Full Setup Guide**: [docs/GITHUB_SECRETS.md](./GITHUB_SECRETS.md)
- **CI/CD Documentation**: [docs/CICD_SETUP.md](./CICD_SETUP.md)
- **Deployment Guide**: [DEPLOYMENT.md](../DEPLOYMENT.md)
- **Security Best Practices**: [SECURITY.md](../SECURITY.md)

### 🎉 Quick Start

1. **Install GitHub CLI**: `brew install gh` (macOS) or download from [cli.github.com](https://cli.github.com)
2. **Authenticate**: `gh auth login`
3. **Run setup script**: `./scripts/setup-github-secrets.sh`
4. **Validate configuration**: `gh workflow run validate-secrets.yml`
5. **Deploy**: Push to `main` branch or create a release

### 💡 Pro Tips

- Use environment-specific prefixes: `STAGING_AWS_ACCESS_KEY_ID`, `PROD_AWS_ACCESS_KEY_ID`
- Set up branch protection rules to require secret validation before deployment
- Monitor secret usage in GitHub's audit log
- Rotate secrets regularly (quarterly recommended)
- Use organization secrets for shared credentials across repositories