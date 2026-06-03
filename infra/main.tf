terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.68"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# Application Insights for monitoring
resource "azurerm_application_insights" "appinsights" {
  name                = "${var.environment_name}-appinsights"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"

  tags = local.tags
}

# Storage account for Static Web Apps and Function artifacts
resource "azurerm_storage_account" "storage" {
  name                     = "${replace(var.environment_name, "-", "")}storage"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "GRS"

  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "HEAD"]
      allowed_origins    = ["*"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }

  tags = local.tags
}

# Static Web App for React frontend
resource "azurerm_static_web_app" "frontend" {
  name                = "${var.environment_name}-swa"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_tier            = var.static_web_app_sku

  app_settings = {
    VITE_API_URL = "https://${azurerm_linux_function_app.backend.default_hostname}"
  }

  tags = local.tags
}

# App Service Plan for Azure Functions
resource "azurerm_service_plan" "plan" {
  name                = "${var.environment_name}-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = var.function_app_sku

  tags = local.tags
}

# Azure Function App for FastAPI backend
resource "azurerm_linux_function_app" "backend" {
  name                = "${var.environment_name}-func"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.plan.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key

  site_config {
    application_stack {
      python_version = "3.11"
    }
    
    cors {
      allowed_origins = ["*"]
    }

    use_32_bit_worker = false
  }

  app_settings = {
    "ENABLE_ORYX_BUILD"             = "true"
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.appinsights.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.appinsights.connection_string
  }

  https_only = true

  tags = local.tags
}

# Static Web App settings to route API calls to Function App
resource "azurerm_static_web_app_custom_domain" "api_route" {
  static_web_app_id = azurerm_static_web_app.frontend.id
  domain_name       = "api.${azurerm_static_web_app.frontend.default_host_name}"
  validation_type   = "cname"
}

locals {
  tags = {
    environment = var.environment_name
    managed_by  = "terraform"
    application = "mattailor-ai"
  }
}

output "frontend_url" {
  value       = "https://${azurerm_static_web_app.frontend.default_host_name}"
  description = "Frontend Static Web App URL"
}

output "backend_url" {
  value       = "https://${azurerm_linux_function_app.backend.default_hostname}"
  description = "Backend Azure Function URL"
}

output "app_insights_key" {
  value       = azurerm_application_insights.appinsights.instrumentation_key
  sensitive   = true
  description = "Application Insights instrumentation key"
}
