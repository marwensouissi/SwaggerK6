
node("mac-mini") {



    stage('Terraform Destroy') {
        withCredentials([string(credentialsId: 'DO_TOKEN', variable: 'DO_TOKEN')]) {
            sh '''
            cd /var/jenkins/workspace/DevOps/K6/cluster-builder-k6
                            export PATH=/usr/local/bin:$PATH
            export KUBECONFIG="$(pwd)/kubeconfig_do.yaml"
                        terraform init

kubectl delete svc --all -A
kubectl delete ingress --all -A
kubectl delete pvc --all -A
kubectl delete pv --all

    sleep 80    
                terraform destroy -auto-approve \
                    -var="do_token=${DO_TOKEN}" \
                    
                rm -f k6-tests-app.yaml
            '''
        }
    }
}


