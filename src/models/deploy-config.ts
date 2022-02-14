import YAML from 'yaml'
import path from 'path'

export class DeployConfig {
    static readonly DEPLOY_FILE_NAME = "bcd-deploy.yaml"

    static parse(repo_path: string): DeployConfig {
        const file_path = path.resolve(repo_path, DeployConfig.DEPLOY_FILE_NAME)
        const yaml = YAML.parse(file_path)
        console.log(yaml)

        const config = new DeployConfig()
        return config
    }

    execActions() {

    }
}