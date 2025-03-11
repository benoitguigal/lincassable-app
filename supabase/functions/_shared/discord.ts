import { WebhookClient } from "npm:discord.js";

const webhookId = Deno.env.get("DISCORD_WEBHOOK_ID");
const webhookToken = Deno.env.get("DISCORD_WEBHOOK_TOKEN");

const discordClient = new WebhookClient({
  id: webhookId ?? "",
  token: webhookToken ?? "",
});

export default discordClient;
