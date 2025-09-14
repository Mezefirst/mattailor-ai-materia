# GitHub Repository Secrets Configuration Guide

This guide details how to configure GitHub repository secrets for automated CI/CD deployments of MatTailor AI.

## Overview

GitHub Secrets provide secure storage for sensitive data like API keys, database credentials, and deployment tokens. This configuration enables automated Docker builds, security scanning, and multi-environment deployments.

## Required Repository Secrets

### 1. Container Registry Secrets

#### GitHub Container Registry (GHCR) - Recommended
```
Name: GHCR_TOKEN
Value: Your GitHub Personal Access Token with packages:write permission
```

**How to create:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `write:packages`, `read:packages`, and `delete:packages` scopes
3. Copy the token and add it as a repository secret

#### Docker Hub (Alternative)
```
Name: DOCKER_HUB_USERNAME
Value: Your Docker Hub username

Name: DOCKER_HUB_ACCESS_TOKEN  
Value: Your Docker Hub access token
```

### 2. Cloud Deployment Secrets

#### AWS Deployment
```
Name: AWS_ACCESS_KEY_ID
Value: Your AWS access key ID

Name: AWS_SECRET_ACCESS_KEY
Value: Your AWS secret access key

Name: AWS_REGION
Value: us-east-1 (or your preferred region)

Name: ECS_CLUSTER_NAME
Value: mattailor-cluster

Name: ECS_SERVICE_NAME
Value: mattailor-service
```

#### Google Cloud Platform
```
Name: GCP_SA_KEY
Value: Base64 encoded service account JSON key

Name: GCP_PROJECT_ID
Value: your-gcp-project-id

Name: GKE_CLUSTER_NAME
Value: mattailor-cluster

Name: GKE_ZONE
Value: us-central1-a
```

#### Azure Container Instances
```
Name: AZURE_CLIENT_ID
Value: Your Azure service principal client ID

Name: AZURE_CLIENT_SECRET
Value: Your Azure service principal client secret

Name: AZURE_TENANT_ID
Value: Your Azure tenant ID

Name: AZURE_SUBSCRIPTION_ID
Value: Your Azure subscription ID
```

#### Railway
```
Name: RAILWAY_TOKEN
Value: Your Railway API token
```

#### Render
```
Name: RENDER_API_KEY
Value: Your Render API key

Name: RENDER_SERVICE_ID
Value: Your Render service ID
```

### 3. External API Secrets

#### Material Data APIs
```
Name: MATWEBAPI_KEY
Value: Your MatWeb API key

Name: MATERIALS_PROJECT_KEY
Value: Your Materials Project API key
```

#### AI/ML Services
```
Name: OPENAI_API_KEY
Value: Your OpenAI API key (for AI recommendations)

Name: HUGGINGFACE_TOKEN
Value: Your Hugging Face API token (for ML models)
```

### 4. Database and Storage Secrets

#### MongoDB Atlas
```
Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/mattailor

Name: MONGODB_DATABASE
Value: mattailor_production
```

#### Redis (for caching)
```
Name: REDIS_URL
Value: redis://username:password@hostname:port
```

#### AWS S3 (for file storage)
```
Name: S3_BUCKET_NAME
Value: mattailor-assets

Name: S3_REGION
Value: us-east-1
```

### 5. Monitoring and Analytics

#### Sentry (Error Tracking)
```
Name: SENTRY_DSN
Value: Your Sentry project DSN

Name: SENTRY_AUTH_TOKEN
Value: Your Sentry auth token for releases
```

#### DataDog (APM)
```
Name: DATADOG_API_KEY
Value: Your DataDog API key

Name: DATADOG_APP_KEY
Value: Your DataDog application key
```

### 6. SSL/TLS Certificates

#### Let's Encrypt (if using custom domain)
```
Name: LETSENCRYPT_EMAIL
Value: your-email@domain.com

Name: DOMAIN_NAME
Value: mattailor.ai
```

### 7. Notification Secrets

#### Slack Notifications
```
Name: SLACK_WEBHOOK_URL
Value: Your Slack webhook URL for deployment notifications
```

#### Discord Notifications
```
Name: DISCORD_WEBHOOK_URL
Value: Your Discord webhook URL
```

## How to Add Repository Secrets

### Via GitHub Web Interface

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the secret name and value
5. Click **Add secret**

### Via GitHub CLI

