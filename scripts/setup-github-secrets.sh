#!/bin/bash

# MatTailor AI - GitHub Secrets Setup Script
# This script helps configure repository secrets for automated deployments

set -e

echo "🚀 MatTailor AI - GitHub Secrets Setup"
echo "======================================"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it first:"
    echo "   brew install gh  # macOS"
    echo "   sudo apt install gh  # Ubuntu"
    echo "   winget install GitHub.cli  # Windows"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub first:"
    gh auth login
fi

echo "✅ GitHub CLI is ready"
echo ""

# Function to add secret safely
add_secret() {
    local secret_name="$1"
    local secret_description="$2"
    local is_optional="$3"
    
    echo "🔑 Setting up: $secret_name"
    echo "   Description: $secret_description"
    
    if [ "$is_optional" = "true" ]; then
        echo -n "   Enter value (optional, press Enter to skip): "
    else
        echo -n "   Enter value (required): "
    fi
    
    read -s secret_value
    echo ""
    
    if [ -n "$secret_value" ]; then
        if gh secret set "$secret_name" --body "$secret_value" 2>/dev/null; then
            echo "   ✅ Successfully added $secret_name"
        else
            echo "   ❌ Failed to add $secret_name"
        fi
    elif [ "$is_optional" = "false" ]; then
        echo "   ⚠️  Skipped required secret: $secret_name"
    else
        echo "   ➡️  Skipped optional secret: $secret_name"
    fi
    echo ""
}

# Function to confirm setup
confirm_setup() {
    local category="$1"
    echo "📦 Configure $category secrets? (y/n)"
    read -r confirm
    [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]
}

echo "This script will help you configure GitHub repository secrets for:"
echo "• Container registry authentication"
echo "• Cloud platform deployment"
echo "• External API integrations"
echo "• Database connections"
echo "• Monitoring services"
echo ""

# Container Registry Secrets
if confirm_setup "Container Registry"; then
    echo "🐳 Container Registry Configuration"
    echo "Choose your container registry:"
    echo "1) GitHub Container Registry (GHCR) - Recommended"
    echo "2) Docker Hub"
    echo "3) Both"
    echo -n "Enter choice (1-3): "
    read -r registry_choice
    
    case $registry_choice in
        1|3)
            echo ""
            echo "📝 For GHCR, you need a Personal Access Token with 'write:packages' scope"
            echo "   Create one at: https://github.com/settings/tokens"
            add_secret "GHCR_TOKEN" "GitHub Container Registry Personal Access Token" false
            ;;
    esac
    
    case $registry_choice in
        2|3)
            add_secret "DOCKER_HUB_USERNAME" "Docker Hub username" false
            add_secret "DOCKER_HUB_ACCESS_TOKEN" "Docker Hub access token" false
            ;;
    esac
fi

# Cloud Platform Secrets
if confirm_setup "Cloud Platform"; then
    echo "☁️  Cloud Platform Configuration"
    echo "Select your deployment platform:"
    echo "1) AWS (ECS/Fargate)"
    echo "2) Google Cloud Platform (GKE)"
    echo "3) Azure Container Instances"
    echo "4) Railway"
    echo "5) Render"
    echo "6) Multiple platforms"
    echo -n "Enter choice (1-6): "
    read -r cloud_choice
    
    case $cloud_choice in
        1|6)
            echo ""
            echo "🟧 AWS Configuration"
            add_secret "AWS_ACCESS_KEY_ID" "AWS Access Key ID" false
            add_secret "AWS_SECRET_ACCESS_KEY" "AWS Secret Access Key" false
            add_secret "AWS_REGION" "AWS Region (e.g., us-east-1)" false
            add_secret "ECS_CLUSTER_NAME" "ECS Cluster Name" true
            add_secret "ECS_SERVICE_NAME" "ECS Service Name" true
            ;;
    esac
    
    case $cloud_choice in
        2|6)
            echo ""
            echo "🟢 Google Cloud Platform Configuration"
            echo "   Create a service account and download the JSON key"
            add_secret "GCP_SA_KEY" "GCP Service Account JSON Key (base64 encoded)" false
            add_secret "GCP_PROJECT_ID" "GCP Project ID" false
            add_secret "GKE_CLUSTER_NAME" "GKE Cluster Name" true
            add_secret "GKE_ZONE" "GKE Zone (e.g., us-central1-a)" true
            ;;
    esac
    
    case $cloud_choice in
        3|6)
            echo ""
            echo "🔵 Azure Configuration"
            add_secret "AZURE_CLIENT_ID" "Azure Service Principal Client ID" false
            add_secret "AZURE_CLIENT_SECRET" "Azure Service Principal Client Secret" false
            add_secret "AZURE_TENANT_ID" "Azure Tenant ID" false
            add_secret "AZURE_SUBSCRIPTION_ID" "Azure Subscription ID" false
            ;;
    esac
    
    case $cloud_choice in
        4|6)
            echo ""
            echo "🚂 Railway Configuration"
            echo "   Get your token from: https://railway.app/account/tokens"
            add_secret "RAILWAY_TOKEN" "Railway API Token" false
            ;;
    esac
    
    case $cloud_choice in
        5|6)
            echo ""
            echo "🎨 Render Configuration"
            echo "   Get your API key from: https://dashboard.render.com/account/api-keys"
            add_secret "RENDER_API_KEY" "Render API Key" false
            add_secret "RENDER_SERVICE_ID" "Render Service ID" false
            ;;
    esac
fi

