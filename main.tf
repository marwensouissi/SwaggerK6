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

##########################
# VARIABLES
##########################

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
  default     = "1.33.1-do.1"
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

variable "enable_k6_operator" {
  description = "Whether to install k6-operator using Helm"
  type        = bool
  default     = true
}

##########################
# PROVIDERS
##########################

provider "digitalocean" {
  token = var.do_token
}

# Use kubeconfig file instead of inline creds
provider "kubernetes" {
  config_path = "${path.module}/kubeconfig_do.yaml"
}

provider "helm" {
  kubernetes {
    config_path = "${path.module}/kubeconfig_do.yaml"
  }
}

##########################
# RESOURCES
##########################

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

resource "helm_release" "k6_operator" {
  count            = var.enable_k6_operator ? 1 : 0
  name             = "k6-operator"
  repository       = "https://grafana.github.io/helm-charts"
  chart            = "k6-operator"
  namespace        = "default"
  create_namespace = true
  wait             = true
  timeout          = 300

  depends_on = [
    digitalocean_kubernetes_cluster.k8s_cluster,
    local_file.kubeconfig_yaml
  ]
   provisioner "local-exec" {
    command = <<EOT
      echo "Waiting for Kubernetes API to be ready..."
      for i in {1..30}; do
        if KUBECONFIG=${path.module}/kubeconfig_do.yaml kubectl get nodes; then
          echo "Kubernetes API is ready!"
          exit 0
        else
          echo "Retry $i/10: Kubernetes not ready yet..."
          sleep 10
        fi
      done
      echo "Timed out waiting for Kubernetes API."
      exit 1
    EOT
    interpreter = ["/bin/bash", "-c"]
  }

}




resource "local_file" "kubeconfig_yaml" {
  count    = var.enable_k6_operator ? 1 : 0
  content  = digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].raw_config
  filename = "${path.module}/kubeconfig_do.yaml"
}

resource "helm_release" "argocd" {
  name             = "argocd"
  namespace        = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "5.51.6" # You can use latest or pin a version
  create_namespace = true
  wait             = true
  timeout          = 300

values = [
  <<EOF
server:
  service:
    type: LoadBalancer
    ports:
      - name: http
        port: 80
        targetPort: 8777
      - name: https
        port: 443
        targetPort: 8777
EOF
]


  depends_on = [
    digitalocean_kubernetes_cluster.k8s_cluster,
    local_file.kubeconfig_yaml
  ]
}

resource "helm_release" "loki" {
  name             = "loki"
  namespace        = "loki"
  repository       = "https://grafana.github.io/helm-charts"
  chart            = "loki"
  create_namespace = true
  wait             = true

  values = [
    <<EOF
loki:
  auth_enabled: false
EOF
  ]
}


resource "helm_release" "promtail" {
  name             = "promtail"
  namespace        = "loki"
  repository       = "https://grafana.github.io/helm-charts"
  chart            = "promtail"
  wait             = true

  values = [
    <<EOF
config:
  clients:
    - url: http://loki.loki.svc.cluster.local:3100/loki/api/v1/push
  snippets:
    pipelineStages:
      - cri: {}
EOF
  ]
  depends_on = [
    helm_release.loki
  ]
}





##########################
# OUTPUTS
##########################

output "kubeconfig_raw" {
  value     = digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].raw_config
  sensitive = true
}

output "kubeconfig_path" {
  value       = var.enable_k6_operator ? abspath(local_file.kubeconfig_yaml[0].filename) : null
  description = "Path to the generated kubeconfig"
}

output "argocd_server_url" {
  value       = "http://${helm_release.argocd.name}.${helm_release.argocd.namespace}.svc.cluster.local"
  description = "Internal service URL for ArgoCD"
}

output "argocd_namespace" {
  value       = "argocd"
  description = "Namespace where ArgoCD is deployed"
} 