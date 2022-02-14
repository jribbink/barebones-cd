import { Webhooks, createNodeMiddleware, EmitterWebhookEvent } from "@octokit/webhooks"
import { WebhookEvent, IssuesOpenedEvent } from "@octokit/webhooks-types";

const webhooks = new Webhooks({
    secret: ""
});

webhooks.onAny((event: EmitterWebhookEvent) => {
  console.log(event)
});

require("http").createServer(createNodeMiddleware(webhooks)).listen(3000);
