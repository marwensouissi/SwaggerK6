#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive
sudo sed -i 's/^#\$nrconf{restart} =.*/\$nrconf{restart} = '\''a'\'';/g' /etc/needrestart/needrestart.conf || true


#!/bin/bash

echo "🔧 Updating system packages..."
sudo DEBIAN_FRONTEND=noninteractive apt-get update -y && \
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y


echo "🐳 Installing Docker..."
sudo apt-get install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker

echo "⚙️ Installing curl, wget, unzip, and other essentials..."
sudo apt-get install -y curl wget unzip bash ca-certificates gnupg lsb-release

echo "📦 Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

echo "🚀 Installing Minikube..."
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64

echo "🎮 Starting Minikube with Docker driver..."
sudo minikube start --driver=docker --force

echo "🔧 Setting kubectl alias for Minikube..."
alias kubectl="minikube kubectl --"

echo "📦 Installing Helm..."
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

echo "📡 Adding Grafana Helm repo for k6 Operator..."
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

echo "📥 Installing k6-operator via Helm..."
helm install k6-operator grafana/k6-operator


echo "✅ Setup complete!"
echo "Minikube is running, Helm is installed, and k6-operator is deployed."
