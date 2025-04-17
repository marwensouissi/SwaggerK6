terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.49"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.15"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "~> 1.14"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }

  required_version = ">= 1.3.0"
}

provider "digitalocean" {
  token = var.do_token
}

provider "kubernetes" {
  load_config_file = false
  host             = digitalocean_kubernetes_cluster.cluster.endpoint
  token            = digitalocean_kubernetes_cluster.cluster.kube_config[0].token
  cluster_ca_certificate = base64decode(
    digitalocean_kubernetes_cluster.cluster.kube_config[0].cluster_ca_certificate
  )
}

provider "kubectl" {
  load_config_file = false
  host             = digitalocean_kubernetes_cluster.cluster.endpoint
  token            = digitalocean_kubernetes_cluster.cluster.kube_config[0].token
  cluster_ca_certificate = base64decode(
    digitalocean_kubernetes_cluster.cluster.kube_config[0].cluster_ca_certificate
  )
  apply_retry_count = 5
}

provider "helm" {
  kubernetes {
    host             = digitalocean_kubernetes_cluster.cluster.endpoint
    token            = digitalocean_kubernetes_cluster.cluster.kube_config[0].token
    cluster_ca_certificate = base64decode(
      digitalocean_kubernetes_cluster.cluster.kube_config[0].cluster_ca_certificate
    )
  }
}

variable "do_token" {
  description = "DigitalOcean API Token"
  type        = string
  sensitive   = true
}

variable "cluster_name" {
  description = "Name of the Kubernetes cluster"
  type        = string
  default     = "cluster"
}

variable "cluster_region" {
  description = "Region where the cluster will be created"
  type        = string
  default     = "fra1"
}

variable "node_pool_name" {
  description = "Name of the autoscaling node pool"
  type        = string
  default     = "worker_pool"
}

variable "node_pool_size" {
  description = "Droplet size for the autoscaling node pool"
  type        = string
  default     = "s-1vcpu-3gb" # 1 vCPU, 3GB RAM
}

variable "node_count_min" {
  description = "Minimum number of nodes in the autoscaling node pool"
  type        = number
  default     = 2
}

variable "node_count_max" {
  description = "Maximum number of nodes in the autoscaling node pool"
  type        = number
  default     = 5
}

variable "container_registry_name" {
  description = "Name of the DigitalOcean Container Registry"
  type        = string
  default     = "registry"
}

resource "digitalocean_kubernetes_cluster" "cluster" {
  name    = var.cluster_name
  region  = var.cluster_region
  version = "1.28.2-do.0" # Updated to a modern, supported version

  node_pool {
    name       = "default-pool"
    size       = "s-2vcpu-2gb"
    node_count = 1
  }
}

resource "digitalocean_kubernetes_node_pool" "node-pool" {
  cluster_id = digitalocean_kubernetes_cluster.cluster.id

  name       = var.node_pool_name
  size       = var.node_pool_size
  node_count = var.node_count_min
  auto_scale = true
  min_nodes  = var.node_count_min
  max_nodes  = var.node_count_max
}

resource "digitalocean_container_registry" "registry" {
  name = var.container_registry_name
}

resource "local_file" "kubeconfig" {
  content         = digitalocean_kubernetes_cluster.cluster.kube_config[0].raw_config
  filename        = "${path.module}/kubeconfig.yaml"
  file_permission = "0600"
}

resource "helm_release" "metrics-server" {
  name       = "metrics-server"
  repository = "https://charts.bitnami.com/bitnami" # Updated to Bitnami
  chart      = "metrics-server"
  namespace  = "kube-system"

  values = [
    file("metrics-server-values.yaml")
  ]
}

resource "kubernetes_namespace" "ingress" {
  metadata {
    name = "ingress-nginx"
  }
}

resource "helm_release" "ingress-nginx" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = kubernetes_namespace.ingress.metadata[0].name
  depends_on = [kubernetes_namespace.ingress]
}

resource "kubernetes_namespace" "cert-manager" {
  metadata {
    name = "cert-manager"
  }
}

resource "helm_release" "cert-manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  namespace  = kubernetes_namespace.cert-manager.metadata[0].name

  set {
    name  = "installCRDs"
    value = "true"
  }

  depends_on = [kubernetes_namespace.cert-manager]
}

resource "kubectl_manifest" "letsencrypt-issuer" {
  yaml_body  = file("${path.module}/letsencrypt-issuer.yaml")
  depends_on = [helm_release.cert-manager]
}

resource "kubernetes_namespace" "k6_operator" {
  metadata {
    name = "k6-operator-system"
  }
}

resource "helm_release" "k6_operator" {
  name       = "k6-operator"
  repository = "https://grafana.github.io/helm-charts"
  chart      = "k6-operator"
  namespace  = kubernetes_namespace.k6_operator.metadata[0].name

  set {
    name  = "createCustomResource"
    value = "true"
  }

  depends_on = [kubernetes_namespace.k6_operator]
}

output "container_registry" {
  description = "Endpoint of the DigitalOcean Container Registry"
  value       = digitalocean_container_registry.registry.endpoint
}

output "kubeconfig_path" {
  description = "Path to the saved kubeconfig file"
  value       = local_file.kubeconfig.filename
}

output "cluster_id" {
  description = "ID of the Kubernetes cluster"
  value       = digitalocean_kubernetes_cluster.cluster.id
}