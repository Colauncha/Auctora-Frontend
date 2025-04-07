pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    pwd
                    ls -la
                    npm i
                    npm run build
                    sudo rm -rf /var/www/biddius/html/*
                    sudo cp -r ./dist/* /var/www/biddius/html/
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline finished successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            echo 'Pipeline finished (success or fail).'
        }
    }
}