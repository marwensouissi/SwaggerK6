terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.49.1"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.36.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.15.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

variable "do_token" {
  description = "DigitalOcean API Token"
  type        = string
  sensitive   = true
}

variable "cluster_name" {
  default     = "k8s-k6-cluster"
  description = "Kubernetes cluster name"
}

variable "region" {
  default     = "nyc3"
  description = "DigitalOcean region"
}

variable "k8s_version" {
  default     = "1.32.2-do.0"
  description = "Kubernetes version"
}

variable "node_size" {
  default     = "s-2vcpu-4gb"
  description = "Node size"
}

variable "node_count" {
  default     = 2
  description = "Number of nodes"
}

resource "digitalocean_kubernetes_cluster" "k8s_cluster" {
  name    = var.cluster_name
  region  = var.region
  version = var.k8s_version

  node_pool {
    name       = "worker-pool"
    size       = var.node_size
    node_count = var.node_count
  }
}

resource "local_file" "kubeconfig_yaml" {
  content  = digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].raw_config
  filename = "${path.module}/kubeconfig_do.yaml"
}

provider "kubernetes" {
  config_path = local_file.kubeconfig_yaml.filename
  config_context = "do-${var.region}-${var.cluster_name}"

  depends_on = [local_file.kubeconfig_yaml]
}

provider "helm" {
  kubernetes {
    config_path    = local_file.kubeconfig_yaml.filename
    config_context = "do-${var.region}-${var.cluster_name}"
  }
  depends_on = [local_file.kubeconfig_yaml]
}

resource "null_resource" "wait_for_k8s" {
  depends_on = [local_file.kubeconfig_yaml]

  provisioner "local-exec" {
    command = <<EOT
      export KUBECONFIG=${local_file.kubeconfig_yaml.filename}
      echo "⏳ Waiting for Kubernetes cluster API..."
      for i in {1..30}; do
        if kubectl get nodes >/dev/null 2>&1; then
          echo "✅ Cluster is ready!"
          exit 0
        else
          echo "Still waiting..."
          sleep 10
        fi
      done
      echo "❌ Timed out waiting for cluster"
      exit 1
    EOT
  }
}

resource "helm_release" "k6_operator" {
  depends_on       = [null_resource.wait_for_k8s]
  name             = "k6-operator"
  repository       = "https://grafana.github.io/helm-charts"
  chart            = "k6-operator"
  namespace        = "default"
  create_namespace = true
  wait             = true
  timeout          = 300
}

output "kubeconfig_raw" {
  value     = digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].raw_config
  sensitive = true
}

output "kubeconfig_path" {
  value = abspath(local_file.kubeconfig_yaml.filename)
}
