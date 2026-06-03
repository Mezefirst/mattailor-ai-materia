variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "westeurope"
}

variable "environment_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "mattailor"

  validation {
    condition     = can(regex("^[a-z0-9-]{3,20}$", var.environment_name))
    error_message = "Environment name must be 3-20 characters, lowercase letters, numbers, and hyphens only."
  }
}

variable "resource_group_name" {
  description = "Azure Resource Group name"
  type        = string
  default     = "mattailor-rg"
}

variable "static_web_app_sku" {
  description = "Static Web App SKU (Free or Standard)"
  type        = string
  default     = "Free"

  validation {
    condition     = contains(["Free", "Standard"], var.static_web_app_sku)
    error_message = "Must be either 'Free' or 'Standard'."
  }
}

variable "function_app_sku" {
  description = "Function App SKU (e.g., B1, P1V2)"
  type        = string
  default     = "B1"
}

variable "app_settings" {
  description = "Additional app settings for Function App"
  type        = map(string)
  default     = {}
}
