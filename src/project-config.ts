import YAML from 'yaml'
import path from 'path'
import fs from 'fs'
import child_process from 'child_process'

export class ProjectActions {
    install?: string
    build?: string
    serve?: string
}

export class Deployment {
    path?: string
    actions?: ProjectActions
}

export class ProjectConfig {
    static readonly DEPLOY_FILE_NAME = "bcd-deploy.yaml"

    name?: string
    deployments?: {[key:string]:Deployment}

    constructor(repo_path: string) {
        const file_path = path.resolve(repo_path, ProjectConfig.DEPLOY_FILE_NAME)
        const config_object = YAML.parse(fs.readFileSync(file_path).toString())

        Object.assign(this, config_object)
    } 
}