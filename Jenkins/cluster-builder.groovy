properties([
    parameters([
        string(name: 'REGION', defaultValue: 'nyc3', description: 'DigitalOcean Region'),
        string(name: 'CLUSTER_NAME', defaultValue: 'k8s-k6-cluster', description: 'Kubernetes Cluster Name'),
        string(name: 'NODE_SIZE', defaultValue: 's-2vcpu-4gb', description: 'Node Size'),
        string(name: 'FILENAME', defaultValue: 'filename', description: 'filename')

    ])
])

node("mac-mini") {

    stage('Clone Repository') {
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/main']],
            userRemoteConfigs: [[
                url: 'https://bitbucket.org/ndammak/itona-k6.git',
                credentialsId: 'bitbucket_cred'
            ]]
        ])
    }



    stage('Terraform Apply Cluster Only') {
        withCredentials([string(credentialsId: 'DO_TOKEN', variable: 'DO_TOKEN')]) {
            sh '''
                export PATH=/usr/local/bin:$PATH
                terraform init
                terraform apply -auto-approve \
                    -target=digitalocean_kubernetes_cluster.k8s_cluster \
                    -target=local_file.kubeconfig_yaml \
                    -var="do_token=${DO_TOKEN}" \
                    -var="region=${REGION}" \
                    -var="cluster_name=${CLUSTER_NAME}" \
                    -var="node_size=${NODE_SIZE}"
            '''
        }
    }

    stage('Terraform Apply Remaining Resources') {
        withCredentials([string(credentialsId: 'DO_TOKEN', variable: 'DO_TOKEN')]) {
            sh '''
                export PATH=/usr/local/bin:$PATH

                terraform apply -auto-approve \
                    -var="do_token=${DO_TOKEN}" \
                    -var="region=${REGION}" \
                    -var="cluster_name=${CLUSTER_NAME}" \
                    -var="node_size=${NODE_SIZE}"
                    sleep 20
            '''
        }
    }
 
 
 
 
stage('Configure Kubeconfig and Verify Cluster') {
    withCredentials([usernamePassword(credentialsId: 'bitbucket_cred', usernameVariable: 'BB_USER', passwordVariable: 'BB_TOKEN')]) {
        sh '''
            export PATH=/usr/local/bin:$PATH
            export KUBECONFIG="$(pwd)/kubeconfig_do.yaml"
            echo "✅ Using kubeconfig at: $KUBECONFIG"
            # Apply manifests using kubectl
            kubectl apply -f k6-tests-app.yaml
            kubectl get nodes
            kubectl get pods -A
        '''
    }
}


stage('Run MQTT Test with xk6 Image') {
        withCredentials([usernamePassword(
            credentialsId: 'docker_creds',
            usernameVariable: 'DOCKER_USERNAME',
            passwordVariable: 'DOCKER_PASSWORD'
        )]) {
        sh '''
                    export PATH=/usr/local/bin:$PATH
                    export KUBECONFIG="$(pwd)/kubeconfig_do.yaml"
            echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
            # Pull prebuilt xk6 image
            docker pull ndammakian/xk6-images:1.0
        '''
    }
}

