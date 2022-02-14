import { Webhooks, createNodeMiddleware } from "@octokit/webhooks"
import { WebhookEventName } from "@octokit/webhooks-types";
import { HandlerFunction } from "@octokit/webhooks/dist-types/types";
import http from "http"
import { AppConfig } from "./config/app-config";
import child_process from "child_process";
import path from "path";
import { resolveHome } from "./utils/resolve-home";

const config = new AppConfig()

const webhooks = new Webhooks({
    secret: config.webhook_secret
});

function addWebhook<E extends WebhookEventName>(webhooks: Webhooks, event: E | E[], callback: HandlerFunction<E, unknown>) {
    webhooks.on(event, callback);
}

addWebhook(webhooks, "push", (options) => {
    const payload = options.payload
    const default_branch = options.payload.repository.default_branch
    console.log(payload)

    const ssh_url = options.payload.repository.ssh_url;
    const repo_path = path.resolve(resolveHome(config.deploy_url), `${options.payload.repository.name}-${options.payload.repository.id}`);
    console.log(`git clone ${ssh_url} ${repo_path}`)
    child_process.exec(`git clone ${ssh_url} ${repo_path}`)
})

http.createServer(createNodeMiddleware(webhooks, {path: '/'})).listen(config.port, () => {
    console.log(`Webhook server listening on PORT ${config.port}`)
});
