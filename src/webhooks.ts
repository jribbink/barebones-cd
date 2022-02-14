import { Webhooks as OctokitWebhooks } from "@octokit/webhooks";
import { Repository, WebhookEventName } from "@octokit/webhooks-types";
import { HandlerFunction, Options } from "@octokit/webhooks/dist-types/types";
import { AppConfig } from "./app-config";
import child_process from "child_process";
import path from "path";
import fs from "fs";
import { resolveHome } from "./utils/resolve-home";
import { DeployConfig } from "./models/deploy-config";

const config = AppConfig.getInstance()

export class Webhooks extends OctokitWebhooks {
    constructor(options: Options & {secret: string}) {
        super(options)
        this.addWebhooks()
    }

    addWebhook<E extends WebhookEventName>(event: E | E[], callback: HandlerFunction<E, unknown>) {
        this.on(event, callback);
    }

    addWebhooks() {
        this.addWebhook("push", (options) => {
            const payload = options.payload
            console.log(payload)

            this.updateRepo(options.payload.repository)
        })

        this.addWebhook("create", (options) => {
            this.updateRepo(options.payload.repository)
        })
    }

    private updateRepo (repository: Repository) {
        const default_branch = repository.default_branch
        const ssh_url = repository.ssh_url;
        const repo_path = path.resolve(resolveHome(config.deploy_url), `${repository.name}-${repository.id}`);

        if (!fs.existsSync(repo_path)) {
            child_process.exec(`git clone '${ssh_url}' '${repo_path}'`, (error) => {
                console.log(error)
                console.log(`Repository ${repository.full_name} cloned to ${repo_path}, deploying...`)

                this.parseConfig(repo_path)
            })
        } else {
            child_process.exec(`git -C '${repo_path}' reset --hard`, () => {
                child_process.exec(`git clean -n -f ${repo_path}`, () => {
                    child_process.exec(`git -C '${repo_path}' pull`, () => {
                        console.log(`Pulled new changes from ${repository.full_name}, redeploying...`)

                        this.parseConfig(repo_path)
                    })
                })
            })
        }
    }

    private parseConfig(repo_path: string) {
        DeployConfig.parse(repo_path)
    }
}