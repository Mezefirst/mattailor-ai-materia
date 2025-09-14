# MatTailor AI Kubernetes Deployment Makefile
.PHONY: help build deploy preview status clean install-deps

# Default environment
ENV ?= development
IMAGE_TAG ?= latest
REGISTRY ?= ghcr.io/your-org/mattailor-ai

# Colors for pretty output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)MatTailor AI Kubernetes Deployment$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)Environment variables:$(NC)"
	@echo "  $(YELLOW)ENV$(NC)        Environment to deploy (development, staging, production)"
	@echo "  $(YELLOW)IMAGE_TAG$(NC)  Docker image tag to deploy"
	@echo "  $(YELLOW)REGISTRY$(NC)   Container registry URL"
	@echo ""
	@echo "$(GREEN)Examples:$(NC)"
	@echo "  make deploy ENV=staging"
	@echo "  make preview ENV=production"
	@echo "  make status ENV=development"

install-deps: ## Install required dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@command -v kubectl >/dev/null 2>&1 || { echo "$(RED)kubectl is required but not installed$(NC)"; exit 1; }
	@command -v kustomize >/dev/null 2>&1 || { echo "$(RED)kustomize is required but not installed$(NC)"; exit 1; }
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)docker is required but not installed$(NC)"; exit 1; }
	@echo "$(GREEN)All dependencies are installed$(NC)"

validate: ## Validate Kubernetes manifests
	@echo "$(BLUE)Validating manifests for $(ENV) environment...$(NC)"
	@kubectl kustomize k8s/overlays/$(ENV) | kubectl apply --dry-run=client -f -
	@echo "$(GREEN)Manifests are valid$(NC)"

preview: validate ## Preview deployment changes
	@echo "$(BLUE)Previewing deployment for $(ENV) environment...$(NC)"
	@kubectl kustomize k8s/overlays/$(ENV)

build-frontend: ## Build frontend Docker image
	@echo "$(BLUE)Building frontend image...$(NC)"
	@docker build -f Dockerfile.frontend -t $(REGISTRY)/frontend:$(IMAGE_TAG) .
	@echo "$(GREEN)Frontend image built: $(REGISTRY)/frontend:$(IMAGE_TAG)$(NC)"

build-backend: ## Build backend Docker image
	@echo "$(BLUE)Building backend image...$(NC)"
	@docker build -f Dockerfile.backend -t $(REGISTRY)/backend:$(IMAGE_TAG) .
	@echo "$(GREEN)Backend image built: $(REGISTRY)/backend:$(IMAGE_TAG)$(NC)"

build: build-frontend build-backend ## Build all Docker images

push-frontend: build-frontend ## Build and push frontend image
	@echo "$(BLUE)Pushing frontend image...$(NC)"
	@docker push $(REGISTRY)/frontend:$(IMAGE_TAG)
	@echo "$(GREEN)Frontend image pushed$(NC)"

push-backend: build-backend ## Build and push backend image
	@echo "$(BLUE)Pushing backend image...$(NC)"
	@docker push $(REGISTRY)/backend:$(IMAGE_TAG)
	@echo "$(GREEN)Backend image pushed$(NC)"

push: push-frontend push-backend ## Build and push all images

deploy: validate ## Deploy to specified environment
	@echo "$(BLUE)Deploying to $(ENV) environment...$(NC)"
	@kubectl apply -k k8s/overlays/$(ENV)
	@$(MAKE) wait-rollout ENV=$(ENV)
	@echo "$(GREEN)Deployment completed successfully$(NC)"

wait-rollout: ## Wait for deployment rollout to complete
	@echo "$(BLUE)Waiting for rollout to complete...$(NC)"
	@if [ "$(ENV)" = "development" ]; then \
		kubectl rollout status deployment/dev-mattailor-frontend -n mattailor-ai-dev --timeout=300s; \
		kubectl rollout status deployment/dev-mattailor-backend -n mattailor-ai-dev --timeout=300s; \
	elif [ "$(ENV)" = "staging" ]; then \
		kubectl rollout status deployment/staging-mattailor-frontend -n mattailor-ai-staging --timeout=600s; \
		kubectl rollout status deployment/staging-mattailor-backend -n mattailor-ai-staging --timeout=600s; \
	elif [ "$(ENV)" = "production" ]; then \
		kubectl rollout status deployment/prod-mattailor-frontend -n mattailor-ai-prod --timeout=900s; \
		kubectl rollout status deployment/prod-mattailor-backend -n mattailor-ai-prod --timeout=900s; \
	fi

status: ## Get deployment status
	@echo "$(BLUE)Getting status for $(ENV) environment...$(NC)"
	@if [ "$(ENV)" = "development" ]; then \
		kubectl get all -n mattailor-ai-dev; \
	elif [ "$(ENV)" = "staging" ]; then \
		kubectl get all -n mattailor-ai-staging; \
	elif [ "$(ENV)" = "production" ]; then \
		kubectl get all -n mattailor-ai-prod; \
	fi

