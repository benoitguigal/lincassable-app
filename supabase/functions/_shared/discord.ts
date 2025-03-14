import { WebhookClient } from "npm:discord.js";

export const webhooks = {
  remplissage: new WebhookClient({
    id: Deno.env.get("DISCORD_REMPLISSAGE_WEBHOOK_ID") ?? "",
    token: Deno.env.get("DISCORD_REMPLISSAGE_WEBHOOK_TOKEN") ?? "",
  }),
  tournee: new WebhookClient({
    id: Deno.env.get("DISCORD_TOURNEE_WEBHOOK_ID") ?? "",
    token: Deno.env.get("DISCORD_TOURNEE_WEBHOOK_TOKEN") ?? "",
  }),
  cyke: new WebhookClient({
    id: Deno.env.get("DISCORD_CYKE_WEBHOOK_ID") ?? "",
    token: Deno.env.get("DISCORD_CYKE_WEBHOOK_TOKEN") ?? "",
  }),
};
