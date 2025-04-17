terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.49.1"
    }
    helm = { source = "hashicorp/helm", version = "~> 2.15.0" }
  }
}

provider "digitalocean" {
  token = var.do_token
}

# ===============================
# VARIABLES
# ===============================

variable "do_token" {
  description = "DigitalOcean API Token"
  type        = string
  sensitive   = true
}

variable "cluster_name" {
  description = "Name of the Kubernetes cluster"
  type        = string
  default     = "k8s-k6-cluster"
}

variable "region" {
  description = "Region where the cluster will be created"
  type        = string
  default     = "nyc3"
}

variable "k8s_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.32.2-do.0"
}

variable "node_size" {
  description = "Droplet size for worker nodes"
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "node_count" {
  description = "Number of worker nodes"
  type        = number
  default     = 2
}

# ===============================
# RESOURCE: KUBERNETES CLUSTER
# ===============================

resource "digitalocean_kubernetes_cluster" "k8s_cluster" {
  name    = var.cluster_name
  region  = var.region
  version = var.k8s_version

  node_pool {
    name       = "worker-pool"
    size       = var.node_size
    node_count = var.node_count
    auto_scale = false
  }
}

# ===============================
# SAVE KUBECONFIG TO FILE
# ===============================

resource "local_file" "kubeconfig" {
  content  = digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].raw_config
  filename = "${path.module}/kubeconfig.yaml"
}

# ===============================
# INSTALL K6 OPERATOR
# ===============================

resource "helm_release" "k6_operator" {
  name       = "k6-operator"
  repository = "https://grafana.github.io/helm-charts"
  chart      = "k6-operator"
  namespace  = "k6-operator-system"
  create_namespace = true
}

# ===============================
# OUTPUTS
# ===============================

output "cluster_id" {
  description = "ID of the created Kubernetes cluster"
  value       = digitalocean_kubernetes_cluster.k8s_cluster.id
}

output "kubeconfig" {
  description = "Kubeconfig for accessing the Kubernetes cluster"
  value       = digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].raw_config
  sensitive   = true
}