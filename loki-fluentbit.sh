#!/bin/bash

set -e

cd /private/var/jenkins/workspace/DevOps/K6/cluster-builder-k6
export KUBECONFIG="$(pwd)/kubeconfig_do.yaml"


ls 
# Variables
NAMESPACE="observability"
LOKI_RELEASE_NAME="loki"
FLUENT_BIT_RELEASE_NAME="fluent-bit"
LOKI_HELM_REPO="https://grafana.github.io/helm-charts"
FLUENT_BIT_HELM_REPO="https://fluent.github.io/helm-charts"

echo "🛠️ Creating namespace $NAMESPACE..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

echo "🔗 Adding Helm repositories..."
helm repo add grafana $LOKI_HELM_REPO
helm repo add fluent $FLUENT_BIT_HELM_REPO
helm repo update



helm install loki-stack grafana/loki-stack \
  --namespace observability \
  --set fluent-bit.enabled=true \
    --set loki.service.type=LoadBalancer \
  --set promtail.enabled=false \
  --set grafana.enabled=false \
  --set loki.enabled=true





echo "📦 Installing Fluent Bit with custom config..."
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-custom-config
  namespace: observability
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush         1
        Daemon        Off
        Log_Level     warn
        Parsers_File  parsers.conf
        HTTP_Server   On
        HTTP_Listen   0.0.0.0
        HTTP_PORT     2020

    [INPUT]
        Name              tail
        Tag               kube.*
        Path              /var/log/containers/*.log
        Parser            docker
        DB                /run/fluent-bit/flb_kube.db
        Mem_Buf_Limit     5MB
        Buffer_Chunk_Size 32k
        Buffer_Max_Size   32k

    [FILTER]
        Name                kubernetes
        Match               kube.*
        Kube_URL            https://kubernetes.default.svc:443
        Merge_Log           On
        K8S-Logging.Parser  Off
        Labels              On
        Annotations         Off

    [OUTPUT]
        Name                loki
        Match               kube.*
        Url                 http://loki.observability.svc.cluster.local:3100/loki/api/v1/push
        Labels              {job="fluent-bit"}
        LineFormat          json
        LogLevel            warn
        AutoKubernetesLabels false
        RemoveKeys          kubernetes,stream
        LabelMapPath        /fluent-bit/etc/labelmap.json
  parsers.conf: |
    [PARSER]
        Name        docker
        Format      json
        Time_Key    time
        Time_Format %Y-%m-%dT%H:%M:%S.%L
  labelmap.json: |
    {
      "kubernetes": {
        "container_name": "container",
        "host": "node",
        "labels": {
          "app": "app",
          "release": "release"
        },
        "namespace_name": "namespace",
        "pod_name": "instance"
      },
      "stream": "stream"
    }
EOF

# helm upgrade --install $FLUENT_BIT_RELEASE_NAME fluent/fluent-bit \
#   --namespace $NAMESPACE \
#   --set config.existingConfigMap=fluent-bit-custom-config