logs-frontend: ## Get frontend logs
	@if [ "$(ENV)" = "development" ]; then \
		kubectl logs deployment/dev-mattailor-frontend -n mattailor-ai-dev --tail=100 -f; \
	elif [ "$(ENV)" = "staging" ]; then \
		kubectl logs deployment/staging-mattailor-frontend -n mattailor-ai-staging --tail=100 -f; \
	elif [ "$(ENV)" = "production" ]; then \
		kubectl logs deployment/prod-mattailor-frontend -n mattailor-ai-prod --tail=100 -f; \
	fi

logs-backend: ## Get backend logs
	@if [ "$(ENV)" = "development" ]; then \
		kubectl logs deployment/dev-mattailor-backend -n mattailor-ai-dev --tail=100 -f; \
	elif [ "$(ENV)" = "staging" ]; then \
		kubectl logs deployment/staging-mattailor-backend -n mattailor-ai-staging --tail=100 -f; \
	elif [ "$(ENV)" = "production" ]; then \
		kubectl logs deployment/prod-mattailor-backend -n mattailor-ai-prod --tail=100 -f; \
	fi

scale-frontend: ## Scale frontend deployment (use REPLICAS=N)
	@echo "$(BLUE)Scaling frontend to $(REPLICAS) replicas...$(NC)"
	@if [ "$(ENV)" = "development" ]; then \
		kubectl scale deployment/dev-mattailor-frontend --replicas=$(REPLICAS) -n mattailor-ai-dev; \
	elif [ "$(ENV)" = "staging" ]; then \
		kubectl scale deployment/staging-mattailor-frontend --replicas=$(REPLICAS) -n mattailor-ai-staging; \
	elif [ "$(ENV)" = "production" ]; then \
		kubectl scale deployment/prod-mattailor-frontend --replicas=$(REPLICAS) -n mattailor-ai-prod; \
	fi

scale-backend: ## Scale backend deployment (use REPLICAS=N)
	@echo "$(BLUE)Scaling backend to $(REPLICAS) replicas...$(NC)"
	@if [ "$(ENV)" = "development" ]; then \
		kubectl scale deployment/dev-mattailor-backend --replicas=$(REPLICAS) -n mattailor-ai-dev; \
	elif [ "$(ENV)" = "staging" ]; then \
		kubectl scale deployment/staging-mattailor-backend --replicas=$(REPLICAS) -n mattailor-ai-staging; \
	elif [ "$(ENV)" = "production" ]; then \
		kubectl scale deployment/prod-mattailor-backend --replicas=$(REPLICAS) -n mattailor-ai-prod; \
	fi

rollback: ## Rollback deployment to previous version
	@echo "$(YELLOW)Rolling back $(ENV) deployment...$(NC)"
	@if [ "$(ENV)" = "development" ]; then \
		kubectl rollout undo deployment/dev-mattailor-frontend -n mattailor-ai-dev; \
		kubectl rollout undo deployment/dev-mattailor-backend -n mattailor-ai-dev; \
	elif [ "$(ENV)" = "staging" ]; then \
		kubectl rollout undo deployment/staging-mattailor-frontend -n mattailor-ai-staging; \
		kubectl rollout undo deployment/staging-mattailor-backend -n mattailor-ai-staging; \
	elif [ "$(ENV)" = "production" ]; then \
		kubectl rollout undo deployment/prod-mattailor-frontend -n mattailor-ai-prod; \
		kubectl rollout undo deployment/prod-mattailor-backend -n mattailor-ai-prod; \
	fi
	@$(MAKE) wait-rollout ENV=$(ENV)
	@echo "$(GREEN)Rollback completed$(NC)"

delete: ## Delete deployment (with confirmation)
	@echo "$(RED)This will delete the $(ENV) deployment!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		kubectl delete -k k8s/overlays/$(ENV); \
		echo "$(GREEN)Deployment deleted$(NC)"; \
	else \
		echo "$(YELLOW)Deletion cancelled$(NC)"; \
	fi

clean: ## Clean up Docker images
	@echo "$(BLUE)Cleaning up Docker images...$(NC)"
	@docker system prune -f
	@echo "$(GREEN)Cleanup completed$(NC)"

health-check: ## Run health checks
	@echo "$(BLUE)Running health checks for $(ENV)...$(NC)"
	@if [ "$(ENV)" = "development" ]; then \
		kubectl exec deployment/dev-mattailor-backend -n mattailor-ai-dev -- curl -f http://localhost:8000/health; \
	elif [ "$(ENV)" = "staging" ]; then \
		kubectl exec deployment/staging-mattailor-backend -n mattailor-ai-staging -- curl -f http://localhost:8000/health; \
	elif [ "$(ENV)" = "production" ]; then \
		kubectl exec deployment/prod-mattailor-backend -n mattailor-ai-prod -- curl -f http://localhost:8000/health; \
	fi
	@echo "$(GREEN)Health check passed$(NC)"

# Development shortcuts
dev-deploy: ## Deploy to development
	@$(MAKE) deploy ENV=development

staging-deploy: ## Deploy to staging
	@$(MAKE) deploy ENV=staging

prod-deploy: ## Deploy to production
	@$(MAKE) deploy ENV=production

# Monitoring shortcuts
dev-status: ## Get development status
	@$(MAKE) status ENV=development

staging-status: ## Get staging status
	@$(MAKE) status ENV=staging

prod-status: ## Get production status
	@$(MAKE) status ENV=production