# External API Secrets
if confirm_setup "External APIs"; then
    echo "🔌 External API Configuration"
    add_secret "MATWEBAPI_KEY" "MatWeb API Key for material data" true
    add_secret "MATERIALS_PROJECT_KEY" "Materials Project API Key" true
    add_secret "OPENAI_API_KEY" "OpenAI API Key for AI recommendations" true
    add_secret "HUGGINGFACE_TOKEN" "Hugging Face API Token for ML models" true
fi

# Database Secrets
if confirm_setup "Database"; then
    echo "🗄️  Database Configuration"
    add_secret "MONGODB_URI" "MongoDB connection string" true
    add_secret "MONGODB_DATABASE" "MongoDB database name" true
    add_secret "REDIS_URL" "Redis connection URL for caching" true
fi

# Storage Secrets
if confirm_setup "File Storage"; then
    echo "📁 File Storage Configuration"
    add_secret "S3_BUCKET_NAME" "AWS S3 bucket name for assets" true
    add_secret "S3_REGION" "AWS S3 region" true
fi

# Monitoring Secrets
if confirm_setup "Monitoring & Analytics"; then
    echo "📊 Monitoring Configuration"
    add_secret "SENTRY_DSN" "Sentry DSN for error tracking" true
    add_secret "SENTRY_AUTH_TOKEN" "Sentry auth token for releases" true
    add_secret "DATADOG_API_KEY" "DataDog API key for APM" true
    add_secret "DATADOG_APP_KEY" "DataDog application key" true
fi

# SSL/Domain Secrets
if confirm_setup "SSL & Domain"; then
    echo "🔒 SSL & Domain Configuration"
    add_secret "LETSENCRYPT_EMAIL" "Email for Let's Encrypt certificates" true
    add_secret "DOMAIN_NAME" "Your domain name (e.g., mattailor.ai)" true
fi

# Notification Secrets
if confirm_setup "Notifications"; then
    echo "📢 Notification Configuration"
    add_secret "SLACK_WEBHOOK_URL" "Slack webhook URL for deployment notifications" true
    add_secret "DISCORD_WEBHOOK_URL" "Discord webhook URL for notifications" true
fi

echo "🎉 GitHub Secrets Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Verify secrets in GitHub repository settings"
echo "2. Test the CI/CD pipeline with a commit"
echo "3. Check deployment workflows in Actions tab"
echo "4. Configure environment protection rules if needed"
echo ""
echo "🔍 To view configured secrets:"
echo "   gh secret list"
echo ""
echo "📚 For more information, see:"
echo "   docs/GITHUB_SECRETS.md"
echo "   docs/CICD_SETUP.md"
echo ""

# Test secrets configuration
echo "🧪 Would you like to run a quick test of the configured secrets? (y/n)"
read -r test_confirm

if [ "$test_confirm" = "y" ] || [ "$test_confirm" = "Y" ]; then
    echo "Running secrets configuration test..."
    
    # Create a temporary workflow file for testing
    cat > .github/workflows/test-secrets.yml << 'EOF'
name: Test Secrets Configuration

on:
  workflow_dispatch:

jobs:
  test-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Test Container Registry Secrets
        run: |
          echo "Testing container registry secrets..."
          if [ -n "${{ secrets.GHCR_TOKEN }}" ]; then
            echo "✅ GHCR_TOKEN configured"
          fi
          if [ -n "${{ secrets.DOCKER_HUB_USERNAME }}" ]; then
            echo "✅ DOCKER_HUB_USERNAME configured"
          fi
          if [ -n "${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}" ]; then
            echo "✅ DOCKER_HUB_ACCESS_TOKEN configured"
          fi

      - name: Test Cloud Platform Secrets
        run: |
          echo "Testing cloud platform secrets..."
          if [ -n "${{ secrets.AWS_ACCESS_KEY_ID }}" ]; then
            echo "✅ AWS_ACCESS_KEY_ID configured"
          fi
          if [ -n "${{ secrets.GCP_SA_KEY }}" ]; then
            echo "✅ GCP_SA_KEY configured"
          fi
          if [ -n "${{ secrets.RAILWAY_TOKEN }}" ]; then
            echo "✅ RAILWAY_TOKEN configured"
          fi

      - name: Test External API Secrets
        run: |
          echo "Testing external API secrets..."
          if [ -n "${{ secrets.MATWEBAPI_KEY }}" ]; then
            echo "✅ MATWEBAPI_KEY configured"
          fi
          if [ -n "${{ secrets.MATERIALS_PROJECT_KEY }}" ]; then
            echo "✅ MATERIALS_PROJECT_KEY configured"
          fi
          if [ -n "${{ secrets.OPENAI_API_KEY }}" ]; then
            echo "✅ OPENAI_API_KEY configured"
          fi

      - name: Test Database Secrets
        run: |
          echo "Testing database secrets..."
          if [ -n "${{ secrets.MONGODB_URI }}" ]; then
            echo "✅ MONGODB_URI configured"
          fi
          if [ -n "${{ secrets.REDIS_URL }}" ]; then
            echo "✅ REDIS_URL configured"
          fi

      - name: Configuration Summary
        run: |
          echo "🎉 Secrets configuration test completed!"
          echo "Check the logs above to see which secrets are properly configured."
EOF

    # Commit and push the test workflow
    git add .github/workflows/test-secrets.yml
    git commit -m "Add secrets configuration test workflow"
    git push
    
    echo "✅ Test workflow created and pushed"
    echo "🚀 Triggering test workflow..."
    
    # Trigger the test workflow
    gh workflow run test-secrets.yml
    
    echo "📊 Check the workflow run at:"
    echo "   https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name')/actions"
fi

echo ""
echo "✨ All done! Your MatTailor AI repository is now configured for automated deployments."