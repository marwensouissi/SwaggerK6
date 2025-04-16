terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.49.1"
    }
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
resource "null_resource" "install_k6_operator" {
  depends_on = [digitalocean_kubernetes_cluster.k8s_cluster]

  provisioner "local-exec" {
    command = "bash ${path.module}/bootstrap-k6.sh"
  }
}


# ===============================
# OUTPUT
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
