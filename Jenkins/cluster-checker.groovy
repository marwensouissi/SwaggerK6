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

    stage('Terraform Init and checking cluster') {
        withCredentials([string(credentialsId: 'DO_TOKEN', variable: 'DO_TOKEN')]) {
            sh '''
                cd /var/jenkins/workspace/DevOps/K6/cluster-builder-k6/
                export PATH=/usr/local/bin:$PATH
                echo "⚙️ Initializing Terraform..."
                terraform init
                if terraform state list | grep digitalocean_kubernetes_cluster.k8s_cluster; then
                    exit 0
                else
                    echo " No existing cluster found. Proceeding with Terraform plan and apply..."

                fi
            '''
        }
    }
}