stage('Automate ArgoCD Repo Registration') {
    withCredentials([usernamePassword(credentialsId: 'bitbucket_cred', usernameVariable: 'BB_USER', passwordVariable: 'BB_TOKEN')]) {
        sh '''
            export PATH=/usr/local/bin:$PATH
            export KUBECONFIG="$(pwd)/kubeconfig_do.yaml"

            echo "⏳ Waiting for ArgoCD pods to be ready..."
            kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=60s
            kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-dex-server -n argocd --timeout=60s
            kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-redis -n argocd --timeout=60s
            echo "✅ ArgoCD pods are ready"

            echo "🔍 Waiting for ArgoCD LoadBalancer IP..."
            for i in {1..60}; do
              ARGOCD_SERVER=$(kubectl -n argocd get svc argocd-server \
                -o jsonpath="{.status.loadBalancer.ingress[0].ip}" 2>/dev/null)
              if [ -n "$ARGOCD_SERVER" ] && [ "$ARGOCD_SERVER" != "null" ]; then
                echo "✅ ArgoCD server IP: $ARGOCD_SERVER"
                break
              fi
              echo "⏳ Attempt $i: Waiting for IP..."
              sleep 10
            done

            if [ -z "$ARGOCD_SERVER" ] || [ "$ARGOCD_SERVER" = "null" ]; then
              echo "❌ Failed to get ArgoCD external IP"
              kubectl -n argocd get svc argocd-server -o yaml
              exit 1
            fi

            echo "🌐 Verifying ArgoCD is reachable at http://$ARGOCD_SERVER"
            for i in {1..60}; do
              if curl --silent --max-time 10 --connect-timeout 5 "http://$ARGOCD_SERVER" > /dev/null 2>&1; then
                echo "✅ ArgoCD is reachable"
                break
              fi
              echo "⏳ Attempt $i: Waiting for ArgoCD to respond..."
              sleep 10
            done

            echo "🔑 Getting ArgoCD admin password..."
            ARGOCD_PWD=$(kubectl -n argocd get secret argocd-initial-admin-secret \
              -o jsonpath="{.data.password}" | base64 --decode)
            echo " Logging in to ArgoCD CLI..."
            
            # Multiple login attempts with different approaches
            LOGIN_SUCCESS=false
            sleep 10

            # Attempt 1: Standard login with grpc-web
            echo "Attempt 1: Standard login with grpc-web"
             argocd login "$ARGOCD_SERVER" \
                --username admin \
                --password "$ARGOCD_PWD" \
                --insecure \
                --skip-test-tls \
                --grpc-web


            echo "✅ Successfully logged in to ArgoCD"
            argocd account get-user-info
            
                    ARGOCD_SERVER=\$(kubectl -n argocd get svc argocd-server -o 'jsonpath={.status.loadBalancer.ingress[0].ip}')
        echo '[ARGOCD_IP]' \$ARGOCD_SERVER
            
            
            # Add the repository
                    sleep 5

            argocd repo add https://bitbucket.org/ndammak/itona-k6.git \
              --username "$BB_USER" \
              --password "$BB_TOKEN" \
              --type git


            echo "✅ Repository registered successfully"
                    sleep 10

            argocd app get k6-tests --refresh

            
        '''
    }
}

stage('Automate Loki') {
    sh '''
        set +x
        export PATH=/usr/local/bin:$PATH
        export KUBECONFIG="$(pwd)/kubeconfig_do.yaml"

        chmod +x loki-fluentbit.sh
        ./loki-fluentbit.sh
        sleep 60

        LOKI_SERVER=$(kubectl -n observability get svc loki-stack -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
        echo "LOKI_SERVER=$LOKI_SERVER"

        kubectl get pods -A
    '''
}

stage('Getting Pod Names') {
    def filenames = params.FILENAME.split(",")
    int podCounter = 1

    filenames.each { fname ->
        def base = fname.replace(".js", "")
        echo "🔍 Searching for pod matching base name: ${base}"

        def podName = sh(
            script: """
                export PATH=/usr/local/bin:\$PATH
                export KUBECONFIG=\$(pwd)/kubeconfig_do.yaml

                ATTEMPTS=0
                MAX_ATTEMPTS=20
                POD=""

                while [ \$ATTEMPTS -lt \$MAX_ATTEMPTS ]; do
                    POD=\$(kubectl get pods -n default -o jsonpath='{.items[*].metadata.name}' | tr ' ' '\\n' | grep "^${base}-" | head -n 1)

                    if [ -n "\$POD" ]; then
                        STATUS=\$(kubectl get pod "\$POD" -n default -o jsonpath='{.status.phase}' || true)
                        READY=\$(kubectl get pod "\$POD" -n default -o jsonpath='{.status.containerStatuses[0].ready}' || true)

                        if { [ "\$STATUS" = "Running" ] || [ "\$STATUS" = "Succeeded" ]; } && [ "\$READY" = "true" ]; then
                            echo "\$POD"
                            break
                        fi
                    fi

                    echo "⏳ Attempt \$ATTEMPTS/\$MAX_ATTEMPTS: Pod not ready, retrying..."
                    ATTEMPTS=\$((ATTEMPTS + 1))
                    sleep 10
                done

                if [ \$ATTEMPTS -eq \$MAX_ATTEMPTS ]; then
                    echo "❌ Timeout: No ready pod found for ${base}" >&2
                    exit 1
                fi
                """,
            returnStdout: true
        ).trim()

        echo "✅ POD_NAME=pod-${podCounter}:${podName}"
        podCounter++
    }

    echo "✅ All pod names collected successfully."
}

stage('Getting Exposed Pods IP') {
    sh '''
        export PATH=/usr/local/bin:$PATH
        export KUBECONFIG="$(pwd)/kubeconfig_do.yaml"
        kubectl get svc

'''

}


}