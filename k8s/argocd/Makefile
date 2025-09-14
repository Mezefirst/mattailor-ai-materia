# MatTailor AI ArgoCD Management Makefile

.PHONY: help install uninstall status sync clean setup-repo setup-notifications

# Default target
help:
	@echo "MatTailor AI ArgoCD Management"
	@echo ""
	@echo "Available targets:"
	@echo "  install              - Install ArgoCD and deploy applications"
	@echo "  install-argocd       - Install only ArgoCD"
	@echo "  deploy-apps          - Deploy applications only"
	@echo "  uninstall            - Uninstall ArgoCD and applications"
	@echo "  status               - Show application status"
	@echo "  sync                 - Sync all applications"
	@echo "  sync-dev             - Sync development application"
	@echo "  sync-staging         - Sync staging application"
	@echo "  sync-prod            - Sync production application"
	@echo "  setup-repo           - Setup repository access"
	@echo "  setup-notifications  - Setup notification configuration"
	@echo "  clean                - Clean failed deployments"
	@echo "  port-forward         - Port forward ArgoCD UI"
	@echo "  get-password         - Get ArgoCD admin password"

# Variables
ARGOCD_NAMESPACE = argocd
KUBECTL = kubectl
KUSTOMIZE = kustomize

# Installation targets
install: install-argocd setup-repo deploy-apps
	@echo "ArgoCD installation completed!"

install-argocd:
	@echo "Installing ArgoCD..."
	$(KUBECTL) create namespace $(ARGOCD_NAMESPACE) --dry-run=client -o yaml | $(KUBECTL) apply -f -
	$(KUBECTL) apply -k install/ -n $(ARGOCD_NAMESPACE)
	@echo "Waiting for ArgoCD to be ready..."
	$(KUBECTL) wait --for=condition=available --timeout=300s deployment/argocd-server -n $(ARGOCD_NAMESPACE)
	$(KUBECTL) wait --for=condition=available --timeout=300s deployment/argocd-repo-server -n $(ARGOCD_NAMESPACE)
	@echo "ArgoCD installed successfully!"

deploy-apps:
	@echo "Deploying ArgoCD projects and applications..."
	$(KUBECTL) apply -f projects/
	$(KUBECTL) apply -f applications/
	$(KUBECTL) apply -f policies/
	@echo "Applications deployed successfully!"

# Repository and notifications setup
setup-repo:
	@echo "Setting up repository access..."
	@echo "Please configure repositories/git-repo-secret.yaml with your Git credentials"
	@echo "Then run: kubectl apply -f repositories/git-repo-secret.yaml"

setup-notifications:
	@echo "Setting up notifications..."
	@if [ -f "repositories/notification-secrets.yaml" ]; then \
		$(KUBECTL) apply -f repositories/notification-secrets.yaml; \
		echo "Notifications configured!"; \
	else \
		echo "Please configure repositories/notification-secrets.yaml with your notification settings"; \
		echo "Then run: kubectl apply -f repositories/notification-secrets.yaml"; \
	fi

# Status and sync targets
status:
	@echo "ArgoCD Application Status:"
	$(KUBECTL) get applications -n $(ARGOCD_NAMESPACE) -o wide

sync:
	@echo "Syncing all applications..."
	$(KUBECTL) patch application mattailor-ai-dev -n $(ARGOCD_NAMESPACE) --type merge -p '{"operation":{"sync":{}}}'
	$(KUBECTL) patch application mattailor-ai-staging -n $(ARGOCD_NAMESPACE) --type merge -p '{"operation":{"sync":{}}}'
	$(KUBECTL) patch application mattailor-ai-prod -n $(ARGOCD_NAMESPACE) --type merge -p '{"operation":{"sync":{}}}'

sync-dev:
	@echo "Syncing development application..."
	$(KUBECTL) patch application mattailor-ai-dev -n $(ARGOCD_NAMESPACE) --type merge -p '{"operation":{"sync":{}}}'

sync-staging:
	@echo "Syncing staging application..."
	$(KUBECTL) patch application mattailor-ai-staging -n $(ARGOCD_NAMESPACE) --type merge -p '{"operation":{"sync":{}}}'

sync-prod:
	@echo "Syncing production application..."
	$(KUBECTL) patch application mattailor-ai-prod -n $(ARGOCD_NAMESPACE) --type merge -p '{"operation":{"sync":{}}}'

# Utility targets
port-forward:
	@echo "Port forwarding ArgoCD UI to localhost:8080"
	@echo "Visit https://localhost:8080 to access ArgoCD"
	$(KUBECTL) port-forward svc/argocd-server -n $(ARGOCD_NAMESPACE) 8080:443

get-password:
	@echo "ArgoCD Admin Password:"
	@$(KUBECTL) -n $(ARGOCD_NAMESPACE) get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
	@echo ""

# Cleanup targets
clean:
	@echo "Cleaning failed resources..."
	$(KUBECTL) delete pods --field-selector=status.phase=Failed -n $(ARGOCD_NAMESPACE)
	$(KUBECTL) delete pods --field-selector=status.phase=Succeeded -n $(ARGOCD_NAMESPACE)

uninstall:
	@echo "Uninstalling ArgoCD and applications..."
	$(KUBECTL) delete applications --all -n $(ARGOCD_NAMESPACE)
	$(KUBECTL) delete appprojects --all -n $(ARGOCD_NAMESPACE)
	$(KUBECTL) delete -k install/ -n $(ARGOCD_NAMESPACE) || true
	$(KUBECTL) delete namespace $(ARGOCD_NAMESPACE)
	@echo "ArgoCD uninstalled!"

# Health checks
health-check:
	@echo "Checking ArgoCD health..."
	$(KUBECTL) get pods -n $(ARGOCD_NAMESPACE)
	@echo ""
	@echo "Application health:"
	$(KUBECTL) get applications -n $(ARGOCD_NAMESPACE) -o custom-columns=NAME:.metadata.name,HEALTH:.status.health.status,SYNC:.status.sync.status

# Advanced targets
refresh:
	@echo "Refreshing application manifests..."
	$(KUBECTL) patch application mattailor-ai-dev -n $(ARGOCD_NAMESPACE) --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{"revision":"HEAD"}}}'

rollback-dev:
	@echo "Rolling back development application..."
	$(KUBECTL) patch application mattailor-ai-dev -n $(ARGOCD_NAMESPACE) --type merge -p '{"operation":{"rollback":{"id":1}}}'

# Monitoring
logs-server:
	$(KUBECTL) logs -f deployment/argocd-server -n $(ARGOCD_NAMESPACE)

logs-controller:
	$(KUBECTL) logs -f deployment/argocd-application-controller -n $(ARGOCD_NAMESPACE)

logs-repo:
	$(KUBECTL) logs -f deployment/argocd-repo-server -n $(ARGOCD_NAMESPACE)

# Security
update-password:
	@echo "Updating ArgoCD admin password..."
	@read -s -p "Enter new password: " PASSWORD; \
	$(KUBECTL) -n $(ARGOCD_NAMESPACE) patch secret argocd-secret \
		-p '{"stringData": {"admin.password": "'$$PASSWORD'", "admin.passwordMtime": "'$$(date +%FT%T%Z)'"}}'