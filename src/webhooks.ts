import { Webhooks as OctokitWebhooks } from "@octokit/webhooks";
import { Repository, WebhookEventName } from "@octokit/webhooks-types";
import { HandlerFunction, Options } from "@octokit/webhooks/dist-types/types";
import { AppConfig } from "./app-config";
import child_process from "child_process";
import path from "path";
import fs from "fs";
import { ProjectConfig } from "./project-config";
import { Project } from "./project";

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
        this.addWebhook(["push", "create"], (options) => {
            this.updateRepo(options.payload.repository)
        })
    }

    private updateRepo (repository: Repository) {
        const project = new Project(repository)
        project.updateRepo()
    }
}