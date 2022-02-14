import { Webhooks } from './webhooks'
import { createNodeMiddleware } from "@octokit/webhooks"
import http from "http"
import { AppConfig } from "./app-config";

const config = AppConfig.getInstance()
const webhooks = new Webhooks({
    secret: config.webhook_secret
});

http.createServer(createNodeMiddleware(webhooks, {path: '/'})).listen(config.port, () => {
    console.log(`Webhook server listening on PORT ${config.port}`)
});
