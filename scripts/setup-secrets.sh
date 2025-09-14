#!/bin/bash

# MatTailor AI - Setup GitHub Secrets Script
# This script helps configure GitHub repository secrets for automated deployment

set -e

echo "🔐 MatTailor AI - GitHub Secrets Setup"
echo "======================================="

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

# Check if user is logged in
if ! gh auth status &> /dev/null; then
    echo "❌ Please login to GitHub CLI first:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready"

# Function to set secret
set_secret() {
    local name=$1
    local description=$2
    
    echo ""
    echo "Setting up: $name"
    echo "Description: $description"
    read -s -p "Enter value for $name (input will be hidden): " value
    echo ""
    
    if [ -n "$value" ]; then
        gh secret set "$name" --body "$value"
        echo "✅ Secret $name has been set"
    else
        echo "⚠️  Skipping $name (no value provided)"
    fi
}

echo ""
echo "🚀 Setting up GitHub repository secrets..."
echo ""

# Required API Keys
set_secret "MATWEB_API_KEY" "API key for MatWeb material database"
set_secret "MATERIALS_PROJECT_API_KEY" "API key for Materials Project database"

# Optional integrations
echo ""
echo "📝 Optional integrations:"
set_secret "OPENAI_API_KEY" "OpenAI API key for AI recommendations (optional)"
set_secret "SNYK_TOKEN" "Snyk token for security scanning (optional)"

# Docker registry secrets
echo ""
echo "🐳 Docker Registry Configuration:"
echo "Note: GITHUB_TOKEN is automatically provided by GitHub Actions"

# Database secrets (for future backend)
echo ""
echo "🗄️  Database Configuration (optional for future backend):"
set_secret "DATABASE_URL" "PostgreSQL database URL (optional)"
set_secret "REDIS_URL" "Redis cache URL (optional)"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create .env file from .env.example"
echo "2. Test the deployment pipeline by pushing to your repository"
echo "3. Check GitHub Actions tab for build status"
echo "4. Configure your Kubernetes cluster if using K8s deployment"
echo ""
echo "🔗 Useful commands:"
echo "   gh secret list                    # List all secrets"
echo "   gh secret delete SECRET_NAME     # Delete a secret"
echo "   gh workflow run ci-cd.yml         # Manually trigger workflow"
echo ""