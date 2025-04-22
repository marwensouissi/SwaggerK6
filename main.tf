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

# Cluster resource
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

# Kubeconfig file
resource "local_file" "kubeconfig_yaml" {
  content  = digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].raw_config
  filename = "${path.module}/kubeconfig_do.yaml"
}

# Kubernetes provider configuration
provider "kubernetes" {
  host                   = digitalocean_kubernetes_cluster.k8s_cluster.endpoint
  cluster_ca_certificate = base64decode(digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].cluster_ca_certificate)
  token                  = digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].token
}

# Helm provider configuration
provider "helm" {
  kubernetes {
    host                   = digitalocean_kubernetes_cluster.k8s_cluster.endpoint
    cluster_ca_certificate = base64decode(digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].cluster_ca_certificate)
    token                  = digitalocean_kubernetes_cluster.k8s_cluster.kube_config[0].token
  }
}

# Add delay to ensure cluster is ready
resource "time_sleep" "wait_for_cluster" {
  depends_on = [digitalocean_kubernetes_cluster.k8s_cluster]

  create_duration = "90s"
}

# Test cluster connectivity with a simple resource
resource "kubernetes_config_map" "cluster_ready" {
  metadata {
    name = "cluster-ready-check"
  }

  data = {
    ready = "true"
  }

  depends_on = [time_sleep.wait_for_cluster]
}

# K6 Operator installation
resource "helm_release" "k6_operator" {
  name             = "k6-operator"
  repository       = "https://grafana.github.io/helm-charts"
  chart            = "k6-operator"
  namespace        = "default"
  create_namespace = true
  wait             = true
  timeout          = 300

  depends_on = [
    kubernetes_config_map.cluster_ready
  ]
}

output "kubeconfig_path" {
  value = abspath(local_file.kubeconfig_yaml.filename)
}