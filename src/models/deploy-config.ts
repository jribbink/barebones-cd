import YAML from 'yaml'

export class DeployConfig {
    static parse(filename: string): DeployConfig {
        const yaml = YAML.parse(filename)
        console.log(yaml)

        const config = new DeployConfig()
        return config
    }

    execActions() {

    }
}