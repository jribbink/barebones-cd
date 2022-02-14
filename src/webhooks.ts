import { Webhooks as OctokitWebhooks } from "@octokit/webhooks";
import { WebhookEventName } from "@octokit/webhooks-types";
import { HandlerFunction, Options } from "@octokit/webhooks/dist-types/types";
import { AppConfig } from "./app-config";
import child_process from "child_process";
import path from "path";
import { resolveHome } from "./utils/resolve-home";

const config = AppConfig.getInstance()

export class Webhooks extends OctokitWebhooks {
    constructor(options: Options & {secret: string}) {
        super(options)
    }

    addWebhook<E extends WebhookEventName>(event: E | E[], callback: HandlerFunction<E, unknown>) {
        this.on(event, callback);
    }

    addWebhooks() {
        this.addWebhook("push", (options) => {
            const payload = options.payload
            const default_branch = options.payload.repository.default_branch
            console.log(payload)
        
            const ssh_url = options.payload.repository.ssh_url;
            const repo_path = path.resolve(resolveHome(config.deploy_url), `${options.payload.repository.name}-${options.payload.repository.id}`);
            child_process.exec(`git clone ${ssh_url} ${repo_path}`, () => {
                console.log("Cloned")
            })
        })
    }
}