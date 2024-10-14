// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "jsr:@supabase/supabase-js@2";
import { WebhookClient } from "npm:discord.js";

const webhookId = Deno.env.get("DISCORD_WEBHOOK_ID");
const webhookToken = Deno.env.get("DISCORD_WEBHOOK_TOKEN");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  const { record, old_record } = await req.json();

  const supabaseClient = createClient(
    supabaseUrl ?? "",
    supabaseServiceRoleKey
  );

  const { data: tournees } = await supabaseClient
    .from("tournee")
    .select("*")
    .eq("id", record.id);

  if (tournees?.length) {
    const tournee = tournees[0];

    const { data: zoneDeCollectes } = await supabaseClient
      .from("zone_de_collecte")
      .select("*")
      .eq("id", tournees?.[0].zone_de_collecte_id);

    const { data: transporteurs } = await supabaseClient
      .from("transporteur")
      .select("*")
      .eq("id", tournees?.[0].transporteur_id);

    if (zoneDeCollectes?.length && transporteurs?.length) {
      const zoneDeCollecte = zoneDeCollectes[0];
      const transporteur = transporteurs[0];

      let msg = `La tournée ${zoneDeCollecte.nom} du ${tournee.date} par le transporteur ${transporteur.nom} a été modifiée`;

      if (record.date !== old_record.date) {
        msg =
          msg +
          `\nAncienne date : ${old_record.date} - Nouvelle date : ${record.date}`;
      }

      if (record.statut !== old_record.statut) {
        msg =
          msg +
          `\nAncien statut : ${old_record.statut} - Nouveau statut : ${record.statut}`;
      }

      if (record.prix !== old_record.prix) {
        msg =
          msg +
          `\nAncien prix : ${old_record.prix} - Nouveau prix : ${record.prix}`;
      }

      const webhookClient = new WebhookClient({
        id: webhookId,
        token: webhookToken,
      });

      await webhookClient.send({
        content: msg,
      });

      return new Response(
        JSON.stringify({
          status: `OK`,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return new Response(JSON.stringify({ status: "not_found" }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send_discord_message_tournee_update' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
