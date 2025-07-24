#!/bin/bash

set -e

cd /private/var/jenkins/workspace/DevOps/K6/cluster-builder-k6
export KUBECONFIG="$(pwd)/kubeconfig_do.yaml"

NAMESPACE="observability"
LOKI_RELEASE_NAME="loki"
FLUENT_BIT_RELEASE_NAME="fluent-bit"
LOKI_HELM_REPO="https://grafana.github.io/helm-charts"
FLUENT_BIT_HELM_REPO="https://fluent.github.io/helm-charts"

echo "🛠️ Creating namespace $NAMESPACE..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# echo "🔗 Adding Helm repositories..."
# helm repo add grafana $LOKI_HELM_REPO
# helm repo add fluent $FLUENT_BIT_HELM_REPO
# helm repo update



helm upgrade --install loki-stack grafana/loki-stack \
  --namespace observability \
    -f fluent-bit-fluent-bit-loki.yaml \
  --set fluent-bit.enabled=true \
    --set loki.service.type=LoadBalancer \
  --set promtail.enabled=false \
  --set grafana.enabled=false \
  --set loki.enabled=true