```bash
# Install GitHub CLI
gh auth login

# Add secrets
gh secret set MATWEBAPI_KEY --body "your-api-key-here"
gh secret set MATERIALS_PROJECT_KEY --body "your-materials-project-key"
gh secret set AWS_ACCESS_KEY_ID --body "your-aws-access-key"

# Add secrets from file
gh secret set GCP_SA_KEY < service-account-key.json
```

### Bulk Secret Addition Script

Create a `secrets.env` file (add to .gitignore):

```bash
MATWEBAPI_KEY=your_matwebapi_key
MATERIALS_PROJECT_KEY=your_materials_project_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
MONGODB_URI=your_mongodb_connection_string
```

Then run the setup script:

```bash
#!/bin/bash
# setup-secrets.sh

while IFS='=' read -r key value; do
  if [[ ! "$key" =~ ^#.* ]] && [[ -n "$key" ]]; then
    gh secret set "$key" --body "$value"
    echo "Added secret: $key"
  fi
done < secrets.env
```

## Environment-Specific Secrets

### Staging Environment
Prefix staging secrets with `STAGING_`:

```
STAGING_AWS_ACCESS_KEY_ID
STAGING_MONGODB_URI
STAGING_DOMAIN_NAME
```

### Production Environment
Use production secrets without prefix or with `PROD_`:

```
PROD_AWS_ACCESS_KEY_ID
PROD_MONGODB_URI
PROD_DOMAIN_NAME
```

## Security Best Practices

### 1. Principle of Least Privilege
- Grant minimal required permissions to service accounts
- Use separate credentials for different environments
- Regularly rotate access tokens and keys

### 2. Secret Rotation
```bash
# Rotate secrets regularly
gh secret set MATWEBAPI_KEY --body "new-rotated-key"
```

### 3. Audit Secret Usage
- Monitor secret access in GitHub Actions logs
- Use GitHub's audit log to track secret changes
- Set up alerts for unauthorized access attempts

### 4. Environment Isolation
- Use different databases for staging/production
- Separate cloud resources by environment
- Never share production secrets with development

## Verification and Testing

### Test Secret Configuration
```yaml
# .github/workflows/test-secrets.yml
name: Test Secrets Configuration

on:
  workflow_dispatch:

jobs:
  test-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Test AWS Credentials
        run: |
          if [ -z "${{ secrets.AWS_ACCESS_KEY_ID }}" ]; then
            echo "❌ AWS_ACCESS_KEY_ID not configured"
          else
            echo "✅ AWS_ACCESS_KEY_ID configured"
          fi

      - name: Test API Keys
        run: |
          if [ -z "${{ secrets.MATWEBAPI_KEY }}" ]; then
            echo "❌ MATWEBAPI_KEY not configured"
          else
            echo "✅ MATWEBAPI_KEY configured"
          fi
```

### Validate Deployment Pipeline
```bash
# Trigger deployment workflow
gh workflow run ci-cd.yml --ref main
```

## Troubleshooting

### Common Issues

1. **Secret not found**
   - Check secret name spelling (case-sensitive)
   - Verify secret exists in repository settings
   - Ensure workflow has access to secrets

2. **Invalid credentials**
   - Verify secret values are correct
   - Check for extra whitespace or newlines
   - Rotate expired tokens

3. **Permission denied**
   - Check service account permissions
   - Verify token scopes
   - Update IAM roles/policies

### Debug Commands
```yaml
# Add to workflow for debugging (remove in production)
- name: Debug Secrets
  run: |
    echo "Checking secret availability..."
    echo "AWS Key: ${{ secrets.AWS_ACCESS_KEY_ID != '' }}"
    echo "MatWeb Key: ${{ secrets.MATWEBAPI_KEY != '' }}"
```

## Quick Setup Checklist

- [ ] GHCR_TOKEN or Docker Hub credentials
- [ ] Cloud platform credentials (AWS/GCP/Azure)
- [ ] External API keys (MatWeb, Materials Project)
- [ ] Database connection strings
- [ ] Domain and SSL certificate info
- [ ] Monitoring service tokens
- [ ] Test secret configuration
- [ ] Run deployment pipeline test
- [ ] Configure secret rotation schedule

## Support and Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Secret Management](https://cli.github.com/manual/gh_secret)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides)

This configuration enables secure, automated deployments while maintaining proper separation of concerns across environments.